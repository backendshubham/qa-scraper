const AmbitionBoxScraper = require('../scraper');
const path = require('path');

exports.scrapeQuestions = async (req, res) => {
    const role = req.params.role;

    if (!role) {
        return res.status(400).json({ error: 'Role parameter is missing.' });
    }

    const url = `https://www.ambitionbox.com/profiles/${role}/interview-questions`;
    const scraper = new AmbitionBoxScraper(url);

    try {
        const qaList = await scraper.scrapeQuestionsAndAnswers();

        if (!qaList || qaList.length === 0) {
            return res.status(404).json({ error: 'No questions found for this role. Please check the role name.' });
        }

        const filePath = path.join(__dirname, '../../data', `${role}-questions.json`);

        try {
            scraper.saveToJson(qaList, filePath);
        } catch (saveError) {
            return res.status(500).json({ error: 'Failed to save data to file.' });
        }

        res.json({
            message: `✅ Questions scraped and saved successfully.`,
            data: qaList
        });
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({ error: 'Failed to scrape questions. Please try again later.' });
    }
};
