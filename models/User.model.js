const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: String,
        password: String,
    },
    {
        // adds createdAt and updatedAt
        timestamps: true,
    }
);

const User = model('User', userSchema);

module.exports = User;