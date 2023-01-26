const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
    }, SECRET_KEY, { expiresIn: "1h" })
}

module.exports = {
    Mutation: {
        async register(_, { registerInput: { username, email, password, confirmPassword } }) {
            //VALIDATE USER DATA
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            //MAKE SURE USER DOESNT ALREADY EXIST
            const user = User.findOne({ username });

            if (user) {
                throw new UserInputError('Username is taken', { 
                    errors: { username: 'This username is taken' }
                });
            }
            //HASH PASSWORD and AUTH TOKEN
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                confirmPassword,
                createdAt: new Date().toISOString()
            })
            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
        async login(_, { username, password }) {
            const { errors, valid } = validateLoginInput(username, password);
            const user = await User.findOne({ username });
            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong Credentials';
                throw new UserInputError('Wrong Credentials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        }
    }
}