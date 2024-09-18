const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Endpoint pro zpracování požadavků
app.use(express.json());
app.post('/api/faceit', async (req, res) => {
    const { url, headers } = req.body;
    try {
        const response = await fetch(url, { headers });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Proxy server running on port ${port}`);
});
