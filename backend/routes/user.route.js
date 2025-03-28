const express = require('express');
const { signupUserDao, loginUserDao, quizDao } = require('../dao/user.dao');
const authMiddleware  = require('../middleware/user.auth');
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

router.post('/quiz/mcq', authMiddleware ,async (req, res) => {
    try {
        const MCQ = req.body;
        console.log("req",MCQ);
        const savedQuiz = await quizDao(MCQ);
        res.status(200).json("Quiz Created");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/quiz/truefalse', authMiddleware ,async (req, res)=>{
    try {
        const trueFalseQuiz = req.body;
        console.log("req", trueFalseQuiz);
        const savedQuiz = await quizDao(trueFalseQuiz);
        res.status(200).json("True/False Quiz Created");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/quiz/poll', authMiddleware ,async (req, res)=>{
    try {
        const trueFalseQuiz = req.body;
        console.log("req", trueFalseQuiz);
        const savedQuiz = await quizDao(trueFalseQuiz);
        res.status(200).json("Poll Quiz Created");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/quiz/openended', authMiddleware ,async (req, res)=>{
    try {
        const trueFalseQuiz = req.body;
        console.log("req", trueFalseQuiz);
        const savedQuiz = await quizDao(trueFalseQuiz);
        res.status(200).json("Open-ended Quiz Created");
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;