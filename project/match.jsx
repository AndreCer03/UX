// GOAL ANIMATION — confetti + ball into goal + giant text
function GoalOverlay({ kind, key: k }) {
  // kind: 'goal' (user scored) or 'concede' (opp scored)
  const isGoal = kind === 'goal';
  const colors = isGoal
    ? ['#00ff88', '#00d4ff', '#ffffff', '#a8ffd2']
    : ['#ff2d55', '#ff8800', '#ffffff'];
  const confettiPieces = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    left: Math.random() * 100,
    dx: (Math.random() - 0.5) * 200,
    delay: Math.random() * 0.4,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
  })), [k]);

  const text = isGoal
    ? ['TOR!', 'GOAL!', 'GOAL!'][Math.floor(Math.random() * 3)]
    : 'GEGENTOR';

  return (
    <div className={`goal-overlay ${isGoal ? 'goal' : 'concede'}`}>
      <div className="flash"></div>

      {/* Goal frame (only on goal) */}
      {isGoal && (
        <div className="goal-frame">
          <svg viewBox="0 0 320 200" preserveAspectRatio="none">
            <defs>
              <pattern id="netPattern" width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M0,0 L14,14 M14,0 L0,14" stroke="rgba(255,255,255,0.45)" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            {/* Net background */}
            <g className="net-shake">
              <rect x="20" y="20" width="280" height="160" fill="url(#netPattern)" />
            </g>
            {/* Frame */}
            <rect x="20" y="20" width="280" height="160" fill="none" stroke="#fff" strokeWidth="6" />
            {/* Posts shadow */}
            <line x1="20" y1="20" x2="20" y2="180" stroke="rgba(0,0,0,0.4)" strokeWidth="2" transform="translate(2,2)" />
          </svg>
          <div className="ball"></div>
        </div>
      )}

      {/* Confetti */}
      {confettiPieces.map((p, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${p.left}%`,
            '--dx': `${p.dx}px`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        ></div>
      ))}

      {/* Giant TOR text */}
      <div className="goal-text">{text}</div>
    </div>
  );
}

// ============ MATCH SCREEN ============
function MatchScreen({ user, userClub, oppClub, round, onFinish }) {
  const MATCH_DURATION_SEC = 60;            // real seconds
  const GAME_LENGTH_MIN = 90;               // displayed
  const GOALS_TO_WIN = 5;
  const QUESTION_REVEAL_MS = 1100;          // pause to show correct/wrong + anim
  const HALFTIME_GAME_MIN = 45;

  const [homeScore, setHomeScore] = useState(0); // user
  const [awayScore, setAwayScore] = useState(0); // opponent
  const [elapsedMs, setElapsedMs] = useState(0); // real ms
  const [paused, setPaused] = useState(false);

  const difficulty = window.BracketUtils.ROUND_DIFFICULTY[round];
  const allQuestions = useMemo(() => {
    return window.BracketUtils.shuffle(window.QUESTIONS[difficulty]);
  }, [difficulty]);

  const [qIdx, setQIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // index or null
  const [showAnim, setShowAnim] = useState(null); // 'goal' | 'concede' | null
  const [animKey, setAnimKey] = useState(0);
  const [commentary, setCommentary] = useState({ kind: 'normal', label: 'KICKOFF', text: 'Der Anpfiff ertönt — auf gehts!' });

  const [showHalftime, setShowHalftime] = useState(false);
  const halftimeShown = useRef(false);

  const startRef = useRef(Date.now());
  const finishedRef = useRef(false);

  // Timer tick
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const el = Date.now() - startRef.current;
      setElapsedMs(el);
      // Game time in minutes (0..90)
      const gameMin = (el / 1000) / MATCH_DURATION_SEC * GAME_LENGTH_MIN;

      // Halftime trigger
      if (!halftimeShown.current && gameMin >= HALFTIME_GAME_MIN) {
        halftimeShown.current = true;
        setPaused(true);
        setShowHalftime(true);
        setCommentary({ kind: 'normal', label: 'HALBZEIT', text: 'Der Schiedsrichter pfeift zur Pause.' });
        setTimeout(() => {
          setShowHalftime(false);
          startRef.current = Date.now() - HALFTIME_GAME_MIN/GAME_LENGTH_MIN * MATCH_DURATION_SEC * 1000;
          setPaused(false);
        }, 1800);
      }

      // End of regulation
      if (el >= MATCH_DURATION_SEC * 1000 && !finishedRef.current) {
        finishedRef.current = true;
        endMatch();
      }
    }, 80);
    return () => clearInterval(id);
  }, [paused]);

  // Score-based finishes
  useEffect(() => {
    if (finishedRef.current) return;
    if (homeScore >= GOALS_TO_WIN || awayScore >= GOALS_TO_WIN) {
      finishedRef.current = true;
      setPaused(true);
      // Slight delay so animation can play
      setTimeout(endMatch, 1400);
    }
  }, [homeScore, awayScore]);

  function endMatch() {
    const won = homeScoreRef.current > awayScoreRef.current;
    onFinish({ won, homeScore: homeScoreRef.current, awayScore: awayScoreRef.current });
  }
  // refs to read fresh score in setTimeout
  const homeScoreRef = useRef(0); homeScoreRef.current = homeScore;
  const awayScoreRef = useRef(0); awayScoreRef.current = awayScore;

  const currentQ = allQuestions[qIdx % allQuestions.length];

  function handleAnswer(answerIdx) {
    if (selectedAnswer !== null || paused) return;
    setSelectedAnswer(answerIdx);
    const correct = answerIdx === currentQ.correct;
    // Pause timer briefly during animation
    setPaused(true);
    setAnimKey(k => k + 1);
    setShowAnim(correct ? 'goal' : 'concede');

    if (correct) {
      setHomeScore(s => s + 1);
      setCommentary({
        kind: 'goal',
        label: 'TOR',
        text: pickFrom(GOAL_COMMENTS).replace('{team}', userClub.short),
      });
    } else {
      setAwayScore(s => s + 1);
      setCommentary({
        kind: 'concede',
        label: 'GEGENTOR',
        text: pickFrom(CONCEDE_COMMENTS).replace('{team}', oppClub.short),
      });
    }

    setTimeout(() => {
      setShowAnim(null);
      setSelectedAnswer(null);
      setQIdx(i => i + 1);
      // resume timer if not finished
      if (!finishedRef.current) setPaused(false);
    }, QUESTION_REVEAL_MS);
  }

  // Compute display minute
  const gameMin = paused && showHalftime ? 45
    : (elapsedMs / 1000) / MATCH_DURATION_SEC * GAME_LENGTH_MIN;
  const displayMin = Math.min(GAME_LENGTH_MIN, Math.floor(gameMin));
  const displaySec = Math.floor((gameMin - displayMin) * 60);
  const timerText = `${String(displayMin).padStart(2,'0')}:${String(displaySec).padStart(2,'0')}`;
  const timerPct = Math.min(100, (elapsedMs / (MATCH_DURATION_SEC*1000)) * 100);
  const timerLow = timerPct > 80;

  return (
    <div className="main fade-in" style={{ paddingTop: 24 }}>
      <div className="container match-stage" style={{ width: '100%' }}>
        <Steps current="match" />

        {/* SCOREBOARD */}
        <div className="scoreboard slide-up">
          <div className="scoreboard-side home" style={{
            '--home-color': `color-mix(in oklch, ${userClub.primary} 70%, transparent)`,
          }}>
            <CrestMini club={userClub} style={{ width: 44, height: 44, fontSize: 11 }} />
            <div>
              <div className="abbr">{userClub.abbr}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{userClub.short}</div>
            </div>
          </div>
          <div className="scoreboard-center">
            <div className="scoreboard-time">{timerText}</div>
            <div className="scoreboard-score">
              <span>{homeScore}</span><span className="sep">:</span><span>{awayScore}</span>
            </div>
            <div className="scoreboard-stage">{window.BracketUtils.ROUND_LABEL[round]} · LIVE</div>
          </div>
          <div className="scoreboard-side away" style={{
            '--away-color': `color-mix(in oklch, ${oppClub.primary} 70%, transparent)`,
          }}>
            <div style={{ textAlign: 'right' }}>
              <div className="abbr">{oppClub.abbr}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{oppClub.short}</div>
            </div>
            <CrestMini club={oppClub} style={{ width: 44, height: 44, fontSize: 11 }} />
          </div>
        </div>

        {/* TIMER BAR */}
        <div className={`timer-bar ${timerLow ? 'low' : ''}`}>
          <div className="fill" style={{ width: `${timerPct}%` }}></div>
        </div>

        <div className="match-body">
          {/* COMMENTARY */}
          <div className={`commentary ${commentary.kind}`}>
            <span className="label">{commentary.label} ›</span>
            <span style={{ color: 'var(--text)' }}>{commentary.text}</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: 11 }}>
              {String(displayMin).padStart(2,'0')}'
            </span>
          </div>

          {/* QUESTION CARD */}
          <div className="question-card" key={qIdx}>
            <div className="question-num">Frage {qIdx + 1} · {window.BracketUtils.ROUND_LABEL[round]}</div>
            {currentQ.crestClubId && (() => {
              const cClub = window.CLUBS.find(c => c.id === currentQ.crestClubId);
              return cClub ? (
                <div className="crest-quiz-stage">
                  <Crest club={cClub} size="xl" silhouette={true} />
                </div>
              ) : null;
            })()}
            <div className="question-text">{currentQ.q}</div>
            <div className="answer-grid">
              {currentQ.a.map((opt, i) => {
                const letter = ['A','B','C','D'][i];
                const isSelected = selectedAnswer === i;
                const isCorrect = selectedAnswer !== null && i === currentQ.correct;
                const isWrong = isSelected && i !== currentQ.correct;
                const isDim = selectedAnswer !== null && !isSelected && !isCorrect;
                const cls = [
                  'answer-btn',
                  isCorrect ? 'correct' : '',
                  isWrong ? 'wrong' : '',
                  isDim ? 'dim' : '',
                ].filter(Boolean).join(' ');
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={selectedAnswer !== null || paused}
                  >
                    <span className="letter">{letter}</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* GOAL ANIM */}
        {showAnim && <GoalOverlay kind={showAnim} key={animKey} />}

        {/* HALFTIME BANNER */}
        {showHalftime && (
          <div className="halftime-banner">
            <div className="halftime-card">
              <div className="label">Halbzeitpfiff</div>
              <div className="title">45:00</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em', color: 'var(--text-dim)', marginTop: 12 }}>
                {userClub.abbr} <span style={{ color: 'var(--accent)' }}>{homeScore} : {awayScore}</span> {oppClub.abbr}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const GOAL_COMMENTS = [
  'Was für ein Treffer von {team}!',
  'Das Stadion explodiert — {team} trifft!',
  'Volltreffer! Die Wissens-Bombe sitzt!',
  'Eiskalt versenkt von {team}!',
  'Ein Geistesblitz und das Tor!',
  'Trifft ins Schwarze — fantastisch!',
];
const CONCEDE_COMMENTS = [
  'Bitter — {team} schlägt zurück.',
  'Da war zu wenig Konzentration!',
  'Der Gegner nutzt die Lücke gnadenlos.',
  'Ein Schock für die Heimfans!',
  'Falsche Antwort, falsche Entscheidung — Gegentor!',
  '{team} jubelt — das tut weh.',
];
function pickFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

window.MatchScreen = MatchScreen;
