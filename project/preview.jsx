// MATCH PREVIEW SCREEN
function MatchPreview({ user, userClub, oppClub, round, onKickoff, onBack }) {
  const { ROUND_LABEL } = window.BracketUtils;
  const difficultyLabel = {
    easy: 'LEICHT',
    medium: 'MITTEL',
    hard: 'SCHWER',
    expert: 'EXTREM',
  };
  const diff = window.BracketUtils.ROUND_DIFFICULTY[round];

  return (
    <div className="main fade-in" style={{ paddingTop: 24 }}>
      <div className="container" style={{ width: '100%' }}>
        <Steps current="preview" />

        <div className="preview-stage slide-up" style={{ minHeight: 'calc(100vh - 320px)' }}>
          {/* HOME — user team */}
          <div className="preview-team home">
            <div className="crest-row">
              <Crest club={userClub} size="xxl" />
            </div>
            <div className="team-name" style={{ color: userClub.primary === '#000000' ? 'var(--text)' : userClub.primary }}>
              {userClub.short}
            </div>
            <div className="team-league">{userClub.league} · {userClub.country}</div>
            <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              ← Heim · {user}
            </div>
          </div>

          {/* CENTER — VS */}
          <div className="preview-vs">
            <div className="preview-meta" style={{ marginBottom: 12 }}>{ROUND_LABEL[round]}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
              <span>VS</span>
            </div>
            <div className="line"></div>
            <div className="preview-meta">
              90:00 · 5 Tore zum Sieg<br />
              Schwierigkeit: <span style={{ color: 'var(--accent)' }}>{difficultyLabel[diff]}</span>
            </div>
          </div>

          {/* AWAY — opponent */}
          <div className="preview-team away">
            <div className="crest-row">
              <Crest club={oppClub} size="xxl" />
            </div>
            <div className="team-name" style={{ color: oppClub.primary === '#000000' ? 'var(--text)' : oppClub.primary }}>
              {oppClub.short}
            </div>
            <div className="team-league">{oppClub.league} · {oppClub.country}</div>
            <div style={{ marginTop: 24, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Auswärts →
            </div>
          </div>
        </div>

        {/* Lower controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, gap: 16 }}>
          <button className="btn ghost" onClick={onBack}>← Zurück zum Turnierbaum</button>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Kommentar: Bereiten Sie sich auf den Anpfiff vor.
          </div>
          <button className="btn" onClick={onKickoff} style={{ background: 'var(--accent-3)', color: '#fff', boxShadow: '0 0 0 1px var(--accent-3), 0 10px 30px -10px var(--accent-3)' }}>
            ▶ Anpfiff
          </button>
        </div>
      </div>
    </div>
  );
}

window.MatchPreview = MatchPreview;
