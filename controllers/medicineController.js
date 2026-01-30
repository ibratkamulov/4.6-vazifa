const fs = require('fs');
const path = require('path');
const url = require('url');
const { parseBody } = require('../utils/bodyParser');
const { redirect } = require('../utils/response');

// Helper functions
function getMedicinesData() {
  const filePath = path.join(__dirname, '../data/medicines.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function saveMedicinesData(medicines) {
  const filePath = path.join(__dirname, '../data/medicines.json');
  fs.writeFileSync(filePath, JSON.stringify(medicines, null, 2), 'utf-8');
}

function generateId(medicines) {
  if (medicines.length === 0) return 1;
  return Math.max(...medicines.map(m => m.id)) + 1;
}

// READ - Barcha dorilar
exports.getAllMedicines = (req, res) => {
  try {
    const medicines = getMedicinesData();
    
    const headerPath = path.join(__dirname, '../views/partials/header.html');
    const footerPath = path.join(__dirname, '../views/partials/footer.html');
    const templatePath = path.join(__dirname, '../views/medicines/list.html');
    
    const header = fs.readFileSync(headerPath, 'utf-8');
    const footer = fs.readFileSync(footerPath, 'utf-8');
    let content = fs.readFileSync(templatePath, 'utf-8');
    
    // Dorilarni HTML'ga aylantirish
    let medicinesHTML = '';
    medicines.forEach(med => {
      medicinesHTML += `
        <div class="medicine-card">
          <div class="medicine-header">
            <h3>${med.name}</h3>
            <span class="price">${med.price.toLocaleString()} so'm</span>
          </div>
          <div class="medicine-body">
            <p><strong>Ishlab chiqaruvchi:</strong> ${med.manufacturer}</p>
            <p><strong>Miqdori:</strong> <span class="quantity">${med.quantity} dona</span></p>
            <p><strong>Yaroqlilik:</strong> ${new Date(med.expiryDate).toLocaleDateString('uz-UZ')}</p>
            <p class="description">${med.description}</p>
          </div>
          <div class="medicine-actions">
            <a href="/medicines/edit?id=${med.id}" class="btn btn-warning btn-sm">✏️ Tahrirlash</a>
            <form action="/medicines/delete?id=${med.id}" method="POST" style="display: inline;">
              <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Rostdan ham o\\'chirmoqchimisiz?')">
                🗑️ O'chirish
              </button>
            </form>
          </div>
        </div>
      `;
    });
    
    content = content.replace('{{medicines}}', medicinesHTML);
    
    const html = header + content + footer;
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (error) {
    console.error('Xato:', error);
    res.writeHead(500);
    res.end('Server xatosi');
  }
};

// CREATE - Form ko'rsatish
exports.showAddForm = (req, res) => {
  const headerPath = path.join(__dirname, '../views/partials/header.html');
  const footerPath = path.join(__dirname, '../views/partials/footer.html');
  const formPath = path.join(__dirname, '../views/medicines/add.html');
  
  const header = fs.readFileSync(headerPath, 'utf-8');
  const footer = fs.readFileSync(footerPath, 'utf-8');
  const form = fs.readFileSync(formPath, 'utf-8');
  
  const html = header + form + footer;
  
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
};

// CREATE - Dori qo'shish
exports.addMedicine = (req, res) => {
  parseBody(req, (body) => {
    try {
      const medicines = getMedicinesData();
      
      const newMedicine = {
        id: generateId(medicines),
        name: body.name,
        price: parseFloat(body.price),
        quantity: parseInt(body.quantity),
        manufacturer: body.manufacturer,
        expiryDate: body.expiryDate,
        description: body.description || ''
      };
      
      medicines.push(newMedicine);
      saveMedicinesData(medicines);
      
      console.log('✅ Yangi dori qo\'shildi:', newMedicine.name);
      
      redirect(res, '/medicines');
    } catch (error) {
      console.error('Xato:', error);
      res.writeHead(500);
      res.end('Dori qo\'shishda xatolik');
    }
  });
};

// UPDATE - Edit form
exports.showEditForm = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const medicineId = parseInt(parsedUrl.query.id);
  
  const medicines = getMedicinesData();
  const medicine = medicines.find(m => m.id === medicineId);
  
  if (!medicine) {
    res.writeHead(404);
    res.end('Dori topilmadi');
    return;
  }
  
  const headerPath = path.join(__dirname, '../views/partials/header.html');
  const footerPath = path.join(__dirname, '../views/partials/footer.html');
  const formPath = path.join(__dirname, '../views/medicines/edit.html');
  
  const header = fs.readFileSync(headerPath, 'utf-8');
  const footer = fs.readFileSync(footerPath, 'utf-8');
  let form = fs.readFileSync(formPath, 'utf-8');
  
  // Ma'lumotlarni formga joylashtirish
  form = form.replace('{{id}}', medicine.id);
  form = form.replace('{{name}}', medicine.name);
  form = form.replace('{{price}}', medicine.price);
  form = form.replace('{{quantity}}', medicine.quantity);
  form = form.replace('{{manufacturer}}', medicine.manufacturer);
  form = form.replace('{{expiryDate}}', medicine.expiryDate);
  form = form.replace('{{description}}', medicine.description);
  
  const html = header + form + footer;
  
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
};

// UPDATE - Yangilash
exports.updateMedicine = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const medicineId = parseInt(parsedUrl.query.id);
  
  parseBody(req, (body) => {
    try {
      const medicines = getMedicinesData();
      const index = medicines.findIndex(m => m.id === medicineId);
      
      if (index === -1) {
        res.writeHead(404);
        res.end('Dori topilmadi');
        return;
      }
      
      medicines[index] = {
        id: medicineId,
        name: body.name,
        price: parseFloat(body.price),
        quantity: parseInt(body.quantity),
        manufacturer: body.manufacturer,
        expiryDate: body.expiryDate,
        description: body.description || ''
      };
      
      saveMedicinesData(medicines);
      
      console.log('✏️ Dori yangilandi:', medicines[index].name);
      
      redirect(res, '/medicines');
    } catch (error) {
      console.error('Xato:', error);
      res.writeHead(500);
      res.end('Yangilashda xatolik');
    }
  });
};

// DELETE
exports.deleteMedicine = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const medicineId = parseInt(parsedUrl.query.id);
  
  try {
    const medicines = getMedicinesData();
    const index = medicines.findIndex(m => m.id === medicineId);
    
    if (index === -1) {
      res.writeHead(404);
      res.end('Dori topilmadi');
      return;
    }
    
    const deleted = medicines.splice(index, 1)[0];
    saveMedicinesData(medicines);
    
    console.log('🗑️ Dori o\'chirildi:', deleted.name);
    
    redirect(res, '/medicines');
  } catch (error) {
    console.error('Xato:', error);
    res.writeHead(500);
    res.end('O\'chirishda xatolik');
  }
};