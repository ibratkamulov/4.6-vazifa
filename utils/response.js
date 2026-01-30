const fs = require('fs');
const path = require('path');

// HTML render qilish (template)
function render(res, viewPath, data = {}) {
  const filePath = path.join(__dirname, '../views', viewPath);
  
  fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>500 - Server xatosi</h1>');
      return;
    }
    
    // Template engine (oddiy {{variable}} replacement)
    let html = content;
    
    for (const key in data) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key]);
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  });
}

// JSON response
function json(res, data, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Redirect
function redirect(res, location) {
  res.writeHead(302, { 'Location': location });
  res.end();
}

// 404
function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="UTF-8">
      <title>404 - Sahifa topilmadi</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <div style="text-align: center; padding: 100px;">
        <h1 style="font-size: 5rem; color: #dc3545;">404</h1>
        <p style="font-size: 1.5rem;">Sahifa topilmadi</p>
        <a href="/" style="display: inline-block; margin-top: 20px; padding: 10px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Bosh sahifa</a>
      </div>
    </body>
    </html>
  `);
}

module.exports = { render, json, redirect, notFound };