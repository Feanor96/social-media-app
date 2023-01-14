const { model, Schema } = require('mongoose');

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    created_at: Date,

});

module.exports = model('User', UserSchema);