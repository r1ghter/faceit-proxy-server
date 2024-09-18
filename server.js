const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Port na kterém bude server naslouchat

const FACEIT_API_KEY = 'e622f31f-c507-4a5c-9bb2-f396df2c62a1';

// Umožnění CORS pro všechny požadavky
app.use(cors());

// Proxy route pro požadavky na Faceit API
app.get('/faceit/:playerName', (req, res) => {
    const playerName = req.params.playerName;

    const options = {
        url: `https://open.faceit.com/data/v4/players?nickname=${playerName}`,
        headers: {
            'Authorization': `Bearer ${FACEIT_API_KEY}`
        }
    };

    // Přeposílání požadavku na Faceit API
    request(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            res.json(JSON.parse(body));
        } else {
            res.status(response.statusCode).send(error || 'Error fetching data');
        }
    });
});

// Start serveru
app.listen(port, () => {
    console.log(`Proxy server běží na http://localhost:${port}`);
});
