const express = require('express');
const { signupUserDao, loginUserDao, quizDao } = require('../dao/user.dao');
const authMiddleware  = require('../middleware/user.auth');
const router = express.Router();
const { Quiz} = require('../model/user.model');

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

router.get("/quizzes", async (req, res) => {
    console.log("request comes")
    try {
      // Aggregate quizzes by quizType and count them
      const quizData = await Quiz.aggregate([
        {
          $group: {
            _id: "$quizType",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            quizType: "$_id",
            count: 1,
          },
        },
      ]);
      console.log(quizData);
      const desiredOrder = ["MCQ", "True/False", "Poll Quiz", "Open-Ended"];
        const sortedQuizData = desiredOrder
            .map(type => quizData.find(quiz => quiz.quizType === type) || { quizType: type, count: 0 });
        console.log(sortedQuizData);
        res.json(sortedQuizData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/quizzes/by-type", async (req, res) => {
    try {
        const { type } = req.query;
        if (!type) {
            return res.status(400).json({ error: "Quiz type is required" });
        }
        const quizzes = await Quiz.find({ quizType: type });  
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/quizzes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);
        const deletedQuiz = await Quiz.findByIdAndDelete(id);

        if (!deletedQuiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        res.json({ message: "Quiz deleted successfully", quizId: id });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;