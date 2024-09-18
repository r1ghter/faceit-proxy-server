const apiUrl = 'https://faceit-proxy-server.vercel.app/api/faceit'; // URL pro Faceit API
const historyUrl = 'https://faceit-proxy-server.vercel.app/api/faceit-history'; // URL pro historii zápasů
const playerName = 'righterbtw'; // Jméno hráče

// Funkce pro získání FaceIT dat
async function fetchFaceitData() {
  try {
    // Získání informací o hráči
    const response = await fetch(`${apiUrl}?playerName=${playerName}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const playerId = data.player_id;
    const elo = data.games.csgo.faceit_elo;
    const level = data.games.csgo.skill_level;

    // Nastavení ikony podle levelu hráče
    document.getElementById('level-icon').src = `img/faceit-levels/level${level}.png`;

    // Zobrazení ELO
    document.getElementById('elo').textContent = elo;

    // Získání historie zápasů pro výpočet ELO změny a dnešních zápasů
    const matchResponse = await fetch(`${historyUrl}?playerId=${playerId}`);
    if (!matchResponse.ok) {
      throw new Error(`HTTP error! Status: ${matchResponse.status}`);
    }
    const matchData = await matchResponse.json();
    const today = new Date().toISOString().slice(0, 10); // Dnešní datum

    let todayMatches = 0;
    let firstMatchElo = elo;
    let lastMatchElo = elo;

    // Projdeme všechny zápasy
    matchData.items.forEach(match => {
      const matchDate = new Date(match.finished_at * 1000).toISOString().slice(0, 10); // Datum zápasu
      if (matchDate === today) {
        todayMatches += 1;
        firstMatchElo = Math.min(firstMatchElo, match.elo);
        lastMatchElo = Math.max(lastMatchElo, match.elo);
      }
    });

    // Výpočet změny ELO během dne
    const eloChange = elo - firstMatchElo;

    // Aplikace třídy pro barvu podle hodnoty
    const eloChangeElement = document.getElementById('elo-change');
    eloChangeElement.textContent = `${eloChange > 0 ? '+' : ''}${eloChange}`;
    if (eloChange > 0) {
      eloChangeElement.classList.add('positive');
    } else if (eloChange < 0) {
      eloChangeElement.classList.add('negative');
    }

    // Zobrazení počtu dnešních zápasů
    document.getElementById('today-matches').textContent = todayMatches;

  } catch (error) {
    console.error('Error fetching Faceit data:', error);
  }
}

// Volání funkce pro načtení dat při načtení stránky
document.addEventListener('DOMContentLoaded', fetchFaceitData);
