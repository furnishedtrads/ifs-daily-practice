import { useState, useEffect, useRef } from 'react';
import { callClaude } from '../api';
import { IFS_SYSTEM } from '../prompts';

function TypingDots() {
  const dotStyle = base => ({
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#5C6E80',
    display: 'inline-block',
    animation: 'pulse 1.4s ease-in-out infinite',
    animationDelay: base,
  });

  return (
    <div style={{ display: 'flex', gap: 5, padding: '10px 14px', alignItems: 'center' }}>
      <span style={dotStyle('0s')} />
      <span style={dotStyle('0.2s')} />
      <span style={dotStyle('0.4s')} />
    </div>
  );
}

export default function SessionView({ onBack, onWrapUp }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const assistantCount = messages.filter(m => m.role === 'assistant').length;
  const bottomRef = useRef(null);

  useEffect(() => {
    startSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function startSession() {
    setLoading(true);
    setError(null);
    const openingMsg = [{ role: 'user', content: "I'm starting my IFS check-in for today." }];
    try {
      const reply = await callClaude(openingMsg, IFS_SYSTEM, 800);
      setMessages([
        { role: 'user', content: "I'm starting my IFS check-in for today." },
        { role: 'assistant', content: reply },
      ]);
    } catch (e) {
      setError(e.message);
      setMessages([{ role: 'user', content: "I'm starting my IFS check-in for today." }]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError(null);

    const updated = [...messages, { role: 'user', content: text }];
    setMessages(updated);
    setLoading(true);

    try {
      const reply = await callClaude(updated, IFS_SYSTEM, 800);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const topBarStyle = {
    position: 'sticky',
    top: 0,
    background: '#EFF3F7',
    borderBottom: '1px solid #DDE4EC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    zIndex: 10,
  };

  const backBtnStyle = {
    background: 'none',
    border: '1px solid #DDE4EC',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 14,
    color: '#5C6E80',
  };

  const titleStyle = {
    fontSize: 15,
    fontWeight: 600,
    color: '#1C2B3A',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  const wrapBtnStyle = {
    background: '#4A7E8C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 14,
    fontWeight: 600,
    opacity: assistantCount >= 2 ? 1 : 0,
    pointerEvents: assistantCount >= 2 ? 'auto' : 'none',
    transition: 'opacity 0.3s',
  };

  const chatAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 20px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxWidth: 680,
    margin: '0 auto',
    width: '100%',
  };

  const inputRowStyle = {
    borderTop: '1px solid #DDE4EC',
    background: '#EFF3F7',
    padding: '12px 20px',
  };

  const inputInnerStyle = {
    maxWidth: 680,
    margin: '0 auto',
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
  };

  const textareaStyle = {
    flex: 1,
    resize: 'none',
    border: '1px solid #DDE4EC',
    borderRadius: 10,
    padding: '10px 14px',
    fontSize: 14,
    lineHeight: 1.5,
    background: '#FFFFFF',
    color: '#1C2B3A',
    minHeight: 44,
    maxHeight: 120,
    outline: 'none',
  };

  const sendBtnStyle = {
    background: '#4A7E8C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    padding: '10px 18px',
    fontSize: 14,
    fontWeight: 600,
    height: 44,
    opacity: loading ? 0.6 : 1,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={topBarStyle}>
        <button style={backBtnStyle} onClick={onBack}>← Home</button>
        <span style={titleStyle}>Today's Check-in</span>
        <button style={wrapBtnStyle} onClick={() => onWrapUp(messages)}>
          Wrap up →
        </button>
      </div>

      <div style={chatAreaStyle}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.role === 'user' ? '#4A7E8C' : '#FFFFFF',
                color: msg.role === 'user' ? '#FFFFFF' : '#1C2B3A',
                border: msg.role === 'user' ? 'none' : '1px solid #DDE4EC',
                fontSize: 14,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #DDE4EC', borderRadius: '16px 16px 16px 4px' }}>
              <TypingDots />
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: '#FFF0F0',
            border: '1px solid #E0A0A0',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#8C3030',
          }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={inputRowStyle}>
        <div style={inputInnerStyle}>
          <textarea
            style={textareaStyle}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's coming up for you right now?"
            rows={1}
            disabled={loading}
          />
          <button style={sendBtnStyle} onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
