const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: String,
        password: String,
        recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    },
    {
        // adds createdAt and updatedAt
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;