const express = require('express');
const cors = require('cors');

const app = express();
const bookRoutes = require('./routes/bookRoutes');
const PORT = 9090;

// middleware

let corsOptions = {
    origin: 'trustedwebsite.com' // Compliant
};

app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(express.json()); // req.body

// Routes
app.use('/api', bookRoutes)

app.get('/', (req, res) => {
    res.send('API is running');
})

const server = app.listen(PORT, console.log(`Server started on http://localhost:${PORT}`));
