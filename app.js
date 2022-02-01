// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();
const path = require('path');

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'Drop, Shop, & Chop';

app.locals.title = `${projectName} - 
find & save delicious recipes`;

app.locals.key = process.env.API_KEY;

app.use((req, res, next) => {
    app.locals.currentUser = req.session.user ? req.session.user : false;
    next();
});

const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const recipesRoutes = require('./routes/recipes');
app.use('/recipes', recipesRoutes);

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
// require('./error-handling')(app);

module.exports = app;