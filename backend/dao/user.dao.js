const { signupUserService,loginUserService,quizService,quizScoreService ,assignQuizService, assignQuizToUserService} = require("../services/user.services");

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

exports.assignQuizDao = async (id) =>{
  try{
    console.log(" assign quiz dao",id);
    return await assignQuizService(id);
  } catch (error) {
    console.error("Quiz DAO Error:", error.message);
    throw new Error(error.message);
  }
}

exports.assignQuizToUserDao = async (data) =>{
  try{
    console.log(" assign quiz to user dao",data);
    return await assignQuizToUserService(data);
  } catch (error) {
    console.error("Quiz DAO Error:", error.message);
    throw new Error(error.message);
  }
}