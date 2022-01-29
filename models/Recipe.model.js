const { Schema, model } = require('mongoose');

const recipeSchema = new Schema(
    {
        // id from API
        id: Number,
        title: String,
        readyInMinutes: Number,
        servings: Number,
        sourceUrl: String,
        image: String,
        // array of objects, which list the ingredients and their amounts
        ingredients: [Schema.Types.Mixed],
        instructions: String,
    },
    {
        // adds createdAt and updatedAt
        timestamps: true,
    }
);

const Recipe = model('Recipe', recipeSchema);

module.exports = Recipe;