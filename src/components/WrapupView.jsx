import { useState, useEffect } from 'react';
import { callClaude } from '../api';
import { EXTRACT_SYSTEM } from '../prompts';
import { PARTS, EXPLORE } from '../partsConfig';
import PartCard from './PartCard';
import ExploreList from './ExploreList';

function buildTranscript(messages) {
  return messages
    .map(m => `${m.role === 'user' ? 'Anna' : 'Companion'}: ${m.content}`)
    .join('\n\n');
}

function parseExtraction(raw) {
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

export default function WrapupView({ messages, data, onSave, onDiscard }) {
  const [stage, setStage] = useState('extracting');
  const [extracted, setExtracted] = useState(null);
  const [selectedParts, setSelectedParts] = useState([]);
  const [selectedExplore, setSelectedExplore] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    extract();
  }, []);

  async function extract() {
    const transcript = buildTranscript(messages);
    try {
      const raw = await callClaude(
        [{ role: 'user', content: `Here is the session transcript:\n\n${transcript}` }],
        EXTRACT_SYSTEM,
        600,
      );
      const parsed = parseExtraction(raw);
      setExtracted(parsed);
      setSelectedParts(parsed.partsActive || []);
      setSelectedExplore(parsed.exploreTouched || []);
    } catch (e) {
      setExtracted({ summary: '', insights: [], partsActive: [], exploreTouched: [] });
      setSelectedParts([]);
      setSelectedExplore([]);
      setError('Could not extract insights automatically — please review and select manually.');
    } finally {
      setStage('review');
    }
  }

  function togglePart(key) {
    setSelectedParts(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  }

  function toggleExplore(id) {
    setSelectedExplore(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  }

  function handleSave() {
    onSave({
      summary: extracted?.summary || '',
      insights: extracted?.insights || [],
      partsActive: selectedParts,
      exploreTouched: selectedExplore,
      messages,
    });
    setStage('done');
  }

  const containerStyle = {
    maxWidth: 680,
    margin: '0 auto',
    padding: '40px 20px 60px',
  };

  const sectionLabel = {
    fontSize: 11,
    fontWeight: 700,
    color: '#5C6E80',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 12,
  };

  if (stage === 'extracting') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 16,
        color: '#5C6E80',
      }}>
        <div style={{ fontSize: 32 }}>◌</div>
        <p style={{ fontSize: 16, fontWeight: 500 }}>Reflecting on your session...</p>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 20,
        padding: 24,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 40 }}>♡</div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1C2B3A' }}>
          Session saved.
        </h2>
        <p style={{ fontSize: 15, color: '#5C6E80', maxWidth: 320 }}>
          Your parts have been heard today.
        </p>
        <button
          onClick={onDiscard}
          style={{
            background: '#4A7E8C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 10,
            padding: '12px 28px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1C2B3A', marginBottom: 6 }}>
        Session Review
      </h2>
      <p style={{ fontSize: 14, color: '#5C6E80', marginBottom: 32 }}>
        Confirm what came up, then save.
      </p>

      {error && (
        <div style={{
          background: '#FFF3CD',
          border: '1px solid #E6C84A',
          borderRadius: 8,
          padding: '10px 14px',
          fontSize: 13,
          color: '#7A5C00',
          marginBottom: 24,
        }}>
          {error}
        </div>
      )}

      {extracted?.summary && (
        <div style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>Summary</div>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #DDE4EC',
            borderRadius: 10,
            padding: '14px 18px',
            fontSize: 15,
            color: '#1C2B3A',
            lineHeight: 1.6,
            fontStyle: 'italic',
          }}>
            {extracted.summary}
          </div>
        </div>
      )}

      {extracted?.insights?.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={sectionLabel}>Insights</div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {extracted.insights.map((insight, i) => (
              <li key={i} style={{
                background: '#FFFFFF',
                border: '1px solid #DDE4EC',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 14,
                color: '#1C2B3A',
                lineHeight: 1.5,
                display: 'flex',
                gap: 10,
              }}>
                <span style={{ color: '#4A7E8C', flexShrink: 0 }}>—</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: 32 }}>
        <div style={sectionLabel}>Parts present (tap to toggle)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {Object.keys(PARTS).map(key => (
            <PartCard
              key={key}
              partKey={key}
              lastVisit={data.parts?.[key]?.lastVisit}
              selected={selectedParts.includes(key)}
              selectable={true}
              onClick={() => togglePart(key)}
            />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 36 }}>
        <div style={sectionLabel}>Themes explored (tap to toggle)</div>
        <ExploreList
          exploreData={data.explore}
          selected={selectedExplore}
          onToggle={toggleExplore}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleSave}
          style={{
            flex: 1,
            background: '#4A7E8C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 10,
            padding: '14px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Save Session
        </button>
        <button
          onClick={onDiscard}
          style={{
            flex: 1,
            background: 'none',
            color: '#5C6E80',
            border: '1px solid #DDE4EC',
            borderRadius: 10,
            padding: '14px',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          Discard
        </button>
      </div>
    </div>
  );
}
