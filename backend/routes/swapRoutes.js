const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');
const auth = require('../middleware/auth');


router.post('/initiate', auth, swapController.createSwapRequest);


router.get('/my-swaps', auth, swapController.getUserSwaps);


router.put('/:id/accept', auth, swapController.acceptSwap);


router.post('/review', auth, swapController.leaveReview);

module.exports = router;
