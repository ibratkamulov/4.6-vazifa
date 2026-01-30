const fs = require('fs');
const path = require('path');

// Ma'lumotlar faylini o'qish
const getEmployeesData = () => {
  try {
    const filePath = path.join(__dirname, '../data/employees.json');
    
    console.log('📂 Fayl yo\'li:', filePath);
    
    // Fayl mavjudligini tekshirish
    if (!fs.existsSync(filePath)) {
      console.error('❌ employees.json fayli topilmadi!');
      console.error('❌ Tekshirilgan yo\'l:', filePath);
      return [];
    }
    
    console.log('✅ Fayl topildi');
    
    const data = fs.readFileSync(filePath, 'utf-8');
    console.log('✅ Fayl o\'qildi, uzunligi:', data.length, 'belgi');
    
    const employees = JSON.parse(data);
    console.log('✅ JSON parse qilindi, hodimlar soni:', employees.length);
    
    return employees;
  } catch (error) {
    console.error('❌ Xatolik yuz berdi:');
    console.error('   Xato turi:', error.name);
    console.error('   Xato xabari:', error.message);
    
    if (error instanceof SyntaxError) {
      console.error('   ⚠️ JSON syntax xatosi! employees.json faylini tekshiring');
    }
    
    return [];
  }
};

// Barcha hodimlarni ko'rsatish
const getAllEmployees = (req, res) => {
  try {
    console.log('\n' + '='.repeat(50));
    console.log('👥 HODIMLAR sahifasi so\'raldi');
    console.log('='.repeat(50));
    
    const employees = getEmployeesData();
    
    console.log('📊 Render ma\'lumotlari:');
    console.log('   - Hodimlar soni:', employees.length);
    console.log('   - Birinchi hodim:', employees[0] ? employees[0].name : 'Yo\'q');
    
    if (employees.length === 0) {
      console.warn('⚠️ OGOHLANTIRISH: Hodimlar ro\'yxati bo\'sh!');
    }
    
    res.status(200).render('employees', {
      title: 'Hodimlar ro\'yxati',
      employees: employees
    });
    
    console.log('✅ Sahifa muvaffaqiyatli render qilindi\n');
  } catch (error) {
    console.error('\n❌ getAllEmployees xatosi:');
    console.error('   Xato:', error.message);
    console.error('   Stack:', error.stack);
    
    res.status(500).send(`
      <h1>Server xatosi</h1>
      <p>Xato: ${error.message}</p>
      <a href="/">Bosh sahifaga qaytish</a>
    `);
  }
};

module.exports = getAllEmployees
