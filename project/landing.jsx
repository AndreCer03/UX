// LANDING SCREEN — name + club dropdown (single page)
const { useState, useEffect, useRef, useMemo, useCallback } = React;

function Landing({ onStart }) {
  const [name, setName] = useState('');
  const [clubId, setClubId] = useState('');

  // Group clubs by league for optgroup rendering
  const clubsByLeague = useMemo(() => {
    const map = {};
    window.CLUBS.forEach(c => {
      if (!map[c.league]) map[c.league] = [];
      map[c.league].push(c);
    });
    return map;
  }, []);

  const club = useMemo(() => window.CLUBS.find(c => c.id === clubId), [clubId]);

  const canStart = name.trim().length >= 2 && club;

  const start = () => {
    if (!canStart) return;
    onStart({ user: name.trim(), club });
  };

  return (
    <div className="main fade-in" style={{ paddingTop: 24 }}>
      <div className="container" style={{ width: '100%' }}>
        <Steps current="landing" />

        {/* HERO */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1fr)',
          gap: 60,
          alignItems: 'center',
          minHeight: 'calc(100vh - 280px)',
        }}>
          <div className="slide-up">
            <div className="eyebrow">Saison 25/26 · Champions Cup</div>
            <h1 className="display" style={{ marginTop: 18 }}>
              <span className="stroke">DEIN WEG</span><br />
              ZUM <span className="accent">TITEL</span>.
            </h1>
            <p className="body-lg" style={{ marginTop: 24 }}>
              Vier Runden. Sechzehn Vereine. Eine Frage nach der anderen.
              Schiess fünf Tore, ehe du fünf kassierst — und du stehst eine Runde weiter.
            </p>

            {/* Stat row */}
            <div style={{ display: 'flex', gap: 32, marginTop: 36, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--text)', letterSpacing: 0 }}>16</div>
                Vereine
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--text)', letterSpacing: 0 }}>04</div>
                Runden
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--text)', letterSpacing: 0 }}>90:00</div>
                Pro Spiel
              </div>
            </div>
          </div>

          {/* Setup card */}
          <div className="slide-up" style={{ animationDelay: '0.15s' }}>
            <div style={{
              background: 'var(--bg-2)',
              border: '1px solid var(--line-strong)',
              borderRadius: 4,
              padding: 32,
              boxShadow: '0 24px 60px -28px rgba(0,0,0,0.7)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }}></div>

              <div className="eyebrow" style={{ marginBottom: 20 }}>
                Manager-Setup
              </div>

              {/* Name */}
              <label className="label">Dein Name</label>
              <input
                className="field"
                autoFocus
                placeholder="z.B. Lukas"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canStart && start()}
              />

              {/* Club select */}
              <label className="label" style={{ marginTop: 22 }}>Dein Verein</label>
              <div className="select-wrap">
                <select
                  className="field select"
                  value={clubId}
                  onChange={e => setClubId(e.target.value)}
                >
                  <option value="" disabled>Verein auswählen…</option>
                  {Object.entries(clubsByLeague).map(([lg, clubs]) => (
                    <optgroup key={lg} label={lg}>
                      {clubs.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <span className="select-arrow">▾</span>
              </div>

              {/* Club preview */}
              {club && (
                <div className="club-preview fade-in" key={club.id}>
                  <Crest club={club} size="lg" />
                  <div>
                    <div className="club-preview-name">{club.short}</div>
                    <div className="club-preview-meta">{club.league} · {club.country}</div>
                  </div>
                </div>
              )}

              <button
                className="btn"
                onClick={start}
                disabled={!canStart}
                style={{ marginTop: 28, width: '100%', justifyContent: 'center' }}
              >
                Turnier starten <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Landing = Landing;
