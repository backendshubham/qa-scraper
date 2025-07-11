const AmbitionBoxScraper = require('../scraper');
const path = require('path');

exports.scrapeQuestions = async (req, res) => {
    const role = req.params.role;
    const url = `https://www.ambitionbox.com/profiles/${role}/interview-questions`;
    const scraper = new AmbitionBoxScraper(url);

    try {
        const qaList = await scraper.scrapeQuestionsAndAnswers();
        const filePath = path.join(__dirname, '../../data', `${role}-questions.json`);

        scraper.saveToJson(qaList, filePath);

        res.json({
            message: `Questions scraped and saved to ${filePath}`,
            data: qaList
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
