const playerName = 'righterbtw'; // Jméno hráče
const proxyUrl = `https://tvuj-proxy.vercel.app/api/faceit?playerName=${playerName}`; // Proxy URL

async function fetchFaceitData() {
    try {
        // Získání informací o hráči prostřednictvím proxy serveru na Vercel
        const response = await fetch(proxyUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const elo = data.games.csgo.faceit_elo;
        const level = data.games.csgo.skill_level;

        // Nastavení ikony podle levelu hráče
        document.getElementById('level-icon').src = `img/faceit-levels/level${level}.png`;

        // Zobrazení ELO
        document.getElementById('elo').textContent = elo;

        // Volání pro další zápasy a ELO změny, jak bylo původně ve tvém kódu
        const playerId = data.player_id;
        fetchMatchHistory(playerId, elo); // Další funkce, která zpracuje historii zápasů

    } catch (error) {
        console.error('Error fetching Faceit data:', error);
    }
}

async function fetchMatchHistory(playerId, currentElo) {
    try {
        const matchResponse = await fetch(`https://tvuj-proxy.vercel.app/api/faceit-history?playerId=${playerId}`);
        const matchData = await matchResponse.json();
        const today = new Date().toISOString().slice(0, 10);

        let todayMatches = 0;
        let firstMatchElo = currentElo;
        let lastMatchElo = currentElo;

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
        const eloChange = currentElo - firstMatchElo;

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
        console.error('Error fetching match history:', error);
    }
}

fetchFaceitData();
