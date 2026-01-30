const fs = require('fs');
const path = require('path');

// Ma'lumotlarni o'qish
function getEmployeesData() {
  try {
    const filePath = path.join(__dirname, '../data/employees.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('employees.json xatosi:', error.message);
    return [];
  }
}

// Hodimlar ro'yxati
exports.getAllEmployees = (req, res) => {
  try {
    const employees = getEmployeesData();
    
    const headerPath = path.join(__dirname, '../views/partials/header.html');
    const footerPath = path.join(__dirname, '../views/partials/footer.html');
    const templatePath = path.join(__dirname, '../views/employees.html');
    
    const header = fs.readFileSync(headerPath, 'utf-8');
    const footer = fs.readFileSync(footerPath, 'utf-8');
    let content = fs.readFileSync(templatePath, 'utf-8');
    
    // Hodimlarni HTML'ga aylantirish
    let employeesHTML = '';
    employees.forEach(emp => {
      employeesHTML += `
        <tr>
          <td>${emp.id}</td>
          <td>${emp.name}</td>
          <td><span class="badge badge-position">${emp.position}</span></td>
          <td>${emp.phone}</td>
          <td>${emp.email}</td>
          <td>${emp.experience}</td>
        </tr>
      `;
    });
    
    content = content.replace('{{employees}}', employeesHTML);
    
    const html = header + content + footer;
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (error) {
    console.error('Xato:', error);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Server xatosi</h1>');
  }
};