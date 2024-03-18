const { AuthenticationError } = require('@apollo/server');
const { User, Day } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        viewUser: async (parent, { username }) => {
            return await User.findOne({ username }).populate('days');
        },
        viewUsers: async () => {
            return await User.find().populate('days');
        },
        viewDay: async (parent, { dayId }) => {
            return Day.findOne({ _id: dayId });
        },
        viewDays: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Day.find(params).sort({ createdAt: -1 });
        },
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('days');
            }
            throw new AuthenticationError("You need to be logged in!");
        },
    },

    Mutation: {
        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async(parent, {email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address.')
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);

            return { token, user };
        },
        
    }


};

module.exports = resolvers;