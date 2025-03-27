const express = require('express');
const { signupUserDao, loginUserDao } = require('../dao/user.dao');
const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const userData = req.body;
        const savedUser = await signupUserDao(userData);
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const userData = req.body;
        const isUser = await loginUserDao(userData);
        res.status(200).json(isUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/quiz/MCQ', async (req, res) => {
    try {
        const MCQ = req.body;
        const savedQuiz = await quizDao(MCQ);
        res.status(200).json("Quiz Created");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;