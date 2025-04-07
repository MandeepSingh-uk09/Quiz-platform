const express = require('express');
const { signupUserDao, 
  loginUserDao, 
  quizDao , 
  quizScoreDao , 
  assignQuizDao, 
  assignQuizToUserDao, 
} = require('../dao/user.dao');
const authMiddleware  = require('../middleware/user.auth');
const router = express.Router();
const { Quiz , QuizResult , User , AssignedQuiz } = require('../model/user.model');

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

router.post('/quiz/mcq', authMiddleware, async (req, res) => {
  try {
      const MCQ = req.body;
      console.log("req", MCQ);
      
      const savedQuiz = await quizDao(MCQ);
      
      res.status(200).json({ message: "Quiz Created", id: savedQuiz._id });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});


router.post('/quiz/truefalse', authMiddleware ,async (req, res)=>{
    try {
        const trueFalseQuiz = req.body;
        console.log("req", trueFalseQuiz);
        const savedQuiz = await quizDao(trueFalseQuiz);
        res.status(200).json({ message: "Quiz Created", id: savedQuiz._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/quiz/poll', authMiddleware ,async (req, res)=>{
    try {
        const pollQuiz = req.body;
        console.log("req", pollQuiz);
        const savedQuiz = await quizDao(pollQuiz);
        res.status(200).json({ message: "Quiz Created", id: savedQuiz._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/quiz/openended', authMiddleware ,async (req, res)=>{
    try {
        const openEndQuiz = req.body;
        console.log("req", openEndQuiz);
        const savedQuiz = await quizDao(openEndQuiz);
        res.status(200).json({ message: "Quiz Created", id: savedQuiz._id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/* router.get("/quizzes", async (req, res) => {
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
}); */

router.get("/quizzes", async (req, res) => {
    console.log("Request received:", req.query);

    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // Aggregate quizzes by quizType for the given email
        const quizData = await Quiz.aggregate([
            { $match: { email: email } }, // Filter by email
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

        console.log("Aggregated Quiz Data:", quizData);

        const desiredOrder = ["MCQ", "True/False", "Poll Quiz", "Open-Ended"];
        const sortedQuizData = desiredOrder.map(type => 
            quizData.find(quiz => quiz.quizType === type) || { quizType: type, count: 0 }
        );

        console.log("Sorted Quiz Data:", sortedQuizData);
        res.json(sortedQuizData);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/quizzes/by-type", async (req, res) => {
    try {
        const { type ,email } = req.query;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!type) {
            return res.status(400).json({ error: "Quiz type is required" });
        }
        const quizzes = await Quiz.find({ email:email , quizType: type });  
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

router.get("/quiz/:id", async (req, res) => {
    try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });
      res.json(quiz);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  router.post('/submit-quiz-score', async (req, res) => {
    try {
        console.log(req.body);
        const status = await quizScoreDao(req.body);
        res.status(201).json({ message: 'Quiz data submitted successfully', data: status });
    } catch (error) {
        res.status(500).json({ error: 'Error saving quiz data' });
    }
});


router.get('/open-quizzes', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Fetch quizzes where the email does NOT match the provided one
        const quizzes = await Quiz.find({ email: { $ne: email },assigned: { $ne: true } });

        res.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/assigned-quizzes', async (req, res) => {
  try {
      const { email } = req.query;

      if (!email) {
          return res.status(400).json({ message: 'Email is required' });
      }

      // Fetch quizzes where the email does NOT match the provided one
      const quizzes = await Quiz.find({ email: { $ne: email },assigned: true });

      res.json(quizzes);
  } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/user-quizzes/:email", async (req, res) => {
    try {
      const { email } = req.params;
  
      const userQuizzes = await Quiz.find({ email });
  
      const quizData = {
        "MCQ": [],
        "True/False": [],
        "Poll Quiz": [],
        "Open-Ended": []
      };
  
      userQuizzes.forEach(quiz => {
        if (quizData[quiz.quizType]) {
          quizData[quiz.quizType].push({
            quizId: quiz._id,
            description: quiz.quizDescription,
            totalQuestions: quiz.questions.length
          });
        }
      });
  
      res.json(quizData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user quizzes" });
    }
  });
  

  router.get("/leaderboard/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
        console.log(quizId);
      const leaderboardData = await QuizResult.find({ id: quizId });
        console.log(leaderboardData);
      if (!leaderboardData || leaderboardData.length === 0) {
        return res.status(404).json({ message: "No leaderboard data found for this quiz." });
      }
  
      const leaderboard = leaderboardData.map(entry => ({
        username: entry.username,
        email: entry.email,
        score: entry.score
      }));
  
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard data" });
    }
  });

  router.get("/open-ended/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const responses = await QuizResult.find({ id });
  
      if (!responses.length) {
        return res.status(404).json({ message: "No responses found for this quiz." });
      }
  
      res.status(200).json(responses);
    } catch (error) {
      console.error("Error fetching Open-Ended responses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

// Route to increment access count
router.post("/update-access/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            id,
            { $inc: { accessCount: 1 } },
            { new: true }
        );

        if (!updatedQuiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.status(200).json({ message: "Access count updated successfully", accessCount: updatedQuiz.accessCount });
    } catch (error) {
        console.error("Error updating access count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to update poll option votes
// Route to update poll option votes
router.post("/update-option/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { questionIndex, optionIndex } = req.body;

        console.log("Quiz ID:", id);
        console.log("Question Index:", questionIndex);
        console.log("Option Index:", optionIndex);

        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if (quiz.quizType !== "Poll Quiz") {
            return res.status(400).json({ message: "Invalid quiz type for updating options" });
        }

        const question = quiz.questions[questionIndex];
        if (!question) {
            return res.status(400).json({ message: "Invalid question index" });
        }

        const option = question.options[optionIndex];
        if (!option) {
            return res.status(400).json({ message: "Invalid option index" });
        }

        if (typeof option.votes !== "number") {
            return res.status(400).json({ message: "Option votes field is missing or not a number" });
        }

        // Increment vote count for the selected option
        option.votes += 1;

        // ✅ Mark the specific option as modified
        quiz.markModified(`questions.${questionIndex}.options.${optionIndex}`);

        await quiz.save(); // ✅ Now it should update properly

        res.status(200).json({ message: "Option count updated successfully", updatedQuestion: question });
    } catch (error) {
        console.error("Error updating option count:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/submit-open-ended-score', async (req, res) => {
    try {
        const { username, email, id, quizType, responses } = req.body;
        console.log(req.body);
        const quizResult = new QuizResult({
            username,
            email,
            id,
            quizType,
            responses
        });

        await quizResult.save();
        res.status(200).json({ message: "Open-Ended responses saved successfully", quizResult });
    } catch (error) {
        res.status(500).json({ message: "Error saving Open-Ended responses", error });
    }
});

router.get("/poll-leaderboard/:quizId", async (req, res) => {
    try {
      const { quizId } = req.params;
      console.log(quizId);
      // Find the poll quiz result
      const pollResult = await Quiz.findOne({ _id:quizId, quizType: "Poll Quiz" });
      console.log(pollResult);
      if (!pollResult) {
        return res.status(404).json({ message: "No poll data found" });
      }
  
      // Respond with poll quiz details
      res.json({
        quizDescription: pollResult.quizDescription,
        accessCount: pollResult.accessCount,
        questions: pollResult.questions, // Contains question text, options, and votes
      });
    } catch (error) {
      console.error("Error fetching poll quiz data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.get("/get-users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const users = await User.find({ _id: { $ne: id } }).select("_id username email");

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
  });

  router.post("/set-assign-quiz/:id", async (req, res)=>{
    try{
       const {id} =req.params;
       const savedata = assignQuizDao(id);
       res.status(200).json("Quiz assigned successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
  }) 

  
  router.post("/set-assign-quiz-to-user", async (req, res)=>{
    try{
       const data = req.body;
       const saveData = await assignQuizToUserDao(data);
       res.status(200).json("Quiz assigned successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
  }) 


  router.get('/get-assigned-quizzes/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const assigned = await AssignedQuiz.findOne({ userId: userID });

        if (!assigned) {
            return res.status(404).json({ message: "No quizzes assigned to this user." });
        }

        res.status(200).json({ assignedQuiz: assigned.assignedQuiz });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// PUT route to update quiz as assigned
router.put("/update-quiz-to-assigned/:quizID", async (req, res) => {
  const { quizID } = req.params;
 
  console.log(" quiz to update", quizID);
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      quizID,
      { assigned: true },
      { new: true } // returns updated doc
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json({ message: "Quiz marked as assigned", quiz: updatedQuiz });
  } catch (error) {
    console.error("Error updating quiz:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
