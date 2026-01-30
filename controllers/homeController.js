const fs = require('fs');
const path = require('path');

exports.index = (req, res) => {
  const headerPath = path.join(__dirname, '../views/partials/header.html');
  const footerPath = path.join(__dirname, '../views/partials/footer.html');
  const contentPath = path.join(__dirname, '../views/index.html');
  
  const header = fs.readFileSync(headerPath, 'utf-8');
  const footer = fs.readFileSync(footerPath, 'utf-8');
  const content = fs.readFileSync(contentPath, 'utf-8');
  
  const html = header + content + footer;
  
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
};