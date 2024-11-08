const express = require('express');
const { allBooks, createBook, getBookById, updateBooK, deleteBooK, filterBooKs } = require('../controllers/bookController');

const router = express.Router()

router.route('/books').get(allBooks);
router.route('/book').post(createBook);
router.route('/book/:id').get(getBookById);
router.route('/book/:id').put(updateBooK);
router.route('/book/:id').delete(deleteBooK);
router.route('/books/filter').post(filterBooKs);

module.exports = router;