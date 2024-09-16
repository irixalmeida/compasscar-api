const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/cars', carController.createCar);
router.get('/cars', carController.getCars);

module.exports = router;