const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController')


router.get('/getSalesDaily', graphController.getSalesDaily)

module.exports = router;