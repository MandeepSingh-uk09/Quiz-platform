const express = require('express');
const connectDB = require('./config/db.config');
const cors = require('cors');
require('dotenv').config();


const userRouter = require('./routes/user.route');

const app = express();

//mongodbconnection

connectDB();

//middleware
app.use(cors()); 
app.use(express.json());

//routes
app.use('/api/auth', userRouter);

app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' );
});
