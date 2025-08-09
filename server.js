const express = require('express');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDb = require('./config/connectDb');

// config dotenv
dotenv.config();

// connect to DB
connectDb();

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.json());

const allowedOrigins = [
  'https://expense-tracking-record.onrender.com', // your frontend URL
  'http://localhost:3000'                         // for local dev if needed
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser tools like curl
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: This origin is not allowed'), false);
    }
  },
  credentials: true // if you send cookies/auth headers
}));


// routes
app.use('/api/v1/users', require('./routes/userRoute'));
app.use('/api/v1/transactions', require('./routes/transactionRoutes'));

// ======================
// Serve React frontend (Production)
// ======================
if (process.env.NODE_ENV === 'production') {
  const __dirname1 = path.resolve();
  app.use(express.static(path.join(__dirname1, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname1, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On PORT ${PORT}`.bgCyan.white);
});
