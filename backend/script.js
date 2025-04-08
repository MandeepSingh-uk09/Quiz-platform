const express = require('express');
const connectDB = require('./config/db.config');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const userRouter = require('./routes/user.route');
const multer = require('multer');

const app = express();

//mongodbconnection

connectDB();

//middleware
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use('/api/auth', userRouter);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' );
});
