const express = require('express');
const userRouter = express.Router();

// Controller Location
const { registerController , verifyToken , loginController } = require('../controllers/userController');


// This endpoint is for signup
userRouter.post('/signup', registerController);

// This endpoint is for verify the email address
userRouter.get('/verify/:token/:id', verifyToken);

// This endpoint is for login 
userRouter.post('/login', loginController);



module.exports = { userRouter }