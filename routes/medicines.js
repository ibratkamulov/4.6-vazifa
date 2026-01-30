const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// ==========================================
// MEDICINES CRUD ROUTES
// ==========================================

// READ - Barcha dorilarni ko'rish
router.get('/', medicineController.getAllMedicines);

// CREATE - Yangi dori qo'shish formasi
router.get('/add', medicineController.showAddForm);

// CREATE - Yangi dori qo'shish (POST)
router.post('/add', medicineController.addMedicine);

// UPDATE - Dorini tahrirlash formasi
router.get('/edit/:id', medicineController.showEditForm);

// UPDATE - Dorini yangilash (POST simulyatsiya)
router.post('/edit/:id', medicineController.updateMedicine);

// DELETE - Dorini o'chirish
router.post('/delete/:id', medicineController.deleteMedicine);

module.exports = router;