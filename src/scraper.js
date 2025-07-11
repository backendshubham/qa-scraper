const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

class AmbitionBoxScraper {
    constructor(url) {
        this.url = url;
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        };
    }

    async fetchPage() {
        try {
            const response = await axios.get(this.url, { headers: this.headers });
            return cheerio.load(response.data);
        } catch (error) {
            console.error(`❌ Error fetching page: ${error.message}`);
            throw error;
        }
    }

async scrapeQuestionsAndAnswers() {
    const $ = await this.fetchPage();
    const qaList = [];

    $('div[itemtype="https://schema.org/Question"]').each((_, element) => {
        // Question
        let questionDiv = $(element).find('div[itemprop="name"]').clone();
        questionDiv.find('span').remove(); // Remove "read more" if exists

        // Get all paragraphs, pre, h3, etc. as text and join with line breaks
        const questionTexts = [];
        questionDiv.find('h3, p, pre, ul, ol, li').each((_, el) => {
            questionTexts.push($(el).text().trim());
        });
        const question = questionTexts.join('\n').trim();

        // Answer
        let answerDiv = $(element).find('div[itemprop="text"]').clone();

        const answerTexts = [];
        answerDiv.find('p, pre, li').each((_, el) => {
            answerTexts.push($(el).text().trim());
        });
        const answer = answerTexts.join('\n').trim();

        if (question && answer) {
            qaList.push({ question, answer });
        }
    });

    return qaList;
}


    saveToJson(data, filePath) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✅ Data saved successfully to ${filePath}`);
    }
}

module.exports = AmbitionBoxScraper;
