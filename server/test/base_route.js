var assert = require('assert');

var url = 'http://localhost:8090/api';

var ApiUser = require('./util/ApiUser');
var authRequests = require('./util/authRequests');

describe('Base route', function() {
    var user = new ApiUser(url, 'Michael', '12341234', 2300);

    before(function(done) {
        user.createAndAuthenticate(done);
    });

    it('should provide a welcome message to the api', function(done) {
        authRequests.getRequestWithToken(url, '/', user.token)
            .expect(200).end(function(err, res) {
                if (err) return done(err);

                assert.equal(res.body.message, 'Welcome to CalorieTally REST API');
                done();
        });
    });
});
