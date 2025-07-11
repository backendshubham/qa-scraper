const express = require('express');
const router = express.Router();
const scraperController = require('../controllers/scraperController');

router.get('/:role', scraperController.scrapeQuestions);

module.exports = router;
