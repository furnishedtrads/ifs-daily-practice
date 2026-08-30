import { PARTS } from '../partsConfig';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function SessionPreview({ session, onClick }) {
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #DDE4EC',
    borderRadius: 10,
    padding: '14px 16px',
    cursor: onClick ? 'pointer' : 'default',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  };

  const summaryStyle = {
    fontSize: 14,
    color: '#1C2B3A',
    lineHeight: 1.5,
    marginBottom: 10,
  };

  const tagsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      <div style={headerStyle}>
        <span style={{ fontSize: 13, color: '#5C6E80' }}>{formatDate(session.date)}</span>
      </div>
      <p style={summaryStyle}>{session.summary || 'No summary available.'}</p>
      <div style={tagsStyle}>
        {(session.partsActive || []).map(key => {
          const part = PARTS[key];
          if (!part) return null;
          return (
            <span
              key={key}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: part.color,
                background: part.background,
                border: `1px solid ${part.color}30`,
                borderRadius: 20,
                padding: '2px 9px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {part.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}
