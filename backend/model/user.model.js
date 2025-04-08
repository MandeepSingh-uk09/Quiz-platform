const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: false,
        validate: {
            validator: function (options) {
                if (this.parent().quizType === "Poll Quiz") {
                    // Ensure each option is an object with text and votes
                    return options.every(opt => typeof opt === "object" && opt.text && typeof opt.votes === "number");
                } else {
                    // Ensure each option is a simple string
                    return options.every(opt => typeof opt === "string");
                }
            },
            message: props => `Invalid options format for quiz type: ${props.value}`
        }
    },
    correctAnswer: { 
        type: String,
        required: function () { 
            return ["MCQ", "True/False"].includes(this.parent().quizType); // Only required for MCQ & True/False
        } 
    }
});


const QuizSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    assigned:{
        type: Boolean,
        default: false,
        required: false
    },
    quizDescription: {
        type: String,
        required: true
    },
    quizType: {
        type: String,
        required: true
    },
    accessCount: {
        type: Number,
        require: false
    },
    questions: {
        type: [QuestionSchema],
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
    },
    photo:{
        type: String,
        required: false
    }
})

const QuizResultSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    id: { type: String, required: true }, // If this refers to a quiz ID, consider using ObjectId.
    quizType: { type: String, required: true },
    score: { type: Number,required: function () { 
        return ["MCQ", "True/False"].includes(this.parent().quizType); // Only required for MCQ & True/False
    } },
    responses: {
        type: [{ question: String, response: String }],
        required: function() { return this.quizType === 'Open-Ended'; }
    }
}, { timestamps: true });

const AssignQuizSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    assignedQuiz:{
        type: Array,
        required: false
    }
})

/* const User = mongoose.model('User', UserSchema);
const Quiz = mongoose.model('Quizes', QuizSchema);
module.exports = User;
module.exports = Quiz; */

const User = mongoose.model('User', UserSchema , "users");
const Quiz = mongoose.model('Quiz', QuizSchema ,"quizes");
const QuizResult = mongoose.model('QuizResult', QuizResultSchema, "scores");
const AssignedQuiz = mongoose.model('AssignedQuiz', AssignQuizSchema ,"assignedQuizes");
module.exports = { User, Quiz ,QuizResult , AssignedQuiz};