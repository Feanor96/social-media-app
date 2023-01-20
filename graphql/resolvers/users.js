const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput } = require('../../utils/validators');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

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
            //HASH PASSWORD
            //AUTH TOKEN
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                confirmPassword,
                createdAt: new Date()
            })
            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username,
            }, SECRET_KEY, { expiresIn: "1h" })

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}