const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const router = require('./routes/router');

const PORT = process.env.PORT || 8000;
const HOST = 'localhost';

// ==========================================
// MIME TYPES (Static fayllar uchun)
// ==========================================
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// ==========================================
// STATIC FAYLLARNI SERVE QILISH
// ==========================================
function serveStaticFile(req, res, filePath) {
  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Fayl topilmadi</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server xatosi: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
}

// ==========================================
// HTTP SERVER
// ==========================================
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Log
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${pathname}`);

  // Static fayllar (/css/, /js/, /images/)
  if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/images/')) {
    const filePath = path.join(__dirname, 'public', pathname);
    serveStaticFile(req, res, filePath);
    return;
  }

  // Dynamic routes
  router.handleRequest(req, res);
});

// ==========================================
// SERVER START
// ==========================================
server.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log(`🏥 DORIXONA TIZIMI (Pure Node.js)`);
  console.log(`🌐 Server: http://${HOST}:${PORT}`);
  console.log(`📅 Vaqt: ${new Date().toLocaleString()}`);
  console.log('='.repeat(50));
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} band!`);
    console.error('💡 Yechim: taskkill /F /IM node.exe\n');
  } else {
    console.error('❌ Server xatosi:', error);
  }
  process.exit(1);
});