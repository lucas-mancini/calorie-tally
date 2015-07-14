
// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var config = require('./config');
var routes = require('./routes');

// configuration
var port = process.env.PORT || 8080; // port where the app will be running
var databaseUri = process.env.MONGO_DATABASE || config.database;
mongoose.connect(databaseUri); // connect to Mongo DB
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
    console.log('MongoDB - Connection opened successfully to ' + databaseUri);
});
app.set('superSecret', config.secret); // secret variable

// set up body-parser to get info from requests and parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// allow CORS
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

// apply routes to the app using the api prefix
app.use('/api', routes);

// start listening
app.listen(port);
console.log('App running at http://localhost:' + port);
