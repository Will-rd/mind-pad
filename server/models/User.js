const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: 5,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (value) => {
                const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email address'
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
    },
    days: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Day',
        }
    ],
});

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();

});

userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;