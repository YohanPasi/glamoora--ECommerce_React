const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('../server/routes/auth/auth-routes.js');
const router = require('../server/routes/admin/products-route.js')
require('dotenv').config();  // Load environment variables


// Connect to MongoDB using an environment variable for the password
mongoose.connect('mongodb+srv://yohanpasi80253327:Yohanpasi80253327@cluster0.i4akr.mongodb.net/')
  .then(() => console.log('MongoDB Connected'))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

// Modify CORS to allow both HTTP and HTTPS versions of localhost:5173
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://localhost:5173'], // Allow both
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma'
    ],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/admin/product', router)

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
