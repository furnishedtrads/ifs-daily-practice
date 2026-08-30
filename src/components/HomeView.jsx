import PartCard from './PartCard';
import ExploreList from './ExploreList';
import SessionPreview from './SessionPreview';
import { PARTS, EXPLORE } from '../partsConfig';

const API_KEY = import.meta.env.VITE_ANTHROPIC_KEY;

function todayString() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function HomeView({ data, onStartSession, onViewPart }) {
  const partKeys = Object.keys(PARTS);
  const sessions = data.sessions || [];
  const recentSessions = [...sessions].reverse().slice(0, 3);
  const exploreTouchedCount = EXPLORE.filter(e => data.explore?.[e.id]?.touched).length;

  const missingKey = !API_KEY || API_KEY === 'placeholder';

  const containerStyle = {
    maxWidth: 680,
    margin: '0 auto',
    padding: '32px 20px 60px',
  };

  const bannerStyle = {
    background: '#FFF3CD',
    border: '1px solid #E6C84A',
    borderRadius: 10,
    padding: '14px 18px',
    marginBottom: 24,
    fontSize: 14,
    color: '#7A5C00',
    lineHeight: 1.6,
  };

  const headerStyle = {
    marginBottom: 32,
  };

  const titleStyle = {
    fontSize: 26,
    fontWeight: 700,
    color: '#1C2B3A',
    marginBottom: 4,
  };

  const subtitleStyle = {
    fontSize: 14,
    color: '#5C6E80',
  };

  const sectionLabelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: '#5C6E80',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 14,
  };

  const startButtonStyle = {
    display: 'block',
    width: '100%',
    padding: '16px',
    background: '#4A7E8C',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 40,
    letterSpacing: '0.01em',
    transition: 'background 0.15s',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 12,
    marginBottom: 40,
  };

  const sectionStyle = {
    marginBottom: 40,
  };

  return (
    <div style={containerStyle}>
      {missingKey && (
        <div style={bannerStyle}>
          <strong>API key not configured.</strong> Add your Anthropic API key to the{' '}
          <code>.env</code> file as <code>VITE_ANTHROPIC_KEY</code> and restart the dev server.
          Sessions with Claude will not work until this is set.
        </div>
      )}

      <div style={headerStyle}>
        <h1 style={titleStyle}>IFS Daily Practice</h1>
        <p style={subtitleStyle}>
          {todayString()} &nbsp;·&nbsp; {sessions.length} session{sessions.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {exploreTouchedCount}/{EXPLORE.length} themes explored
        </p>
      </div>

      <button
        style={startButtonStyle}
        onClick={onStartSession}
        onMouseEnter={e => (e.currentTarget.style.background = '#3A6E7C')}
        onMouseLeave={e => (e.currentTarget.style.background = '#4A7E8C')}
      >
        Start Today's Check-in
      </button>

      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Your Parts</div>
        <div style={gridStyle}>
          {partKeys.map(key => (
            <PartCard
              key={key}
              partKey={key}
              lastVisit={data.parts?.[key]?.lastVisit}
              onClick={() => onViewPart(key)}
            />
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionLabelStyle}>Still to Explore</div>
        <ExploreList exploreData={data.explore} />
      </div>

      {recentSessions.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionLabelStyle}>Recent Sessions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentSessions.map(s => (
              <SessionPreview key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
