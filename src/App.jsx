import { useState } from 'react';
import { loadData, saveData } from './storage';
import { getStoredApiKey } from './api';
import HomeView from './components/HomeView';
import SessionView from './components/SessionView';
import WrapupView from './components/WrapupView';
import PartDetailView from './components/PartDetailView';
import SetupView from './components/SetupView';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function App() {
  const [view, setView] = useState(() => getStoredApiKey() ? 'home' : 'setup');
  const [sessionMessages, setSessionMessages] = useState([]);
  const [activePart, setActivePart] = useState(null);
  const [data, setData] = useState(loadData);

  function refreshData() {
    setData(loadData());
  }

  function handleStartSession() {
    setSessionMessages([]);
    setView('session');
  }

  function handleWrapUp(messages) {
    setSessionMessages(messages);
    setView('wrapup');
  }

  function handleSaveSession(sessionPayload) {
    const current = loadData();
    const id = generateId();
    const now = new Date().toISOString();

    const newSession = {
      id,
      date: now,
      summary: sessionPayload.summary,
      insights: sessionPayload.insights,
      partsActive: sessionPayload.partsActive,
      exploreTouched: sessionPayload.exploreTouched,
      messages: sessionPayload.messages,
    };

    current.sessions.push(newSession);

    for (const key of sessionPayload.partsActive) {
      if (current.parts[key]) {
        current.parts[key].lastVisit = now;
        if (!current.parts[key].sessionIds.includes(id)) {
          current.parts[key].sessionIds.push(id);
        }
      }
    }

    for (const eid of sessionPayload.exploreTouched) {
      if (current.explore[eid]) {
        current.explore[eid].touched = true;
        current.explore[eid].count = (current.explore[eid].count || 0) + 1;
      }
    }

    saveData(current);
    setData(current);
  }

  function handleDiscard() {
    refreshData();
    setView('home');
  }

  function handleViewPart(key) {
    setActivePart(key);
    setView('part');
  }

  return (
    <>
      {view === 'setup' && (
        <SetupView onDone={() => setView('home')} />
      )}
      {view === 'home' && (
        <HomeView
          data={data}
          onStartSession={handleStartSession}
          onViewPart={handleViewPart}
          onChangeKey={() => setView('setup')}
        />
      )}
      {view === 'session' && (
        <SessionView
          onBack={() => setView('home')}
          onWrapUp={handleWrapUp}
        />
      )}
      {view === 'wrapup' && (
        <WrapupView
          messages={sessionMessages}
          data={data}
          onSave={handleSaveSession}
          onDiscard={handleDiscard}
        />
      )}
      {view === 'part' && (
        <PartDetailView
          partKey={activePart}
          data={data}
          onBack={() => setView('home')}
        />
      )}
    </>
  );
}
