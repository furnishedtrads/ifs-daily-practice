import { PARTS } from '../partsConfig';
import SessionPreview from './SessionPreview';

function formatDate(iso) {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function PartDetailView({ partKey, data, onBack }) {
  const part = PARTS[partKey];
  if (!part) return null;

  const partData = data.parts?.[partKey] || { lastVisit: null, sessionIds: [] };
  const sessions = (data.sessions || [])
    .filter(s => (s.partsActive || []).includes(partKey))
    .reverse();

  const headerStyle = {
    background: part.background,
    borderBottom: `3px solid ${part.color}`,
    padding: '32px 20px 24px',
  };

  const backBtnStyle = {
    background: 'none',
    border: '1px solid #DDE4EC',
    borderRadius: 8,
    padding: '6px 14px',
    fontSize: 14,
    color: '#5C6E80',
    cursor: 'pointer',
    marginBottom: 20,
    display: 'inline-block',
  };

  const nameStyle = {
    fontSize: 28,
    fontWeight: 700,
    color: part.color,
    marginBottom: 4,
  };

  const roleStyle = {
    fontSize: 13,
    color: part.color,
    opacity: 0.75,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  const bodyStyle = {
    maxWidth: 680,
    margin: '0 auto',
    padding: '32px 20px 60px',
  };

  const descStyle = {
    fontSize: 15,
    color: '#1C2B3A',
    lineHeight: 1.7,
    marginBottom: 32,
    background: '#FFFFFF',
    border: '1px solid #DDE4EC',
    borderRadius: 10,
    padding: '18px 20px',
  };

  const statsStyle = {
    display: 'flex',
    gap: 20,
    marginBottom: 32,
  };

  const statBoxStyle = {
    flex: 1,
    background: '#FFFFFF',
    border: '1px solid #DDE4EC',
    borderRadius: 10,
    padding: '14px 18px',
  };

  const statLabelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: '#5C6E80',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 4,
  };

  const statValueStyle = {
    fontSize: 16,
    fontWeight: 600,
    color: '#1C2B3A',
  };

  const sectionLabel = {
    fontSize: 11,
    fontWeight: 700,
    color: '#5C6E80',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 12,
  };

  return (
    <div>
      <div style={headerStyle}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <button style={backBtnStyle} onClick={onBack}>← Home</button>
          <h1 style={nameStyle}>{part.name}</h1>
          <p style={roleStyle}>{part.role}</p>
        </div>
      </div>

      <div style={bodyStyle}>
        <p style={descStyle}>{part.description}</p>

        <div style={statsStyle}>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Last check-in</div>
            <div style={statValueStyle}>{formatDate(partData.lastVisit)}</div>
          </div>
          <div style={statBoxStyle}>
            <div style={statLabelStyle}>Sessions</div>
            <div style={statValueStyle}>{sessions.length}</div>
          </div>
        </div>

        {sessions.length > 0 ? (
          <div>
            <div style={sectionLabel}>Sessions with {part.name}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.map(s => (
                <SessionPreview key={s.id} session={s} />
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 14, color: '#5C6E80', fontStyle: 'italic' }}>
            No sessions recorded yet with this part.
          </p>
        )}
      </div>
    </div>
  );
}
