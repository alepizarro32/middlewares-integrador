// ************ Require's ************
const express = require('express');
const router = express.Router();
const guestMiddleware = require('../middlewares/guestMiddleware');
// ************ Controller Require ************
const mainController = require('../controllers/mainController');

router.get('/',mainController.index);

module.exports = router;
