// ==========   Requirements & Declarations   ==========
const router = require("express").Router();
const axios = require('axios').default;

const mongoose = require("mongoose");

// Require the User & Meal models in order to interact with the database
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// ==========             Routes             ==========

router.get('/profile/:userId', isLoggedIn, (req, res, next) => {
    User.findById(req.params.userId)
    .populate("recipes")
    .then((results) => {
        res.render('user/profile', { user: results });
    })
    .catch((error) => {
        console.error(error);
    });
});

router.get('/recipes/info/:recipeId', isLoggedIn, (req, res, next) => {
    Recipe.findById(req.params.recipeId)
    .then((recipe) => {
        res.render('user/recipe', recipe);
    })
    .catch((error) => {
        console.error(error);
    });
});

router.get('/create-recipe', isLoggedIn, (req, res, next) => {
    res.render('user/create-recipe');
});

router.post('/create-recipe', isLoggedIn, (req, res, next) => {
    let ingredients = [];
    req.body.ingredientName.forEach((element, index) => {
        ingredients.push({
            name: req.body.ingredientName[index],
            amount: req.body.ingredientAmount[index],
            unit: req.body.ingredientUnit[index]
        })
    });
    req.body.ingredients = ingredients;

    Recipe.create(req.body)
        .then((createdRecipe) => {
            User.findByIdAndUpdate( 
                req.session.user._id,
                {
                    $push: { recipes: createdRecipe._id },
                },
                { new: true }
            )
            .then((updatedUser) => {
                req.session.user = updatedUser;
                res.redirect(`/user/profile/${updatedUser._id}`);
            })
            .catch((error) => {
                console.error(error);
            })
        })
        .catch((error) => {
            console.error(error);
        })
});

router.get('/edit-recipe/:recipeId', isLoggedIn, (req, res, next) => {
    Recipe.findById(req.params.recipeId)
        .then((result) => {
            console.log("found recipe: ", result);
            res.render('user/edit-recipe', { recipe: result });
        })
        .catch((error) => {
            console.error(error);
        });
});

router.post('/edit-recipe/:recipeId', isLoggedIn, (req, res, next) => {
    Recipe.findByIdAndUpdate(req.params.recipeId, {
        ...req.body,
        },
        { new: true },
    )
        .then((updatedRecipe) => {
            console.log(updatedRecipe);
            res.redirect(`/user/profile/${req.session.user._id}`);
        })
        .catch((error) => {
            console.error(error);
        });
});

router.get('/delete-recipe/:recipeId', isLoggedIn, (req, res, next) => {
    User.findByIdAndUpdate(
            req.session.user._id,
            {
               $pull: { recipes: req.params.recipeId } 
            },
            { new: true}
        )
        .then((updatedUser) => {
            Recipe.findByIdAndDelete(req.params.recipeId)
                .then(() => {
                    res.redirect(`/user/profile/${req.session.user._id}`);
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