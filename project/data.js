// 32 europäische Spitzenvereine + Schweiz
// Farben: primär (Trikot Heim), sekundär (Akzent), tertiär (Detail)
// In einer Production-Version würden diese von football-data.org/v4/competitions/{id}/teams geladen.
window.CLUBS = [
  // Premier League
  { id: 'mci', name: 'Manchester City', short: 'Man City', abbr: 'MCI', league: 'Premier League', country: 'England', primary: '#6CABDD', secondary: '#1C2C5B', text: '#fff' },
  { id: 'liv', name: 'Liverpool FC',     short: 'Liverpool', abbr: 'LIV', league: 'Premier League', country: 'England', primary: '#C8102E', secondary: '#00B2A9', text: '#fff' },
  { id: 'ars', name: 'Arsenal FC',       short: 'Arsenal',   abbr: 'ARS', league: 'Premier League', country: 'England', primary: '#EF0107', secondary: '#063672', text: '#fff' },
  { id: 'mun', name: 'Manchester United', short: 'Man United', abbr: 'MUN', league: 'Premier League', country: 'England', primary: '#DA291C', secondary: '#FBE122', text: '#fff' },
  { id: 'che', name: 'Chelsea FC',       short: 'Chelsea',   abbr: 'CHE', league: 'Premier League', country: 'England', primary: '#034694', secondary: '#DBA111', text: '#fff' },
  { id: 'tot', name: 'Tottenham Hotspur', short: 'Tottenham', abbr: 'TOT', league: 'Premier League', country: 'England', primary: '#132257', secondary: '#ffffff', text: '#fff' },
  { id: 'new', name: 'Newcastle United', short: 'Newcastle', abbr: 'NEW', league: 'Premier League', country: 'England', primary: '#241F20', secondary: '#ffffff', text: '#fff' },
  { id: 'avl', name: 'Aston Villa',      short: 'Aston Villa', abbr: 'AVL', league: 'Premier League', country: 'England', primary: '#670E36', secondary: '#95BFE5', text: '#fff' },
  // La Liga
  { id: 'rma', name: 'Real Madrid',      short: 'Real Madrid', abbr: 'RMA', league: 'La Liga', country: 'Spanien', primary: '#FEBE10', secondary: '#00529F', text: '#1a1a1a' },
  { id: 'fcb', name: 'FC Barcelona',     short: 'Barcelona', abbr: 'BAR', league: 'La Liga', country: 'Spanien', primary: '#A50044', secondary: '#004D98', text: '#fff' },
  { id: 'atm', name: 'Atlético Madrid',  short: 'Atlético', abbr: 'ATM', league: 'La Liga', country: 'Spanien', primary: '#CB3524', secondary: '#272E61', text: '#fff' },
  { id: 'sev', name: 'FC Sevilla',       short: 'Sevilla', abbr: 'SEV', league: 'La Liga', country: 'Spanien', primary: '#D81920', secondary: '#ffffff', text: '#fff' },
  // Bundesliga
  { id: 'fcb_m', name: 'Bayern München', short: 'Bayern', abbr: 'FCB', league: 'Bundesliga', country: 'Deutschland', primary: '#DC052D', secondary: '#0066B2', text: '#fff' },
  { id: 'bvb', name: 'Borussia Dortmund', short: 'Dortmund', abbr: 'BVB', league: 'Bundesliga', country: 'Deutschland', primary: '#FDE100', secondary: '#1a1a1a', text: '#1a1a1a' },
  { id: 'rbl', name: 'RB Leipzig',       short: 'Leipzig', abbr: 'RBL', league: 'Bundesliga', country: 'Deutschland', primary: '#DD0741', secondary: '#001F47', text: '#fff' },
  { id: 'b04', name: 'Bayer Leverkusen', short: 'Leverkusen', abbr: 'B04', league: 'Bundesliga', country: 'Deutschland', primary: '#E32219', secondary: '#1a1a1a', text: '#fff' },
  // Serie A
  { id: 'int', name: 'Inter Mailand',    short: 'Inter', abbr: 'INT', league: 'Serie A', country: 'Italien', primary: '#0068A8', secondary: '#000000', text: '#fff' },
  { id: 'mil', name: 'AC Mailand',       short: 'Milan', abbr: 'MIL', league: 'Serie A', country: 'Italien', primary: '#FB090B', secondary: '#000000', text: '#fff' },
  { id: 'juv', name: 'Juventus Turin',   short: 'Juventus', abbr: 'JUV', league: 'Serie A', country: 'Italien', primary: '#000000', secondary: '#ffffff', text: '#fff' },
  { id: 'nap', name: 'SSC Neapel',       short: 'Napoli', abbr: 'NAP', league: 'Serie A', country: 'Italien', primary: '#12A0D7', secondary: '#003C82', text: '#fff' },
  { id: 'rom', name: 'AS Rom',           short: 'Roma', abbr: 'ROM', league: 'Serie A', country: 'Italien', primary: '#8E1F2F', secondary: '#F0BC42', text: '#fff' },
  // Ligue 1
  { id: 'psg', name: 'Paris Saint-Germain', short: 'PSG', abbr: 'PSG', league: 'Ligue 1', country: 'Frankreich', primary: '#004170', secondary: '#DA291C', text: '#fff' },
  { id: 'om',  name: 'Olympique Marseille', short: 'Marseille', abbr: 'OM',  league: 'Ligue 1', country: 'Frankreich', primary: '#2FAEE0', secondary: '#ffffff', text: '#fff' },
  { id: 'mon', name: 'AS Monaco',        short: 'Monaco', abbr: 'MON', league: 'Ligue 1', country: 'Frankreich', primary: '#CE1126', secondary: '#ffffff', text: '#fff' },
  { id: 'lyo', name: 'Olympique Lyon',   short: 'Lyon', abbr: 'LYO', league: 'Ligue 1', country: 'Frankreich', primary: '#003B7B', secondary: '#DA291C', text: '#fff' },
  // Eredivisie
  { id: 'aja', name: 'Ajax Amsterdam',   short: 'Ajax', abbr: 'AJA', league: 'Eredivisie', country: 'Niederlande', primary: '#D2122E', secondary: '#ffffff', text: '#fff' },
  { id: 'psv', name: 'PSV Eindhoven',    short: 'PSV', abbr: 'PSV', league: 'Eredivisie', country: 'Niederlande', primary: '#ED1C24', secondary: '#ffffff', text: '#fff' },
  // Liga Portugal
  { id: 'ben', name: 'Benfica Lissabon', short: 'Benfica', abbr: 'BEN', league: 'Liga Portugal', country: 'Portugal', primary: '#E30613', secondary: '#ffffff', text: '#fff' },
  { id: 'por', name: 'FC Porto',         short: 'Porto', abbr: 'POR', league: 'Liga Portugal', country: 'Portugal', primary: '#00428C', secondary: '#ffffff', text: '#fff' },
  // Schweiz
  { id: 'ybb', name: 'BSC Young Boys',   short: 'YB Bern', abbr: 'YB',  league: 'Super League', country: 'Schweiz', primary: '#FDE100', secondary: '#000000', text: '#1a1a1a' },
  { id: 'fcb_b', name: 'FC Basel',       short: 'Basel', abbr: 'FCB', league: 'Super League', country: 'Schweiz', primary: '#D81920', secondary: '#005091', text: '#fff' },
  { id: 'fcz', name: 'FC Zürich',        short: 'FCZ', abbr: 'FCZ', league: 'Super League', country: 'Schweiz', primary: '#005CA9', secondary: '#ffffff', text: '#fff' },
];

window.LEAGUES = [
  { id: 'Premier League', name: 'Premier League', country: 'England',     accent: '#3D195B' },
  { id: 'La Liga',         name: 'LaLiga',        country: 'Spanien',     accent: '#EE8707' },
  { id: 'Bundesliga',      name: 'Bundesliga',    country: 'Deutschland', accent: '#D20515' },
  { id: 'Serie A',         name: 'Serie A',       country: 'Italien',     accent: '#008FD7' },
  { id: 'Ligue 1',         name: 'Ligue 1',       country: 'Frankreich',  accent: '#091C3E' },
  { id: 'Eredivisie',      name: 'Eredivisie',    country: 'Niederlande', accent: '#FF6B00' },
  { id: 'Liga Portugal',   name: 'Liga Portugal', country: 'Portugal',    accent: '#006633' },
  { id: 'Super League',    name: 'Super League',  country: 'Schweiz',     accent: '#DA291C' },
];
