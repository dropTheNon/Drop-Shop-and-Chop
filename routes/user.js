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
    res.render('user/profile', { user: req.session.user });
});

module.exports = router;