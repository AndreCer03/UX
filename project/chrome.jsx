// Top broadcast chrome bar + ticker
function Chrome({ user, club, stage, round }) {
  const stageLabels = {
    landing: 'PRE-MATCH',
    bracket: 'TURNIERBAUM',
    preview: 'MATCHVORSCHAU',
    match: 'LIVE',
    fulltime: 'FULL-TIME',
    champion: 'CHAMPION',
  };
  return (
    <div className="chrome">
      <div className="chrome-left">
        <div className="chrome-logo">
          <span className="dot"></span>
          <span>FUSSBALL QUIZ</span>
        </div>
        <span className="chrome-tag">SAISON 25/26</span>
        {stage === 'match' && <span className="chrome-tag live">● LIVE</span>}
      </div>
      <div className="chrome-right">
        {user && <span>Manager: <b style={{ color: 'var(--text)' }}>{user}</b></span>}
        {club && <span>· {club.short}</span>}
        {round && <span>· {round}</span>}
        <span className="chrome-tag">{stageLabels[stage] || ''}</span>
      </div>
    </div>
  );
}

function Ticker({ items }) {
  // Duplicate for infinite scroll
  const looped = [...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-label">BREAKING</div>
      <div className="ticker-track">
        <div className="ticker-inner">
          {looped.map((it, i) => (
            <span key={i}><b>{it.tag}</b>{it.text}<span className="sep"> ◆ </span></span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Steps({ current }) {
  const steps = [
    { id: 'landing', label: 'Setup' },
    { id: 'bracket', label: 'Turnierbaum' },
    { id: 'preview', label: 'Vorschau' },
    { id: 'match', label: 'Spiel' },
    { id: 'fulltime', label: 'Abpfiff' },
  ];
  const currIdx = steps.findIndex(s => s.id === current);
  return (
    <div className="steps">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <span className={`step ${i === currIdx ? 'active' : (i < currIdx ? 'done' : '')}`}>
            <span className="dot"></span>{String(i+1).padStart(2,'0')} {s.label}
          </span>
          {i < steps.length - 1 && <span className="sep">/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

window.Chrome = Chrome;
window.Ticker = Ticker;
window.Steps = Steps;
