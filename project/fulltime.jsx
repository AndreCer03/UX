// FULLTIME / ABPFIFF SCREEN
function FullTime({ user, userClub, oppClub, homeScore, awayScore, round, won, isFinal, onContinue, onRestart }) {
  const { ROUND_LABEL } = window.BracketUtils;
  const nextRoundLabels = { r16: 'Viertelfinale', qf: 'Halbfinale', sf: 'Final' };

  return (
    <div className={`main fade-in fulltime ${won ? 'win' : 'loss'}`}>
      <div className="container center-stage" style={{ minHeight: 'calc(100vh - 200px)' }}>

        <div className="eyebrow">Schlusspfiff · {ROUND_LABEL[round]}</div>

        <div className="stamp slide-up">
          {won ? (isFinal ? 'Champion!' : 'Sieg!') : (isFinal ? 'Knapp daneben' : 'Niederlage')}
        </div>
        <div className="ft-result">
          {won
            ? (isFinal ? `${userClub.short} holt den Pokal` : `${userClub.short} steht im ${nextRoundLabels[round]}`)
            : `${oppClub.short} ist eine Runde weiter`}
        </div>

        {/* Scoreline */}
        <div className="ft-scoreline scale-in" style={{ animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Crest club={userClub} size="lg" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em' }}>{userClub.abbr}</div>
          </div>
          <div className="vs-score" style={{ color: won ? 'var(--accent)' : 'var(--text)' }}>
            <span>{homeScore}</span><span className="sep">:</span><span style={{ color: won ? 'var(--text-muted)' : 'var(--accent-3)' }}>{awayScore}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Crest club={oppClub} size="lg" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.04em' }}>{oppClub.abbr}</div>
          </div>
        </div>

        {/* Stat strip */}
        <div style={{ display: 'flex', gap: 50, marginBottom: 50, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text)', letterSpacing: 0 }}>{homeScore + awayScore}</div>
            Tore total
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: won ? 'var(--accent)' : 'var(--accent-3)', letterSpacing: 0 }}>
              {won ? '+' : ''}{homeScore - awayScore}
            </div>
            Differenz
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text)', letterSpacing: 0 }}>90:00</div>
            Spielzeit
          </div>
        </div>

        <div className="ft-cta">
          {won && !isFinal && (
            <button className="btn" onClick={onContinue}>
              Weiter zum {nextRoundLabels[round]} <span className="arrow">→</span>
            </button>
          )}
          {won && isFinal && (
            <button className="btn" onClick={onContinue}>
              Pokal-Übergabe <span className="arrow">→</span>
            </button>
          )}
          {!won && (
            <button className="btn danger" onClick={onRestart}>
              ↺ Neues Turnier starten
            </button>
          )}
          <button className="btn ghost" onClick={onRestart}>
            Neues Turnier
          </button>
        </div>
      </div>
    </div>
  );
}

// CHAMPION SCREEN — won the final
function Champion({ user, userClub, onRestart }) {
  return (
    <div className="main fade-in champion-screen">
      <div className="container center-stage" style={{ minHeight: 'calc(100vh - 200px)' }}>

        {/* Confetti loop */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                '--dx': `${(Math.random() - 0.5) * 400}px`,
                background: ['#00ff88', '#00d4ff', '#f3c95b', '#fff', userClub.primary][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                animationIterationCount: 'infinite',
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>

        <div className="eyebrow scale-in">Champions Cup · Saison 25/26</div>

        <div className="display champion slide-up" style={{ marginTop: 14, marginBottom: 10 }}>
          CHAMPION
        </div>

        <Crest club={userClub} size="xxl" className="scale-in" />

        <h2 className="section-title scale-in" style={{ marginTop: 28 }}>
          {userClub.short}
        </h2>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', marginTop: 12 }}>
          Manager: <span style={{ color: 'var(--accent)' }}>{user}</span> · 4 Siege in Folge
        </div>

        <div style={{ marginTop: 50 }}>
          <button className="btn" onClick={onRestart}>
            ↺ Titel verteidigen
          </button>
        </div>
      </div>
    </div>
  );
}

window.FullTime = FullTime;
window.Champion = Champion;
