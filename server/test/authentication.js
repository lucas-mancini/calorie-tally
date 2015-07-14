var assert = require('assert');
var request = require('supertest');

var url = 'http://localhost:8090/api';

var ApiUser = require('./util/ApiUser');
var authRequests = require('./util/authRequests');

describe('Authentication', function() {

    describe('Token generation', function() {

        var user = new ApiUser(url, 'New User', 'secretp4ssw0rd', 2000);

        before(function(done) {
            user.create(done);
        });

        it('should fail if the user is not found', function(done) {
            var authData = {
                name: 'unknown user',
                password: '12341234'
            };
            request(url).post('/authenticate').send(authData)
                .expect(401).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should fail if the password is invalid', function(done) {
            var authData = {
                name: 'New User',
                password: 'secretpassword'
            };
            request(url).post('/authenticate').send(authData)
                .expect(401).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should return a token if the user name and password are valid', function(done) {
            var authData = {
                name: 'New User',
                password: 'secretp4ssw0rd'
            };
            request(url).post('/authenticate').send(authData)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, true);
                    assert.equal(res.body.token.length > 0, true);
                    done();
            });
        });

    });

    describe('Middleware token verification', function() {

        var user = new ApiUser(url, 'Authorized', 'password', 2500);
        var protectedRoutes = ['/', '/users'];

        before(function(done) {
            user.createAndAuthenticate(done);
        });

        protectedRoutes.forEach(function(route) {
            it('should return an error when the user does not provide a token for the route: /api' + route, function(done) {
                request(url).get(route).expect(401).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
                });
            });
        });

        it('should return an error if an invalid token is provided', function(done) {
            authRequests.getRequestWithToken(url, '/', 'OxABCD1234')
                .expect(401).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should allow access to the API when an authenticated user provides a valid token', function(done) {
            authRequests.getRequestWithToken(url, '/', user.token).expect(200, done);
        });

    });

});
