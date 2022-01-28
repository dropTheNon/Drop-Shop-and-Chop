const router = require("express").Router();
const axios = require('axios').default;

const mongoose = require("mongoose");

// Require the User & Meal models in order to interact with the database
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// Search for recipes based off keyword, ie. "burgers" or "chili"
router.get('/search', isLoggedIn, (req, res, next) => {
    res.render('recipes/search');
});

router.post('/search', isLoggedIn, (req, res, next) => {
    console.log('submitting search query for: ', req.body.query);
    // Setting parameters for API call
    let options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search',
        params: {
            query: req.body.query,
            number: 20
        },
        headers: {
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'x-rapidapi-key': `${process.env.API_KEY}`
        }
    };

    // Calling API
    axios.request(options)
        .then(function(response) {
            console.log(response.data);
        })
        .catch(function(err) {
            console.error(error);
        });
});



module.exports = router;