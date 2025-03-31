const bcrypt = require('bcrypt');
const { User , Quiz ,QuizResult} = require('../model/user.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signupUserService = async ({username, email, password}) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = { username, email, password: hashedPassword};
    
    
  
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    
    return savedUser;
  };

exports.loginUserService = async ({ email, password }) => {
    const existingUser = await User.findOne({ email });
    
    if (!existingUser) {
      throw new Error('Email Does Not Exist');
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid Credentials');
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET , { expiresIn: '1h' });
    return { result: existingUser, token };
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