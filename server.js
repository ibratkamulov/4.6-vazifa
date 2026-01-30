const express = require('express');
const path = require('path');

// Routes import
const indexRouter = require('./routes/index');
const employeesRouter = require('./routes/employees');
const medicinesRouter = require('./routes/medicines');

const app = express();
const PORT = process.env.PORT || 4001; // ← 4001 ga o'zgartirdik

// ==========================================
// MIDDLEWARE SETUP
// ==========================================

// View engine (EJS) sozlash
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static fayllar uchun (ServeStatic)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware (formalardan ma'lumot olish)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request ma'lumotlarini console'ga chiqarish (development uchun)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// ==========================================
// ROUTES
// ==========================================

app.use('/', indexRouter);
app.use('/employees', employeesRouter);
app.use('/medicines', medicinesRouter);

// ==========================================
// ERROR HANDLING (404)
// ==========================================

app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="uz">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - Sahifa topilmadi</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0;
        }
        .error-container {
          background: white;
          padding: 50px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 {
          color: #dc3545;
          font-size: 4rem;
          margin: 0;
        }
        p {
          font-size: 1.2rem;
          color: #666;
          margin: 20px 0;
        }
        a {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          transition: background 0.3s;
        }
        a:hover {
          background: #5568d3;
        }
      </style>
    </head>
    <body>
      <div class="error-container">
        <h1>404</h1>
        <p>Siz qidirayotgan sahifa mavjud emas</p>
        <a href="/">🏠 Bosh sahifaga qaytish</a>
      </div>
    </body>
    </html>
  `);
});

// ==========================================
// SERVER ISHGA TUSHIRISH
// ==========================================

const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
});

// ==========================================
// ERROR HANDLING (Port band bo'lsa)
// ==========================================

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error('\n' + '='.repeat(50));
    console.error(`❌ XATO: ${PORT}-port allaqachon band!`);
    console.error('='.repeat(50));
    console.error('\n💡 Yechim:');
    console.error('   1. Eski jarayonni to\'xtatish:');
    console.error('      netstat -ano | findstr :' + PORT);
    console.error('      taskkill /F /PID <PID_RAQAMI>');
    console.error('\n   2. Yoki portni o\'zgartirish:');
    console.error('      server.js da PORT ni boshqa raqamga o\'zgartiring');
    console.error('\n' + '='.repeat(50) + '\n');
    process.exit(1);
  } else {
    console.error('❌ Server xatosi:', error);
    process.exit(1);
  }
});