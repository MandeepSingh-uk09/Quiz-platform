const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['MCQ', 'True/False', 'Fill in the Blanks', 'Short Answer'], // Define allowed types
    },
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String], // Only applicable for MCQs
        required: function() { return this.type === 'MCQ'; } // Required only for MCQ type
    },
    correctAnswer: {
        type: String,
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
    quiz: [QuizSchema]
})

const User = mongoose.model('User', UserSchema);
module.exports = User;