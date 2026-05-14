// Crest — stylized SVG-ish badge using club colors + initials
// Returns a circular badge with abbr + stripe pattern in club colors
// silhouette=true → hides the abbr text (for "guess the club" questions)
function Crest({ club, size = 'md', className = '', silhouette = false }) {
  if (!club) return null;
  const style = {
    background: `linear-gradient(135deg, ${club.primary} 0%, ${club.primary} 50%, color-mix(in oklch, ${club.primary} 70%, black) 100%)`,
    color: club.text || '#fff',
  };
  const stripeStyle = {
    color: club.secondary,
  };
  return (
    <div className={`crest ${size} ${className}`} style={style}>
      <div className="crest-stripe" style={stripeStyle}></div>
      {!silhouette && <span style={{ position: 'relative', zIndex: 1 }}>{club.abbr}</span>}
      {silhouette && <span style={{ position: 'relative', zIndex: 1, opacity: 0.35, fontSize: '0.6em' }}>?</span>}
    </div>
  );
}

// Mini crest for inline lists
function CrestMini({ club, style = {} }) {
  if (!club) return null;
  return (
    <div
      className="crest-mini"
      style={{
        background: `linear-gradient(135deg, ${club.primary}, color-mix(in oklch, ${club.primary} 70%, black))`,
        color: club.text || '#fff',
        ...style,
      }}
    >
      {club.abbr.slice(0, 3)}
    </div>
  );
}

window.Crest = Crest;
window.CrestMini = CrestMini;
