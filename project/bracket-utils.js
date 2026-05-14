// Bracket logic helpers
window.BracketUtils = (() => {
  const ROUND_ORDER = ['r16', 'qf', 'sf', 'f'];
  const ROUND_LABEL = { r16: 'Achtelfinale', qf: 'Viertelfinale', sf: 'Halbfinale', f: 'Final' };
  const ROUND_LABEL_SHORT = { r16: 'Achtel', qf: 'Viertel', sf: 'Halb', f: 'Final' };
  const ROUND_DIFFICULTY = { r16: 'easy', qf: 'medium', sf: 'hard', f: 'expert' };
  const ROUND_SIZE = { r16: 8, qf: 4, sf: 2, f: 1 };

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Build bracket: user in slot 0 (R16 match 0, home). Fill 15 others.
  function buildBracket(userClub) {
    const others = window.CLUBS.filter(c => c.id !== userClub.id);
    const picked = shuffle(others).slice(0, 15);
    const slots = [userClub, ...picked]; // 16 teams in slots 0..15

    const r16 = [];
    for (let i = 0; i < 8; i++) {
      r16.push({
        home: slots[i*2],
        away: slots[i*2 + 1],
        homeScore: null, awayScore: null,
        winner: null,  // 'home' | 'away'
        played: false,
        isUser: i === 0,
      });
    }
    return {
      r16,
      qf: Array(4).fill(null).map(() => emptyMatch()),
      sf: Array(2).fill(null).map(() => emptyMatch()),
      f:  [emptyMatch()],
    };
  }

  function emptyMatch() {
    return { home: null, away: null, homeScore: null, awayScore: null, winner: null, played: false, isUser: false };
  }

  // Simulate non-user matches of a round. score: 0-5, weighted to plausible results
  function simulateMatch(home, away) {
    const target = 5; // winner needs 5 goals
    const winner = Math.random() < 0.5 ? 'home' : 'away';
    const winnerScore = target;
    const loserScore = Math.floor(Math.random() * target); // 0-4
    return {
      home, away,
      homeScore: winner === 'home' ? winnerScore : loserScore,
      awayScore: winner === 'away' ? winnerScore : loserScore,
      winner,
      played: true,
      isUser: false,
    };
  }

  // After user's match in `currentRound` is set (with played=true, winner+scores),
  // sim all OTHER matches in that round, then build next round's matchups.
  function advanceBracket(bracket, currentRound) {
    const newBr = JSON.parse(JSON.stringify(bracket));
    const matches = newBr[currentRound];
    // Sim non-user matches
    for (let i = 0; i < matches.length; i++) {
      if (!matches[i].played) {
        const simmed = simulateMatch(matches[i].home, matches[i].away);
        matches[i] = { ...matches[i], ...simmed };
      }
    }
    // Build next round
    const nextRound = ROUND_ORDER[ROUND_ORDER.indexOf(currentRound) + 1];
    if (!nextRound) return newBr; // final played, done

    const winners = matches.map(m => m.winner === 'home' ? m.home : m.away);
    // Pair winners by adjacent: (0,1), (2,3), ...
    const nextMatches = newBr[nextRound];
    for (let i = 0; i < winners.length / 2; i++) {
      nextMatches[i] = {
        ...nextMatches[i],
        home: winners[i*2],
        away: winners[i*2 + 1],
        // User is always in match 0 of next round if they won
        isUser: i === 0 && (winners[0]?.id === currentUserClubId(newBr)),
      };
    }
    // Mark user match — easier: it's always index 0 if user is one of the teams
    return newBr;
  }

  function currentUserClubId(bracket) {
    // Find user club from r16 match 0
    return bracket.r16[0].isUser ? (bracket.r16[0].winner === 'home' ? bracket.r16[0].home.id : null) : null;
  }

  // Get the current "live" round — the first round where user has a match but hasn't played yet
  function getCurrentUserRound(bracket, userClubId) {
    for (const r of ROUND_ORDER) {
      const matches = bracket[r];
      for (let i = 0; i < matches.length; i++) {
        const m = matches[i];
        if (m.home?.id === userClubId || m.away?.id === userClubId) {
          if (!m.played) return { round: r, idx: i, match: m };
        }
      }
    }
    return null; // user is out or won everything
  }

  // After user's match: record result, sim others, build next round
  function recordAndAdvance(bracket, round, userWon, userScore, oppScore, userClub) {
    const newBr = JSON.parse(JSON.stringify(bracket));
    const matches = newBr[round];
    const userIdx = matches.findIndex(m => m.home?.id === userClub.id || m.away?.id === userClub.id);
    if (userIdx === -1) return newBr;
    const m = matches[userIdx];
    const userIsHome = m.home.id === userClub.id;
    m.homeScore = userIsHome ? userScore : oppScore;
    m.awayScore = userIsHome ? oppScore : userScore;
    m.winner = userWon ? (userIsHome ? 'home' : 'away') : (userIsHome ? 'away' : 'home');
    m.played = true;
    m.isUser = true;

    // Sim other matches in this round
    for (let i = 0; i < matches.length; i++) {
      if (!matches[i].played) {
        const simmed = simulateMatch(matches[i].home, matches[i].away);
        matches[i] = { ...matches[i], ...simmed };
      }
    }

    // If user lost, do NOT advance them — but build next round for completeness from other winners
    const nextRound = ROUND_ORDER[ROUND_ORDER.indexOf(round) + 1];
    if (nextRound) {
      const winners = matches.map(mm => mm.winner === 'home' ? mm.home : mm.away);
      for (let i = 0; i < winners.length / 2; i++) {
        newBr[nextRound][i] = {
          ...newBr[nextRound][i],
          home: winners[i*2],
          away: winners[i*2 + 1],
          played: false, winner: null, homeScore: null, awayScore: null,
          isUser: winners[i*2]?.id === userClub.id || winners[i*2 + 1]?.id === userClub.id,
        };
      }
    }
    return newBr;
  }

  return {
    ROUND_ORDER, ROUND_LABEL, ROUND_LABEL_SHORT, ROUND_DIFFICULTY, ROUND_SIZE,
    buildBracket, advanceBracket, getCurrentUserRound, recordAndAdvance, simulateMatch, shuffle,
  };
})();
