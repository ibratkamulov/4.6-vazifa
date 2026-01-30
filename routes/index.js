const express = require('express');
const router = express.Router();

// Bosh sahifa
router.get('/', (req, res) => {
  res.status(200).render('index', {
    title: 'Bosh sahifa - Dorixona',
    message: 'Dorixona boshqaruv tizimiga xush kelibsiz!'
  });
});

module.exports = router;