const bcrypt = require('bcrypt');
const { User , Quiz ,QuizResult , AssignedQuiz} = require('../model/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signupUserService = async ({username, email, password} , photo) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = { username, email, password: hashedPassword};

    if(photo){
      userData.photo=photo;
    }
    
    console.log("user data",userData);
    
  
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    
    return savedUser;
  };

exports.loginUserService = async ({ email, password }) => {
    const existingUser = await User.findOne({ email });
    console.log("user .. ",existingUser);
    
    if (!existingUser) {
      throw new Error('email');
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      throw new Error('password');
    }

    
    const newExistingUser = existingUser.toObject();
    delete newExistingUser.password;
    
    console.log(" user 2",newExistingUser);

    const token = jwt.sign({ email: newExistingUser.email, id: newExistingUser._id }, process.env.JWT_SECRET , { expiresIn: '1h' });
    return { result: newExistingUser, token };
}

exports.quizService = async (MCQ) => {    
    const newQuiz = new Quiz(MCQ);
    const savedQuiz = await newQuiz.save();    
    return savedQuiz;
}

exports.quizScoreService=async (result)=>{

  console.log("here");
  const score = new QuizResult(result);
  const savedScore = await score.save();
    
  return savedScore;
}

exports.assignQuizService=async (id)=>{

  console.log("here in asign quiz");
  const score = new AssignedQuiz({userId:id, assignedQuiz:[]});
  const savedScore = await score.save();
    
  return savedScore;
}

exports.assignQuizToUserService=async (data)=>{
  try {
    console.log("In assign quiz service");
  
    const entries = Object.entries(data); // [ [userId, quizId], ... ]

    console.log("Enteries", entries);
  
    for (const [userId, quizId] of entries) {
      console.log("userid",userId);
      console.log("quizid",quizId);
      let userQuiz = await AssignedQuiz.findOne({ userId });
  
      if (!userQuiz) {
        userQuiz = new AssignedQuiz({
          userId,
          assignedQuiz: [quizId],
        });
      } else {
        if (!userQuiz.assignedQuiz.includes(quizId)) {
          userQuiz.assignedQuiz.push(quizId);
        }
      }
  
      await userQuiz.save();
    }
  
    return { message: "Quiz assigned successfully" };
  
  } catch (err) {
    console.error("Error in assignQuizToUserService:", err);
    throw err;
  }
  
}