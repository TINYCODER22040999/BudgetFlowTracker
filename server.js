const express = require('express');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDb = require('./config/connectDb');

// config dotenv
dotenv.config();
const allowedOrigins = [
  process.env.FRONTEND_URL,    // e.g. https://your-app.onrender.com (set on Render)
  'http://localhost:3000'
].filter(Boolean);

// database call
connectDb();

// rest object
const app = express();

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl) or localhost during dev
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true
}));



// routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transactions', require('./routes/transactionRoutes'));

// ======================
// Serve React frontend
// ======================
const __dirname1 = path.resolve(); // resolve current path
app.use(express.static(path.join(__dirname1, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname1, 'client', 'build', 'index.html'));
});

// port
const PORT = process.env.PORT || 5000;

// listen
app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`);
});


