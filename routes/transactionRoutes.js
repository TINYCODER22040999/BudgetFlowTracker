const express = require('express');
const { addTransaction, getAllTransaction, editTransaction , deleteTransaction} = require('../controllers/transactionCtrl');

// router object 
const router = express.Router();


// route
// addtransaction route
router.post('/add-transaction', addTransaction)

// edittransaction route
router.post('/edit-transaction', editTransaction)


// deletetransaction route
router.post('/delete-transaction', deleteTransaction)

// getAllTrasaction route
router.post('/get-transaction', getAllTransaction);

module.exports = router;