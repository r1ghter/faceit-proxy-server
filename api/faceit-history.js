import fetch from 'node-fetch';

const FACEIT_API_KEY = process.env.FACEIT_API_KEY;

export default async function handler(req, res) {
    const { playerId } = req.query;

    try {
        const faceitResponse = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/history?game=csgo&offset=0&limit=20`, {
            headers: {
                'Authorization': `Bearer ${FACEIT_API_KEY}`
            }
        });

        if (!faceitResponse.ok) {
            throw new Error(`Error: ${faceitResponse.statusText}`);
        }

        const data = await faceitResponse.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
