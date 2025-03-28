const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    quizType: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

/* const User = mongoose.model('User', UserSchema);
const Quiz = mongoose.model('Quizes', QuizSchema);
module.exports = User;
module.exports = Quiz; */

const User = mongoose.model('User', UserSchema , "users");
const Quiz = mongoose.model('Quiz', QuizSchema ,"quizes");

module.exports = { User, Quiz };