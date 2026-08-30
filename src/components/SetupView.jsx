import { useState } from 'react';
import { saveApiKey } from '../api';

export default function SetupView({ onDone }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [testing, setTesting] = useState(false);

  async function handleSave() {
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('That doesn\'t look like an Anthropic key — it should start with sk-ant-');
      return;
    }
    setTesting(true);
    setError('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': trimmed,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 5,
          messages: [{ role: 'user', content: 'hi' }],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Error ${res.status}`);
      }
      saveApiKey(trimmed);
      onDone();
    } catch (e) {
      setError(e.message);
    } finally {
      setTesting(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #DDE4EC',
        borderRadius: 14,
        padding: '36px 32px',
        maxWidth: 480,
        width: '100%',
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1C2B3A', marginBottom: 8 }}>
          IFS Daily Practice
        </h1>
        <p style={{ fontSize: 14, color: '#5C6E80', marginBottom: 28, lineHeight: 1.6 }}>
          This app uses the Anthropic API to guide your sessions. Your API key is stored
          only in this browser — it never leaves your device and is never sent to GitHub.
        </p>

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1C2B3A', marginBottom: 8 }}>
          Anthropic API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="sk-ant-api03-..."
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1px solid #DDE4EC',
            borderRadius: 8,
            fontSize: 14,
            color: '#1C2B3A',
            fontFamily: 'monospace',
            marginBottom: 8,
            outline: 'none',
          }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />

        {error && (
          <p style={{ fontSize: 13, color: '#8C3030', marginBottom: 12 }}>{error}</p>
        )}

        <button
          onClick={handleSave}
          disabled={testing || !key.trim()}
          style={{
            width: '100%',
            padding: '12px',
            background: testing ? '#8AABB5' : '#4A7E8C',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: testing ? 'default' : 'pointer',
            marginTop: 4,
          }}
        >
          {testing ? 'Verifying...' : 'Save & Continue'}
        </button>

        <p style={{ fontSize: 12, color: '#5C6E80', marginTop: 16, lineHeight: 1.5 }}>
          Get your key at{' '}
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer"
            style={{ color: '#4A7E8C' }}>
            console.anthropic.com
          </a>
          . Create a <strong>Workspace</strong> type key (not identity-linked).
        </p>
      </div>
    </div>
  );
}
