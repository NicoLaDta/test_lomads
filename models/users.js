const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        required: false 
    },
    age: {
        type: Number,
        required: true
    },
    nickname: {
        type: String,
        maxlength: 40,
        validate:/[^\s]+/,
        required: true
    },
    createdEvents: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);