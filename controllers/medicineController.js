const fs = require('fs');
const path = require('path');

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Ma'lumotlar faylini o'qish
const getMedicinesData = () => {
  const filePath = path.join(__dirname, '../data/medicines.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Ma'lumotlarni faylga yozish
const saveMedicinesData = (medicines) => {
  const filePath = path.join(__dirname, '../data/medicines.json');
  fs.writeFileSync(filePath, JSON.stringify(medicines, null, 2), 'utf-8');
};

// Yangi ID generatsiya qilish
const generateId = (medicines) => {
  if (medicines.length === 0) return 1;
  return Math.max(...medicines.map(m => m.id)) + 1;
};

// ==========================================
// CRUD OPERATIONS
// ==========================================

// READ - Barcha dorilarni ko'rsatish
exports.getAllMedicines = (req, res) => {
  try {
    const medicines = getMedicinesData();
    
    res.status(200).render('medicines/list', {
      title: 'Dorilar ro\'yxati',
      medicines: medicines
    });
  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).send('Server xatosi yuz berdi');
  }
};

// CREATE - Yangi dori qo'shish formasi
exports.showAddForm = (req, res) => {
  res.status(200).render('medicines/add', {
    title: 'Yangi dori qo\'shish'
  });
};

// CREATE - Yangi dori qo'shish (POST)
exports.addMedicine = (req, res) => {
  try {
    const medicines = getMedicinesData();
    
    const newMedicine = {
      id: generateId(medicines),
      name: req.body.name,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      manufacturer: req.body.manufacturer,
      expiryDate: req.body.expiryDate,
      description: req.body.description
    };
    
    medicines.push(newMedicine);
    saveMedicinesData(medicines);
    
    console.log('✅ Yangi dori qo\'shildi:', newMedicine.name);
    
    // 201 Created status code
    res.status(201).redirect('/medicines');
  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).send('Dori qo\'shishda xatolik yuz berdi');
  }
};

// UPDATE - Dorini tahrirlash formasi
exports.showEditForm = (req, res) => {
  try {
    const medicines = getMedicinesData();
    const medicineId = parseInt(req.params.id);
    
    const medicine = medicines.find(m => m.id === medicineId);
    
    if (!medicine) {
      return res.status(404).send('Dori topilmadi');
    }
    
    res.status(200).render('medicines/edit', {
      title: 'Dorini tahrirlash',
      medicine: medicine
    });
  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).send('Server xatosi yuz berdi');
  }
};

// UPDATE - Dorini yangilash
exports.updateMedicine = (req, res) => {
  try {
    const medicines = getMedicinesData();
    const medicineId = parseInt(req.params.id);
    
    const index = medicines.findIndex(m => m.id === medicineId);
    
    if (index === -1) {
      return res.status(404).send('Dori topilmadi');
    }
    
    medicines[index] = {
      id: medicineId,
      name: req.body.name,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      manufacturer: req.body.manufacturer,
      expiryDate: req.body.expiryDate,
      description: req.body.description
    };
    
    saveMedicinesData(medicines);
    
    console.log('✏️ Dori yangilandi:', medicines[index].name);
    
    res.status(200).redirect('/medicines');
  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).send('Dori yangilashda xatolik yuz berdi');
  }
};

// DELETE - Dorini o'chirish
exports.deleteMedicine = (req, res) => {
  try {
    const medicines = getMedicinesData();
    const medicineId = parseInt(req.params.id);
    
    const index = medicines.findIndex(m => m.id === medicineId);
    
    if (index === -1) {
      return res.status(404).send('Dori topilmadi');
    }
    
    const deletedMedicine = medicines.splice(index, 1)[0];
    saveMedicinesData(medicines);
    
    console.log('🗑️ Dori o\'chirildi:', deletedMedicine.name);
    
    res.status(200).redirect('/medicines');
  } catch (error) {
    console.error('Xatolik:', error);
    res.status(500).send('Dori o\'chirishda xatolik yuz berdi');
  }
};