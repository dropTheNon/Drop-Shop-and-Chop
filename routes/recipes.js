// ==========   Requirements & Declarations   ==========
const router = require("express").Router();
const axios = require('axios').default;
const {steakSearchResults, recipeInformation} = require('../data.js');

const mongoose = require("mongoose");

// Require the User & Meal models in order to interact with the database
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const currentRecipe = {};

// ==========             Routes              ==========

// Search for recipes based off keyword, ie. "burgers" or "chili"
router.get('/search', isLoggedIn, (req, res, next) => {
    res.render('recipes/search');
});

router.post('/search', isLoggedIn, (req, res, next) => {
    // console.log(steakSearchResults);
    // Setting parameters for API call
    let options = {
        method: 'GET',
        url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search',
        params: {
            query: req.body.query,
            number: 5
        },
        headers: {
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
            'x-rapidapi-key': `${process.env.API_KEY}`
        }
    };
    // let results = steakSearchResults.results;
    // res.render('recipes/results', {results});

    // Calling API
    axios.request(options)
        .then((response) => {
            res.render('recipes/results', { results: response.data.results });
        })
        .catch((error) => {
            console.error(error);
        });
});

router.get('/info/:recipeId', isLoggedIn, (req, res, next) => {
    let options = {
        method: 'GET',
        url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${req.params.recipeId}/information`,
        headers: {
          'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          'x-rapidapi-key': `${process.env.API_KEY}`
        }
      };

    axios.request(options)
        .then(function (response) {
            currentRecipe.title = response.data.title;
            currentRecipe.id = response.data.id;
            currentRecipe.image = response.data.image;
            currentRecipe.ingredients = response.data.extendedIngredients;
            currentRecipe.instructions = response.data.instructions;
            currentRecipe.readyInMinutes = response.data.readyInMinutes;
            currentRecipe.servings = response.data.servings;
            currentRecipe.sourceUrl = response.data.sourceUrl;
            
            res.render("recipes/info", {
                title: response.data.title,
                id: response.data.id,
                image: response.data.image,
                ingredients: response.data.extendedIngredients,
                instructions: response.data.instructions,
                readyInMinutes: response.data.readyInMinutes,
                servings: response.data.servings,
                sourceUrl: response.data.sourceUrl
            });
      })
      .catch(function (error) {
          console.error(error);
      });

    // currentRecipe.title = recipeInformation.title;
    // currentRecipe.id = recipeInformation.id;
    // currentRecipe.image = recipeInformation.image;
    // currentRecipe.ingredients = recipeInformation.extendedIngredients;
    // currentRecipe.instructions = recipeInformation.instructions;
    // currentRecipe.readyInMinutes = recipeInformation.readyInMinutes;
    // currentRecipe.servings = recipeInformation.servings;
    // currentRecipe.sourceUrl = recipeInformation.sourceUrl;


    // res.render("recipes/info", {
    //     title: recipeInformation.title,
    //     id: recipeInformation.id,
    //     image: recipeInformation.image,
    //     ingredients: recipeInformation.extendedIngredients,
    //     instructions: recipeInformation.instructions,
    //     readyInMinutes: recipeInformation.readyInMinutes,
    //     servings: recipeInformation.servings,
    //     sourceUrl: recipeInformation.sourceUrl
    // });
});

router.get('/save/:recipeId', isLoggedIn, (req, res, next) => {
    Recipe.create(currentRecipe)
        .then((createdRecipe) => {
            console.log("Recipe created!");
            User.findByIdAndUpdate(
                req.session.user._id,
                {
                    $push: { recipes: createdRecipe._id },
                },
                { new: true }
            )
            .then((updatedUser) => {
                req.session.user = updatedUser;
                // errr, where to redirect to?  route for this redirect??
                res.redirect(`../../user/profile/${req.session.user._id}`);
            })
            .catch((error) => {
                console.error(error);
            });
        })
        .catch((error) => {
            console.error(error);
        });
});


module.exports = router;