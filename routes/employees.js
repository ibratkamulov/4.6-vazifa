const express = require('express');
const { get } = require('http');
const getAllEmployees = require('../controllers/employeeController');
const router = express.Router();

// Hodimlar ro'yxatini ko'rish (READ)
router.get('/', getAllEmployees);

module.exports = router;