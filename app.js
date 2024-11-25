const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config()


//user routes 
const userRoutes = require("./routes/userRoutes")
const eventRoutes = require("./routes/eventRoutes")
app = express()




// Serve static files from React app
app.use(express.static(path.join(__dirname, '/client/dist')));


// Catch-all route to send React app for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/dist', 'index.html'));
});


// CORS configuration
// const corsOptions = {
//     origin: 'http://localhost:11000', // React app URL
//     methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//     credentials: true // Allow credentials (cookies)
// };


const corsOptions = {
  origin: 'https://srmszest.in', // Your production domain
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow credentials (cookies)
};



const logStream = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), { flags: 'a' });
//logging middleware
app.use(morgan('combined', { stream: logStream }));


// Create a rate limiter instance
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 15 minutes in milliseconds
  max: 500,  // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,  // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,   // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(cors(corsOptions));

// Middleware to parse cookies
app.use(cookieParser());





//database connevtion 
//mongoose.connect(process.env.MONGODB_URI)


const connectDB = async () => {
  try {
    // Fetch the Mongo URI from the .env file
    const dbURI = process.env.MONGODB_URI;

    // Connect to MongoDB using Mongoose
    await mongoose.connect(dbURI, {
      maxPoolSize: 90, // Set to 90 connections
      minPoolSize: 5,
      socketTimeoutMS: 60000, 
    });

    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};



connectDB();


//port 
const PORT = 11000
//middleware

app.get("/", (req, res) => {
  res.send("Node Server")
})



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//routes
app.use('/users', userRoutes);
app.use('/events', eventRoutes);







app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
})