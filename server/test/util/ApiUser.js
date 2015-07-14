var request = require('supertest');

// Utility class to create and authenticate a user

var ApiUser = function(url, name, password, expectedCalories, admin) {
    this.name = name;
    this.password = password;
    this.expectedCalories = expectedCalories;
    this.url = url;
    this.admin = admin || false;

    this.id = '';
    this.token = '';
};

/** Create a new user
  * @param {Function} done Callback to run when done */
ApiUser.prototype.create = function(done) {
    var user = this;

    var userData = {
        name: this.name,
        password: this.password,
        expectedCalories: this.expectedCalories,
        admin: this.admin
    };

    request(user.url).post('/users').send(userData).end(function(errCreate, resCreate) {
        if (errCreate) throw errCreate;
        user.id = resCreate.body._id;
        done();
    });
};

/** Create a new user and trigger authentication to get token
  * @param {Function} done Callback to run when done */
ApiUser.prototype.createAndAuthenticate = function(done) {
    var user = this;

    var userData = {
        name: this.name,
        password: this.password,
        expectedCalories: this.expectedCalories,
        admin: this.admin
    };
    var authData = {
        name: this.name,
        password: this.password
    };

    request(user.url).post('/users').send(userData).end(function(errCreate, resCreate) {
        if (errCreate) throw errCreate;
        user.id = resCreate.body._id;
        request(user.url).post('/authenticate').send(authData).end(function(errAuth, resAuth) {
            if (errAuth) throw errAuth;
            user.token = resAuth.body.token;
            done();
        });
    });
};

/** Export the ApiUser class, utility class to be used on testcases */
module.exports = ApiUser;
