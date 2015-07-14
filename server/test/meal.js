var assert = require('assert');
var request = require('supertest');

var url = 'http://localhost:8090/api';

var ApiUser = require('./util/ApiUser');
var authRequests = require('./util/authRequests');

describe('Meal', function() {

    var user1 = new ApiUser(url, 'Eugene', 'pass45sd34a', 2000, true);
    var user2 = new ApiUser(url, 'Thom', '34sdf3423df', 2800, true);

    var mealData0 = {
        creator: user1.name,
        description: 'Dinner meal for Wednesday night',
        numberOfCalories: 650,
        dateTime: new Date()
    };

    var mealData1 = {
        creator: user1.name,
        description: 'Dinner meal for Wednesday night',
        numberOfCalories: 650,
        dateTime: new Date()
    };

    var mealData2 = {
        creator: user1.name,
        description: 'Lunch with Dad',
        numberOfCalories: 420,
        dateTime: new Date()
    };

    var mealData3 = {
        creator: user1.name,
        description: 'Saturday snack',
        numberOfCalories: 140,
        dateTime: new Date()
    };

    var mealData4 = {
        creator: user2.name,
        description: 'Lunch with a friend',
        numberOfCalories: 580,
        dateTime: new Date()
    };

    var mealData5 = {
        creator: user2.name,
        description: 'Dinner Friday night',
        numberOfCalories: 740,
        dateTime: new Date()
    };

    before(function(done) {
        user1.createAndAuthenticate(function() {
            user2.createAndAuthenticate(done);
        });
    });

    describe('Creation', function() {

        it('should not be created if no creator is passed', function(done) {
            var mealData = {
                description: 'Dinner meal for Wednesday night',
                numberOfCalories: 460,
                dateTime: new Date()
            };
            authRequests.postRequestWithToken(url, '/meals', user1.token)
                .send(mealData).expect(404).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should not be created if the creator\'s name does not exist', function(done) {
            var mealData = {
                creator: 'Nonexistentuser',
                description: 'Dinner meal for Wednesday night',
                numberOfCalories: 460,
                dateTime: new Date()
            };
            authRequests.postRequestWithToken(url, '/meals', user1.token)
                .send(mealData).expect(404).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should be created and saved correctly on the DB', function(done) {
            authRequests.postRequestWithToken(url, '/meals', user1.token)
                .send(mealData0).expect(201).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.description, mealData0.description);
                    assert.equal(res.body.numberOfCalories, mealData0.numberOfCalories);
                    done();
            });
        });

    });

    describe('Retrieval', function() {

        before(function(done) {
            // create two new meals to have some data on the DB
            authRequests.postRequestWithToken(url, '/meals', user1.token)
                .send(mealData1).end(function(err, res) {
                    if (err) return done(err);
                    authRequests.postRequestWithToken(url, '/meals', user1.token)
                        .send(mealData2).end(function(err, res) {
                            if (err) return done(err);
                            done();
                        });
            });
        });

        it('should return an array of meals', function(done) {
            authRequests.getRequestWithToken(url, '/meals', user1.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body instanceof Array, true);
                    assert.equal(res.body.length > 0, true);
                    done();
            });
        });

        it('each meal should have the data for the user that created the meal', function(done) {
            authRequests.getRequestWithToken(url, '/meals', user1.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    var meals = res.body;
                    meals.forEach(function(meal) {
                        assert.equal(meal.creator.name, user1.name);
                        assert.equal(meal.creator.expectedCaloriesPerDay, user1.expectedCalories);
                    });
                    done();
            });
        });

    });

    describe('Update', function() {

        var mealId = '';

        before(function(done) {
            // create a new meal to test the change a property in a testcase
            authRequests.postRequestWithToken(url, '/meals', user1.token)
                .send(mealData3).end(function(err, res) {
                    if (err) return done(err);
                    mealId = res.body._id;
                    done();
            });
        });

        it('should fail if the meal does not exist', function(done) {
            authRequests.putRequestWithToken(url, '/meals/invalid_id', user1.token)
                .expect(404).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should be possible to update the meal\'s description', function(done) {
            var mealData = {
                description: 'New description'
            };

            authRequests.putRequestWithToken(url, '/meals/' + mealId, user1.token)
                .send(mealData).expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.description, mealData.description);
                    done();
            });
        });

        it('should be possible to update the meal\'s number of calories', function(done) {
            var mealData = {
                numberOfCalories: 850
            };

            authRequests.putRequestWithToken(url, '/meals/' + mealId, user1.token)
                .send(mealData).expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.numberOfCalories, mealData.numberOfCalories);
                    done();
            });
        });

        it('should be possible to update the meal\'s date', function(done) {
            var mealData = {
                dateTime: '2015-04-30T19:57:43.881Z'
            };

            authRequests.putRequestWithToken(url, '/meals/' + mealId, user1.token)
                .send(mealData).expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.dateTime, mealData.dateTime);
                    done();
            });
        });

    });

    describe('Deletion', function() {

        var mealId = '';

        before(function(done) {
            // create a new meal to test the removal of the meal
            authRequests.postRequestWithToken(url, '/meals', user1.token)
                .send(mealData3).end(function(err, res) {
                    if (err) return done(err);
                    mealId = res.body._id;
                    done();
            });
        });

        it('should fail if the meal does not exist', function(done) {
            authRequests.deleteRequestWithToken(url, '/meals/invalid_id', user1.token)
                .expect(404).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should be removed successfully', function(done) {
            authRequests.deleteRequestWithToken(url, '/meals/' + mealId, user1.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, true);
                    done();
            });
        });

    });

    describe('Filtering by user name', function() {

        before(function(done) {
            // create 2 new meals to test filtering
            authRequests.postRequestWithToken(url, '/meals', user1.token)
                .send(mealData4).end(function(err, res) {
                    authRequests.postRequestWithToken(url, '/meals', user1.token)
                        .send(mealData5).end(function(err, res) {
                            done();
                        });
            });
        });

        it('should return an error if no username is provided as an url parameter', function(done) {
            authRequests.getRequestWithToken(url, '/meals/filter', user1.token)
                .expect(400).end(function(err, res) {
                    if (err) return done(err);

                    assert.equal(res.body.success, false);
                    done();
            });
        });

        it('should return the meals created by the given user', function(done) {
            authRequests.getRequestWithToken(url, '/meals/filter?username=' + user2.name, user1.token)
                .expect(200).end(function(err, res) {
                    if (err) return done(err);

                    // user2 owns only 2 meals
                    assert.equal(res.body instanceof Array, true);
                    assert.equal(res.body.length, 2);
                    done();
            });
        });

    });

});
