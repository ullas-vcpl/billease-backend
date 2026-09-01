//routes.js
const express = require('express');
const router = express.Router();
const dummy = require('../controllers/dummyController.js');



const check = require('../controllers/checkController.js');
const signUp = require('../controllers/signUpController.js');
const login = require('../controllers/loginController.js');
const authorization = require('../middlewares/authorization.js');
const logout = require('../controllers/logoutController.js');
const protect = require('../middlewares/protect.js');
const getproducts = require('../controllers/product/getProductsController.js');
const addProduct = require('../controllers/product/addProductController.js');
const updateProduct = require('../controllers/product/updateProductController.js');
const deleteProduct = require('../controllers/product/deleteProductController.js');
const addCustomer = require('../controllers/customer/addCustomerController.js');
const deleteCustomer = require('../controllers/customer/deleteCustomerController.js');
const getCustomers = require('../controllers/customer/getCustomersController.js');
const updateCustomer = require('../controllers/customer/updateCustomerController.js');
const getBillById = require('../controllers/bill/getBillByIdController.js');
const addBill = require('../controllers/bill/addBillController.js');
const getBills = require('../controllers/bill/getBillsController.js');

//dashboard routes
const { getDashboardSummary, getSalesOverview, getRecentBills } = require('../controllers/dashboard/dashboaedController.js');
// routes
router.get('/check', check);
router.post('/signup', authorization, protect, signUp);
router.post('/login', login);
router.post('/dummy',authorization, dummy);
router.post('/logout', authorization, logout);
router.get('/getProducts', authorization, getproducts);
router.post('/addProduct', authorization, addProduct);
router.put('/update/:id', authorization, updateProduct);
router.delete('/delete/:id', authorization, deleteProduct);
router.post('/addCustomer', authorization, addCustomer);
router.put('/updateCustomer/:id', authorization, updateCustomer);
router.get('/getCustomers', authorization, getCustomers);
router.post('/addBill', authorization, addBill);
router.get('/getBillById/:id', authorization, getBillById);
router.get('/getBills', authorization, getBills);
router.get('/dashboard/summary', authorization, getDashboardSummary);
router.get('/dashboard/sales-overview', authorization, getSalesOverview);
router.get('/dashboard/recent-bills', authorization, getRecentBills);


module.exports = router;