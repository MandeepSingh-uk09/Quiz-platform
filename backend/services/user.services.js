const bcrypt = require('bcrypt');
const User = require('../model/user.model');

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

    return true;
}

exports.quizService = async (MCQ) => {
    const newQuiz = new User(MCQ);
    const savedQuiz = await newQuiz.save();
    return savedQuiz;
}