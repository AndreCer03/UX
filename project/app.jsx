// ============ MAIN APP ============

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "electric"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme || 'electric');
  }, [tweaks.theme]);

  // ===== GAME STATE =====
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState('');
  const [userClub, setUserClub] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [lastResult, setLastResult] = useState(null); // { won, homeScore, awayScore, round, opp }

  const tickerItems = useMemo(() => buildTickerItems(userClub, bracket, lastResult), [userClub, bracket, lastResult]);

  const handleLandingStart = ({ user, club }) => {
    setUser(user);
    setUserClub(club);
    const br = window.BracketUtils.buildBracket(club);
    setBracket(br);
    setScreen('bracket');
  };

  const handleContinueFromBracket = () => {
    setScreen('preview');
  };

  const handleKickoff = () => {
    setScreen('match');
  };

  const handleBackToBracket = () => setScreen('bracket');

  const handleMatchFinish = ({ won, homeScore, awayScore }) => {
    const curr = window.BracketUtils.getCurrentUserRound(bracket, userClub.id);
    if (!curr) return;
    const m = curr.match;
    const opp = m.home.id === userClub.id ? m.away : m.home;
    const newBracket = window.BracketUtils.recordAndAdvance(bracket, curr.round, won, homeScore, awayScore, userClub);
    setBracket(newBracket);
    setLastResult({ won, homeScore, awayScore, round: curr.round, opp, isFinal: curr.round === 'f' });
    setScreen('fulltime');
  };

  const handleContinueFromFulltime = () => {
    if (lastResult.isFinal && lastResult.won) {
      setScreen('champion');
    } else if (lastResult.won) {
      setScreen('bracket');
    } else {
      handleRestart();
    }
  };

  const handleRestart = () => {
    setUser(''); setUserClub(null); setBracket(null); setLastResult(null);
    setScreen('landing');
  };

  // Current match preview info
  const currentMatchInfo = useMemo(() => {
    if (!bracket || !userClub) return null;
    const curr = window.BracketUtils.getCurrentUserRound(bracket, userClub.id);
    if (!curr) return null;
    const m = curr.match;
    const opp = m.home.id === userClub.id ? m.away : m.home;
    return { round: curr.round, opp };
  }, [bracket, userClub]);

  return (
    <>
      <div className="backdrop"></div>
      <div className="noise"></div>

      <div className="stage">
        <Chrome
          user={user || null}
          club={userClub}
          stage={screen}
          round={currentMatchInfo ? window.BracketUtils.ROUND_LABEL[currentMatchInfo.round] : null}
        />
        <Ticker items={tickerItems} />

        {screen === 'landing' && (
          <Landing onStart={handleLandingStart} />
        )}

        {screen === 'bracket' && bracket && (
          <BracketScreen
            bracket={bracket}
            user={user}
            userClub={userClub}
            onContinue={handleContinueFromBracket}
          />
        )}

        {screen === 'preview' && currentMatchInfo && (
          <MatchPreview
            user={user}
            userClub={userClub}
            oppClub={currentMatchInfo.opp}
            round={currentMatchInfo.round}
            onKickoff={handleKickoff}
            onBack={handleBackToBracket}
          />
        )}

        {screen === 'match' && currentMatchInfo && (
          <MatchScreen
            user={user}
            userClub={userClub}
            oppClub={currentMatchInfo.opp}
            round={currentMatchInfo.round}
            onFinish={handleMatchFinish}
          />
        )}

        {screen === 'fulltime' && lastResult && (
          <FullTime
            user={user}
            userClub={userClub}
            oppClub={lastResult.opp}
            homeScore={lastResult.homeScore}
            awayScore={lastResult.awayScore}
            round={lastResult.round}
            won={lastResult.won}
            isFinal={lastResult.isFinal}
            onContinue={handleContinueFromFulltime}
            onRestart={handleRestart}
          />
        )}

        {screen === 'champion' && (
          <Champion user={user} userClub={userClub} onRestart={handleRestart} />
        )}
      </div>

      {/* TWEAKS PANEL */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Look & Feel">
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={v => setTweak('theme', v)}
            options={[
              { value: 'electric', label: 'Electric' },
              { value: 'champions', label: 'Champions' },
            ]}
          />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: '#999', marginTop: 4, lineHeight: 1.5, padding: '0 14px 8px' }}>
            <b style={{ color: '#000' }}>Electric:</b> DAZN-Match-Centre, neon-grün auf navy.<br />
            <b style={{ color: '#000' }}>Champions:</b> Premium UEFA-Look, gold + violett.
          </div>
        </TweakSection>

        <TweakSection label="Steuerung">
          <TweakButton label="↺ Neues Turnier" onClick={handleRestart} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// ============ TICKER CONTENT ============
function buildTickerItems(userClub, bracket, lastResult) {
  const base = [
    { tag: 'NEWS', text: 'Champions Cup 25/26 — Achtelfinale gestartet · 16 Klubs, 4 Runden, 1 Pokal' },
    { tag: 'STATS', text: 'Ø 2.4 Tore pro Spiel · Quote für Underdogs: 1:3' },
    { tag: 'INFO', text: 'Tipp: Erste Frage richtig = Auswärtsvorteil weg' },
  ];
  if (userClub) base.push({ tag: 'TEAM', text: `${userClub.short} im Wettbewerb · Manager schickt seine Elf ins Rennen` });
  if (bracket) {
    // Latest sim results
    const r16Done = bracket.r16.filter(m => m.played && !m.isUser);
    r16Done.slice(0, 3).forEach(m => {
      base.push({
        tag: 'RESULT',
        text: `${m.home.short} ${m.homeScore}:${m.awayScore} ${m.away.short} — ${m.winner === 'home' ? m.home.short : m.away.short} weiter`,
      });
    });
  }
  if (lastResult) {
    base.push({
      tag: 'FT',
      text: `${userClub.short} ${lastResult.homeScore}:${lastResult.awayScore} ${lastResult.opp.short} — ${lastResult.won ? 'Sieg' : 'Niederlage'}`,
    });
  }
  return base;
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
