const { signupUserService,loginUserService,quizService,quizScoreService} = require("../services/user.services");

exports.signupUserDao = async (userData) => {
    try {
      return await signupUserService(userData);
    } catch (error) {
      console.error("Signup DAO Error:", error.message);
      throw new Error(error.message);
    }
  };

exports.loginUserDao = async (userData) => {
    try {
      return await loginUserService(userData);
    } catch (error) {
      console.error("Login DAO Error:", error.message);
      throw new Error(error.message);
    }
};

exports.quizDao = async (userData) => {
    try {
      console.log("dao",userData);
      return await quizService(userData);
    } catch (error) {
      console.error("Quiz DAO Error:", error.message);
      throw new Error(error.message);
    }
}

exports.quizScoreDao = async (userData) => {
  try {
    console.log("dao",userData);
    return await quizScoreService(userData);
  } catch (error) {
    console.error("Quiz DAO Error:", error.message);
    throw new Error(error.message);
  }
}