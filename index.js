const express = require('express');
const cors = require('cors');
const scrapeRoute = require('./src/routes/scrape');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

app.use('/scrape', scrapeRoute);

app.get('/', (req, res) => {
    res.send('Welcome to AmbitionBox Scraper API 🚀');
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
