const request = require('supertest');
const express = require('express');
const bookRoutes = require('../routes/bookRoutes');
const bodyParser = require('body-parser');
const pool = require('../config/db');

// Mock pool.query
jest.mock('../config/db', () => {
    return {
        query: jest.fn(),
    };
});

const app = express();
const PORT = 9090;

// middleware

let corsOptions = {
    origin: 'trustedwebsite.com' // Compliant
};

app.use(require('cors')(corsOptions));
app.disable("x-powered-by");
app.use(express.json()); // req.body

// Routes
app.use('/api', bookRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

describe('Test Express Server', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should respond to GET / with a 200 status and a message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('API is running');
    });

    it('should respond to undefined routes with 404 status', async () => {
        const res = await request(app).get('/undefined_route');
        expect(res.statusCode).toEqual(404);
    });

    it('should create a book', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test Book' }] });

        const res = await request(app)
            .post('/api/book')
            .send({ title: 'Test Book', author: 'John Doe', genre: 'Fiction', publicationDate: '2021-01-01', isbn: '123456789' });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(pool.query).toHaveBeenCalledWith(
            "INSERT INTO inventory (title, author, genre, publication_date, isbn) VALUES($1, $2, $3, $4, $5) RETURNING *",
            ['Test Book', 'John Doe', 'Fiction', '2021-01-01', '123456789']
        );
    });

    it('should get all books', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test Book' }] });

        const res = await request(app)
            .get('/api/books');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([{ id: 1, title: 'Test Book' }]);
    });

    it('should get a book by ID', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Test Book' }] });

        const res = await request(app)
            .get('/api/book/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
    });

    it('should update a book', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .put('/api/book/1')
            .send({ title: 'Updated Book', author: 'John Doe', genre: 'Fiction', publicationDate: '2021-01-01', isbn: '123456789' });

        expect(res.statusCode).toEqual(204);
        expect(pool.query).toHaveBeenCalledWith(
            "UPDATE inventory SET title = $1, author = $2, genre = $3, publication_date = $4, isbn = $5 WHERE entry_id = $6",
            ['Updated Book', 'John Doe', 'Fiction', '2021-01-01', '123456789', '1']
        );
    });

    it('should delete a book', async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 1 });

        const res = await request(app)
            .delete('/api/book/1');

        expect(res.statusCode).toEqual(204);
    });

    it('should filter books', async () => {
        pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Filtered Book' }] });

        const res = await request(app)
            .post('/api/books/filter')
            .send({ title: 'Filtered Book' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([{ id: 1, title: 'Filtered Book' }]);
    });
});

