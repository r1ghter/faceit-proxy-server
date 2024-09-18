import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { playerName } = req.query;
  const apiKey = 'e622f31f-c507-4a5c-9bb2-f396df2c62a1'; // Tvůj API klíč

  try {
    const response = await fetch(`https://open.faceit.com/data/v4/players?nickname=${playerName}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
