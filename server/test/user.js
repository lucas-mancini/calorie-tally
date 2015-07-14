var assert = require('assert');
var request = require('supertest');

var url = 'http://localhost:8090/api';

var ApiUser = require('./util/ApiUser');
var authRequests = require('./util/authRequests');

describe('User', function() {

    describe('Creation', function() {

        var user = new ApiUser(url, 'Peter', 'password', 2000);

        before(function(done) {
            user.createAndAuthenticate(done);
        });

        it('should be created and saved correctly on the DB', function(done) {
            var userData = {
                name: 'Created User',
                password: 'password',
                expectedCalories: 2500
            };
            request(url).post('/users').send(userData).expect(201).end(function(err, res) {
                if (err) return done(err);

                // test that the properties of the user returned by the api are the same
                assert.equal(res.body.name, userData.name);
                assert.equal(res.body.expectedCaloriesPerDay, userData.expectedCalories);
                done();
            });
        });

        it('should not be created if no name is passed', function(done) {
            var userData = {
                password: 'password',
                expectedCalories: 2500
            };
            request(url).post('/users').send(userData).expect(404).end(function(err, res) {
                if (err) return done(err);

                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User could not be created.');
                done();
            });
        });

        it('should not be created if no password is passed', function(done) {
            var userData = {
                name: 'NewUser',
                expectedCalories: 2500
            };
            request(url).post('/users').send(userData).expect(404).end(function(err, res) {
                if (err) return done(err);

                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User could not be created.');
                done();
            });
        });

        it('should not be created if a user with the same name already exists', function(done) {
            var userData = {
                name: 'Peter',
                password: 'password',
                expectedCalories: 2500
            };
            request(url).post('/users').send(userData).expect(404).end(function(err, res) {
                if (err) return done(err);

                assert.equal(res.body.success, false);
                assert.equal(res.body.message, 'User could not be created.');
                done();
            });
        });

    });

    describe('Retrieval', function() {

        // crate an admin user and a regular one
        var user1 = new ApiUser(url, 'admin', 'admin', 2000, true);
        var user2 = new ApiUser(url, 'John', 'password', 2200, false);

        before(function(done) {
            user1.createAndAuthenticate(function() {
                user2.createAndAuthenticate(done);
            });
        });

        it('should return an array of users when an admin user makes the request', function(done) {
            authRequests.getRequestWithToken(url, '/users', user1.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body instanceof Array, true);
                    assert.equal(res.body.length > 0, true);
                    done();
            });
        });

        it('should return an authorization error when a non-admin user tries to retrieve all users', function(done) {
            authRequests.getRequestWithToken(url, '/users', user2.token)
                .expect(403).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should not return the hashed password for the users', function(done) {
            authRequests.getRequestWithToken(url, '/users', user1.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    var users = res.body;
                    users.forEach(function(user) {
                        assert.equal(user.hasOwnProperty('password'), false);
                    });
                    done();
            });
        });

        it('should return a single user when passing the user\'s name', function(done) {
            authRequests.getRequestWithToken(url, '/users/John', user2.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.name, user2.name);
                    assert.equal(res.body.expectedCaloriesPerDay, user2.expectedCalories);
                    done();
            });
        });

        it('should return an error if a single user is not found', function(done) {
            authRequests.getRequestWithToken(url, '/users/Anthony', user1.token)
                .expect(404).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

    });

    describe('Update', function() {

        var user1 = new ApiUser(url, 'Steven', 'asdf9876', 2350, true);
        var user2 = new ApiUser(url, 'Noel', 'f6asjwr8', 1850, false);

        before(function(done) {
            user1.createAndAuthenticate(function() {
                user2.createAndAuthenticate(done);
            });
        });

        it('should fail if the user does not exist', function(done) {
            authRequests.putRequestWithToken(url, '/users/UserThatDoesntExist', user1.token)
                .expect(404).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should be possible to update a user\'s name', function(done) {
            var userData = {
                name: 'Pablo'
            };

            authRequests.putRequestWithToken(url, '/users/Steven', user1.token)
                .send(userData).expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.name, userData.name);
                    done();
            });
        });

        it('should be possible to update the expected calories per day property of a user', function(done) {
            var userData = {
                expectedCaloriesPerDay: 9999
            };

            authRequests.putRequestWithToken(url, '/users/Noel', user2.token)
                .send(userData).expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.expectedCaloriesPerDay, userData.expectedCaloriesPerDay);
                    done();
                });
        });

    });

    describe('Deletion', function() {

        // create one admin user and one non-admin
        var user1 = new ApiUser(url, 'Chris', '3f3f452|', 2350, true);
        var user2 = new ApiUser(url, 'Federico', 'asdwe4asdf', 2800, false);

        before(function(done) {
            user1.createAndAuthenticate(function() {
                user2.createAndAuthenticate(done);
            });
        });

        it('should fail if the user does not exist', function(done) {
            authRequests.deleteRequestWithToken(url, '/users/Philip', user1.token)
                .expect(404).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should fail if a non-admin user is trying to delete a user', function(done) {
            authRequests.deleteRequestWithToken(url, '/users/Chris', user2.token)
                .expect(403).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
                });
        });

        it('should be removed successfully', function(done) {
            authRequests.deleteRequestWithToken(url, '/users/Chris', user1.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, true);
                    done();
            });
        });

    });

});
