import { PARTS } from '../partsConfig';

function formatDate(iso) {
  if (!iso) return 'Never visited';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function PartCard({ partKey, lastVisit, onClick, selected, selectable }) {
  const part = PARTS[partKey];
  if (!part) return null;

  const cardStyle = {
    background: '#FFFFFF',
    border: selected ? `2px solid ${part.color}` : '1px solid #DDE4EC',
    borderRadius: 12,
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
  };

  const headerStyle = {
    background: part.background,
    borderBottom: `3px solid ${part.color}`,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const dotStyle = {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: part.color,
    flexShrink: 0,
  };

  const nameStyle = {
    fontWeight: 600,
    fontSize: 15,
    color: part.color,
  };

  const bodyStyle = {
    padding: '10px 16px 14px',
  };

  const roleStyle = {
    fontSize: 12,
    color: '#5C6E80',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  const visitStyle = {
    fontSize: 13,
    color: '#5C6E80',
  };

  const handleMouseEnter = e => {
    if (onClick) e.currentTarget.style.transform = 'translateY(-2px)';
  };

  const handleMouseLeave = e => {
    if (onClick) e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={headerStyle}>
        <div style={dotStyle} />
        <span style={nameStyle}>{part.name}</span>
        {selectable && (
          <span style={{ marginLeft: 'auto', fontSize: 18 }}>
            {selected ? '✓' : ''}
          </span>
        )}
      </div>
      <div style={bodyStyle}>
        <div style={roleStyle}>{part.role}</div>
        <div style={visitStyle}>Last visited: {formatDate(lastVisit)}</div>
      </div>
    </div>
  );
}
