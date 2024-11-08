const asyncHandler = require('express-async-handler');
const pool = require('../config/db');

//@description     Create a Book
//@route           GET /api/book
//@access          Public
const createBook = asyncHandler(async (req, res) => {
    try {
        const { title, author, genre, publicationDate, isbn } = req.body;

        if (!title || !author || !isbn || !publicationDate) {
            return res.status(400).json({ error: 'Enter all required fields' });
        }

        const newBook = await pool.query(
            "INSERT INTO inventory (title, author, genre, publication_date, isbn) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [title, author, genre, publicationDate, isbn]
        );

        res.status(201).json(newBook.rows[0])
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
})

//@description     Get all Books
//@route           GET /api/books
//@access          Public
const allBooks = asyncHandler(async (req, res) => {
    try {
        const allBooks = await pool.query("SELECT entry_id, title, author, genre, publication_date, isbn FROM inventory");
        res.json(allBooks.rows);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
})

//@description     Get a Book by id
//@route           GET /api/book/:id
//@access          Public
const getBookById = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const book = await pool.query("SELECT entry_id, title, author, genre, publication_date, isbn FROM inventory WHERE entry_id =$1", [id]);

        res.status(200).json(book.rows[0])
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
})

//@description     Update a Book
//@route           GET /api/book/:id
//@access          Public
const updateBooK = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, genre, publicationDate, isbn } = req.body;

        if (!title || !author || !isbn || !publicationDate) {
            return res.status(400).json({ error: 'Enter all required fields' });
        }

        const updateBook = await pool.query(
            "UPDATE inventory SET title = $1, author = $2, genre = $3, publication_date = $4, isbn = $5 WHERE entry_id = $6",
            [title, author, genre, publicationDate, isbn, id]
        );
        res.status(204).json("Book details updated successfully.")
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
})

//@description     Delete a Book
//@route           GET /api/book/:id
//@access          Public
const deleteBooK = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const deletebook = await pool.query("DELETE FROM inventory WHERE entry_id =$1", [id]);

        res.status(204).json("Book details deleted successfully.")
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
})

//@description     Filter Books
//@route           POST /api/books/filter
//@access          Public
const filterBooKs = asyncHandler(async (req, res) => {
    try {
        const { title, author, genre, publicationDate } = req.body;

        let query = 'SELECT * FROM Inventory WHERE 1=1';
        const queryParams = [];

        if (title && title.trim() !== '') {
            queryParams.push(`%${title.trim()}%`);
            query += ` AND title ILIKE $${queryParams.length}`;
        }
        if (author && author.trim() !== '') {
            queryParams.push(`%${author.trim()}%`);
            query += ` AND author ILIKE $${queryParams.length}`;
        }
        if (genre && genre.trim() !== '') {
            queryParams.push(`%${genre.trim()}%`);
            query += ` AND genre ILIKE $${queryParams.length}`;
        }
        if (publicationDate && publicationDate.trim() !== '') {
            queryParams.push(publicationDate);  // Exact match for dates
            query += ` AND publication_date = $${queryParams.length}`;
        }

        const result = await pool.query(query, queryParams);

        res.json(result.rows)
    } catch (error) {
        res.status(400).json({ error: error.message });
        console.log(error.message);
    }
})

module.exports = { allBooks, createBook, getBookById, updateBooK, deleteBooK, filterBooKs }