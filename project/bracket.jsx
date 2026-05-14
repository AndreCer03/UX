// BRACKET SCREEN
function MatchLine({ team, score, isWinner, isLoser, isTBD }) {
  if (isTBD || !team) {
    return (
      <div className="match-line">
        <div className="crest-mini" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>?</div>
        <div className="match-tbd">TBD</div>
      </div>
    );
  }
  return (
    <div className={`match-line ${isWinner ? 'winner' : ''} ${isLoser ? 'loser' : ''}`}>
      <CrestMini club={team} />
      <div className="name">{team.short}</div>
      {score !== null && score !== undefined && <div className="score">{score}</div>}
    </div>
  );
}

function MatchBox({ match, isNext, isUser, idx }) {
  const cls = [
    'match-box',
    match.played ? 'done' : '',
    isNext ? 'next' : '',
    isUser ? 'user-team' : '',
  ].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ '--i': idx }}>
      <MatchLine
        team={match.home}
        score={match.homeScore}
        isWinner={match.played && match.winner === 'home'}
        isLoser={match.played && match.winner === 'away'}
        isTBD={!match.home}
      />
      <MatchLine
        team={match.away}
        score={match.awayScore}
        isWinner={match.played && match.winner === 'away'}
        isLoser={match.played && match.winner === 'home'}
        isTBD={!match.away}
      />
    </div>
  );
}

function Bracket({ bracket, userClubId, currentRound, currentMatchIdx }) {
  const { ROUND_LABEL_SHORT } = window.BracketUtils;
  const isUserMatch = (round, idx) => {
    const m = bracket[round][idx];
    return m.home?.id === userClubId || m.away?.id === userClubId;
  };
  const isNext = (round, idx) => round === currentRound && idx === currentMatchIdx;

  return (
    <div className="bracket-wrap">
      <div className="bracket bracket-drawing">
        {/* Col 1 — R16 Left */}
        <div className="bracket-col">
          <div className="bracket-col-label">{ROUND_LABEL_SHORT.r16}</div>
          {[0,1,2,3].map(i => (
            <MatchBox key={`r16-${i}`} match={bracket.r16[i]} isNext={isNext('r16', i)} isUser={isUserMatch('r16', i)} idx={i} />
          ))}
        </div>
        {/* Col 2 — QF Left */}
        <div className="bracket-col">
          <div className="bracket-col-label">{ROUND_LABEL_SHORT.qf}</div>
          {[0,1].map(i => (
            <MatchBox key={`qf-${i}`} match={bracket.qf[i]} isNext={isNext('qf', i)} isUser={isUserMatch('qf', i)} idx={i+4} />
          ))}
        </div>
        {/* Col 3 — SF Left */}
        <div className="bracket-col">
          <div className="bracket-col-label">{ROUND_LABEL_SHORT.sf}</div>
          <MatchBox match={bracket.sf[0]} isNext={isNext('sf', 0)} isUser={isUserMatch('sf', 0)} idx={6} />
        </div>
        {/* Col 4 — Final */}
        <div className="bracket-col">
          <div className="bracket-col-label">{ROUND_LABEL_SHORT.f}</div>
          <div className="trophy-cell">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)', letterSpacing: '0.18em', textAlign: 'center' }}>★ POKAL ★</div>
            <MatchBox match={bracket.f[0]} isNext={isNext('f', 0)} isUser={isUserMatch('f', 0)} idx={7} />
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--text-muted)' }}>SAISON 25/26</div>
          </div>
        </div>
        {/* Col 5 — SF Right */}
        <div className="bracket-col">
          <div className="bracket-col-label">{ROUND_LABEL_SHORT.sf}</div>
          <MatchBox match={bracket.sf[1]} isNext={isNext('sf', 1)} isUser={isUserMatch('sf', 1)} idx={8} />
        </div>
        {/* Col 6 — QF Right */}
        <div className="bracket-col">
          <div className="bracket-col-label">{ROUND_LABEL_SHORT.qf}</div>
          {[2,3].map(i => (
            <MatchBox key={`qf-${i}`} match={bracket.qf[i]} isNext={isNext('qf', i)} isUser={isUserMatch('qf', i)} idx={i+10} />
          ))}
        </div>
        {/* Col 7 — R16 Right */}
        <div className="bracket-col">
          <div className="bracket-col-label">{ROUND_LABEL_SHORT.r16}</div>
          {[4,5,6,7].map(i => (
            <MatchBox key={`r16-${i}`} match={bracket.r16[i]} isNext={isNext('r16', i)} isUser={isUserMatch('r16', i)} idx={i+12} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BracketScreen({ bracket, user, userClub, onContinue }) {
  const { getCurrentUserRound, ROUND_LABEL } = window.BracketUtils;
  const curr = getCurrentUserRound(bracket, userClub.id);

  return (
    <div className="main fade-in" style={{ paddingTop: 24 }}>
      <div className="container" style={{ width: '100%' }}>
        <Steps current="bracket" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8, marginBottom: 24 }}>
          <div>
            <div className="eyebrow">Turnierbaum · 16 Vereine</div>
            <h2 className="section-title" style={{ marginTop: 10 }}>
              {curr ? ROUND_LABEL[curr.round] : 'Turnier beendet'}
            </h2>
            <p className="body-lg" style={{ marginTop: 8 }}>
              {curr
                ? <>Dein nächstes Spiel ist hervorgehoben. Manager <b style={{ color: 'var(--text)' }}>{user}</b> mit <b style={{ color: 'var(--accent)' }}>{userClub.short}</b>.</>
                : 'Glückwunsch — du hast dich bis zum Ende durchgespielt.'}
            </p>
          </div>
          {curr && (
            <button className="btn" onClick={onContinue}>
              Match starten <span className="arrow">→</span>
            </button>
          )}
        </div>

        <Bracket
          bracket={bracket}
          userClubId={userClub.id}
          currentRound={curr?.round}
          currentMatchIdx={curr?.idx}
        />
      </div>
    </div>
  );
}

window.BracketScreen = BracketScreen;
window.Bracket = Bracket;
