import { EXPLORE } from '../partsConfig';

export default function ExploreList({ exploreData, selected, onToggle }) {
  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {EXPLORE.map(item => {
        const touched = selected
          ? selected.includes(item.id)
          : exploreData?.[item.id]?.touched;

        const itemStyle = {
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          padding: '10px 14px',
          background: touched ? '#E8F4EE' : '#FFFFFF',
          border: touched ? '1px solid #357A5E' : '1px solid #DDE4EC',
          borderRadius: 8,
          cursor: onToggle ? 'pointer' : 'default',
          transition: 'background 0.15s',
        };

        const checkStyle = {
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: touched ? '2px solid #357A5E' : '2px solid #DDE4EC',
          background: touched ? '#357A5E' : 'transparent',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        };

        return (
          <li key={item.id} style={itemStyle} onClick={() => onToggle?.(item.id)}>
            <div style={checkStyle}>
              {touched && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 14, color: '#1C2B3A', lineHeight: 1.45 }}>
              {item.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
