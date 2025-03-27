const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next){
    try {
        const token = req.headers.authorization.split(" ")[1];

        let decodedData;

        if (token) {
            decodedData = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedData);
        }
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        console.log(error);
    }
};

module.exports = authMiddleware;