var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var User = require('./app/models/user');
var Meal = require('./app/models/meal');
var mealFilters = require('./app/helpers/mealFilters');
var secretKeyName = 'superSecret';

var unauthorizedResponse = function(res) {
    return res.status(403).
        json({success: false, message: 'You are not authorized to access this resource.'});
};

/**
  * Define API routes on this file
  */
module.exports = (function() {
    'use strict';
    var apiRoutes = require('express').Router();

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRoutes.post('/authenticate', function(req, res) {
        // find User, using its name
        User.findOne({ name: req.body.name }, '+password', function(err, user) {
            if (err) throw err;

            if (!user) {
                res.status(401).json({ success: false, message: 'Authentication failed, user was not found.'});
            }
            else if (user) { // user was found
                user.comparePassword(req.body.password, function(err, match) {
                    if (err) throw err;

                    if (!match) {
                        res.status(401).json({ success: false, message: 'Authentication failed, invalid password.'});
                    }
                    else if (match) {
                        // user and pass OK, create JSON Web Token
                        var token = jwt.sign({username: user.name, admin: user.admin}, req.app.get(secretKeyName), {
                            expiresInMinutes: 1440 // valid for 24 hs
                        });

                        // return the information and the token to the user
                        res.json({
                            success: true,
                            message: 'Token successfully generated!',
                            token: token
                        });
                    }
                });
            }
        });
    });

    // route to create a new User (POST http://localhost:8080/api/users)
    apiRoutes.post('/users', function(req, res) {
        var user = new User({
            name: req.body.name,
            password: req.body.password,
            expectedCaloriesPerDay: req.body.expectedCalories
        });
        if (typeof req.body.admin !== 'undefined') {
            user.admin = req.body.admin;
        }
        user.save(function(err) {
            if (err) {
                return res.status(404).json({ success: false, message: 'User could not be created.' });
            }
            return res.status(201).json(user);
        });
    });

    // route middleware to verify a token
    // NOTE: all routes defined below will be protected by authentication
    apiRoutes.use(function(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            // verifies secret passphrase and check app
            jwt.verify(token, req.app.get(secretKeyName), function(err, decoded) {
                if (err) {
                    var msg = err.message || 'Failed to authenticate token.';
                    return res.status(401).json({ success: false, message: msg });
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else { // no token, provide error message
            return res.status(401).send({ // 401 = authentication required
                success: false,
                message: 'No token provided. Authentication is required.'
            });
        }
    });

    // route to show a welcome message: (GET http://localhost:8080/api/)
    apiRoutes.get('/', function(req, res) {
        res.json({ message: 'Welcome to CalorieTally REST API' });
    });

    // route to return a single user, by name (GET http://localhost:8080/api/users/:user_name)
    apiRoutes.get('/users/:user_name', function(req, res) {
        // if not admin, check that the parameter passed on the url matches the token's username
        if (!req.decoded.admin && req.params.user_name !== req.decoded.username)
            return unauthorizedResponse(res);

        User.findOne({ name: req.params.user_name }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.status(404).json({ success: false, message: 'User was not found.'});
            }
            else {
                res.json(user);
            }
        });
    });

    // route to update the user's properties, by name (PUT http://localhost:8080/api/users/:user_name)
    apiRoutes.put('/users/:user_name', function(req, res) {
        // if not admin, check that the parameter passed on the url matches the token's username
        if (!req.decoded.admin && req.params.user_name !== req.decoded.username)
            return unauthorizedResponse(res);

        User.findOneAndUpdate({ name: req.params.user_name }, req.body, {new: true}, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.status(404).json({ success: false, message: 'User was not found or could not be updated.' });
            }
            else {
                res.json(user);
            }
        });
    });

    // route to create a new Meal (POST http://localhost:8080/api/meals)
    apiRoutes.post('/meals', function(req, res) {
        // if not admin, check that the parameter passed on the body as creator matches the token's username
        if (!req.decoded.admin && req.body.creator !== req.decoded.username)
            return unauthorizedResponse(res);

        User.findOne({ name: req.body.creator }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.status(404).json({ success: false, message: 'User was not found.'});
            }
            else {
                var meal = new Meal({
                    creator: user._id,
                    description: req.body.description,
                    numberOfCalories: req.body.numberOfCalories,
                    dateTime: req.body.dateTime
                });
                meal.save(function(err) {
                    if (err) {
                        return res.status(404).json({ success: false, message: 'Meal could not be created.' });
                    }
                    return res.status(201).json(meal);
                });
            }
        });
    });

    // route to update the meal's properties, by id (PUT http://localhost:8080/api/meals/:meal_id)
    apiRoutes.put('/meals/:meal_id', function(req, res) {
        try {
            var mealId = mongoose.Types.ObjectId(req.params.meal_id);
            Meal.findOneAndUpdate({ _id: mealId }, req.body, {new: true}, function(err, meal) {
                if (err) throw err;

                if (!meal) {
                    res.status(404).json({ success: false, message: 'Meal was not found or could not be updated.' });
                }
                else {
                    res.json(meal);
                }
            });
        }
        catch (err) {
            res.status(404).json({ success: false, message: 'Meal was not found or could not be updated.'});
        }
    });

    // route to remove a meal, by name (DELETE http://localhost:8080/api/meals/:meal_id)
    apiRoutes.delete('/meals/:meal_id', function(req, res) {
        try {
            var mealId = mongoose.Types.ObjectId(req.params.meal_id);
            Meal.findOneAndRemove({ _id: mealId }, function(err, meal) {
                if (err) throw err;
                if (!meal) {
                    res.status(404).json({ success: false, message: 'Meal was not found or could not be deleted.'});
                }
                else {
                    res.json({ success: true, message: 'Meal ' + mealId + ' was deleted successfully.'});
                }
            });
        }
        catch (err) {
            res.status(404).json({ success: false, message: 'Meal was not found or could not be deleted.'});
        }
    });

    // route to return a filtered list of meals (GET http://localhost:8080/api/meals/filter)
    apiRoutes.get('/meals/filter', function(req, res) {
        var userName = req.query.username;
        if (typeof userName === 'undefined') {
            return res.status(400).json({ success: false, message: 'Bad request. You should add a username on the url parameters.' });
        }
        else {
            // if not admin, check that the parameter passed on the url as username matches the token's username
            if (!req.decoded.admin && userName !== req.decoded.username)
                return unauthorizedResponse(res);

            Meal.find({}).populate('creator').exec(function(err, meals) {
                if (err) {
                    return res.status(500).json({ success: false, message: 'The meals list could not be retrieved.' });
                }
                else {
                    // filter the meals by creator
                    meals = meals.filter(function(meal) {
                        if (meal.creator.name === null) return false;
                        return meal.creator.name === userName;
                    });

                    // filter by dates (format: dd-mm-yyyy)
                    var dateFrom = req.query.dateFrom || undefined;
                    var dateTo = req.query.dateTo || undefined;
                    if (typeof dateFrom !== 'undefined' && typeof dateTo !== 'undefined') {
                        meals = mealFilters.filterByDate(meals, dateFrom, dateTo);
                    }

                    // filter by time (format: HH:MM)
                    var timeFrom = req.query.timeFrom || undefined;
                    var timeTo = req.query.timeTo || undefined;
                    if (typeof timeFrom !== 'undefined' && typeof timeTo !== 'undefined') {
                        meals = mealFilters.filterByTime(meals, timeFrom, timeTo);
                    }
                    res.json(meals);
                }
            });
        }
    });

    // route middleware to verify admin access
    // NOTE: all routes defined below will be protected by authorization, only admin users
    // are allowed
    apiRoutes.use(function(req, res, next) {
        var token = req.decoded,
            admin = token.admin;

        if (admin) {
            next();
        }
        else { // if not admin, the user cannot pass here
            return res.status(403).json({success: false, message: 'You are not authorized to access this resource.'});
        }
    });

    // route to return all users (GET http://localhost:8080/api/users)
    apiRoutes.get('/users', function(req, res) {
        User.find({}, function(err, users) {
            if (err) {
                return res.status(500).json({ success: false, message: 'The users list could not be retrieved.' });
            }
            else {
                res.json(users);
            }
        });
    });

    // route to remove a user, by name (DELETE http://localhost:8080/api/users/:user_name)
    apiRoutes.delete('/users/:user_name', function(req, res) {
        User.findOneAndRemove({ name: req.params.user_name }, function(err, user) {
            if (err) throw err;
            if (!user) {
                res.status(404).json({ success: false, message: 'User was not found or could not be deleted.'});
            }
            else {
                res.json({ success: true, message: 'User ' + user.name + ' was deleted successfully.'});
            }
        });
    });

    // route to return all meals (GET http://localhost:8080/api/meals)
    apiRoutes.get('/meals', function(req, res) {
        Meal.find({}).populate('creator').exec(function(err, meals) {
            if (err) {
                return res.status(500).json({ success: false, message: 'The meals list could not be retrieved.' });
            }
            else {
                res.json(meals);
            }
        });
    });

    return apiRoutes;
})();
