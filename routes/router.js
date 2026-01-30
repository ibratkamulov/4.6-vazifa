const url = require('url');
const homeController = require('../controllers/homeController');
const employeeController = require('../controllers/employeeController');
const medicineController = require('../controllers/medicineController');
const { notFound } = require('../utils/response');

// Routes map
const routes = {
  'GET /': homeController.index,
  'GET /employees': employeeController.getAllEmployees,
  'GET /medicines': medicineController.getAllMedicines,
  'GET /medicines/add': medicineController.showAddForm,
  'POST /medicines/add': medicineController.addMedicine,
  'GET /medicines/edit': medicineController.showEditForm,
  'POST /medicines/edit': medicineController.updateMedicine,
  'POST /medicines/delete': medicineController.deleteMedicine,
};

// Request handling
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;
  
  // Query parametrlarni path'ga qo'shish (edit va delete uchun)
  if (parsedUrl.query.id) {
    // /medicines/edit?id=1 => GET /medicines/edit
    // /medicines/delete?id=1 => POST /medicines/delete
  }
  
  const routeKey = `${req.method} ${pathname}`;
  const handler = routes[routeKey];
  
  if (handler) {
    handler(req, res);
  } else {
    notFound(res);
  }
}

module.exports = { handleRequest };