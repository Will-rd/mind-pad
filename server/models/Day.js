const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const daySchema = new Schema({
    dayText: {
        type: String,
        required: 'You need to post a description of your day.',
        minLength: 1,
        maxLength: 500,
    },
    dayAuthor: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => dateFormat(timestamp),
    },
    spectrum: {
        type: Number,
        required: true,
        max: 2,
        min: 0,
        default: 0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Day = model('Day', daySchema);

module.exports = Day;
