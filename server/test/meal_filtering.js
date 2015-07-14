var assert = require('assert');
var mealFilters = require('../app/helpers/mealFilters');

var testArray = [
    {
        '_id': '5592df383e78e9806c3216a2',
        'creator': {
            '_id': '5592cfbf31b57e4365999636',
            'name': 'Lucas',
            'expectedCaloriesPerDay': 2200,
            'admin': false,
            'userManager': false,
            '__v': 0
        },
        'description': 'Dinner last night',
        'numberOfCalories': 450,
        'dateTime': '2015-06-30T13:22:43.881Z',
        '__v': 0
    },
    {
        '_id': '55930d8ce81b7e7a0a33461d',
        'creator': {
            '_id': '5592cde247b10735632234fe',
            'name': 'Patrick',
            'expectedCaloriesPerDay': 1500,
            'admin': false,
            'userManager': false,
            '__v': 0
        },
        'description': 'Dinner last night',
        'numberOfCalories': 625,
        'dateTime': '2015-06-20T18:30:43.881Z',
        '__v': 0
    },
    {
        '_id': '55930d96e81b7e7a0a33461e',
        'creator': {
            '_id': '5592cde247b10735632234fe',
            'name': 'Patrick',
            'expectedCaloriesPerDay': 1500,
            'admin': false,
            'userManager': false,
            '__v': 0
        },
        'description': 'Breakfast',
        'numberOfCalories': 780,
        'dateTime': '2015-04-02T14:57:43.881Z',
        '__v': 0
    },
    {
        '_id': '5592d07eb73ebdce665735e4',
        'creator': {
            '_id': '5592cfbf31b57e4365999636',
            'name': 'Lucas',
            'expectedCaloriesPerDay': 2200,
            'admin': false,
            'userManager': false,
            '__v': 0
        },
        'description': 'Lunch monday',
        'numberOfCalories': 450,
        'dateTime': '2015-01-01T10:35:43.881Z',
        '__v': 0
    }
];

describe('Meal', function() {

    describe('Filtering by date', function() {

        it('should return an empty array if a range of date with no meals is passed', function() {
            var filteredMeals = mealFilters.filterByDate(testArray, '05-05-2014', '08-09-2014');
            assert.equal(filteredMeals.length, 0);
        });

        it('should return all meals if a range of date with every meal is passed', function() {
            var filteredMeals = mealFilters.filterByDate(testArray, '05-05-2014', '08-09-2019');
            assert.equal(filteredMeals.length, 4);
        });

        it('should return the two meals in June 2015 if a filter with that month is passed', function() {
            var filteredMeals = mealFilters.filterByDate(testArray, '01-06-2015', '01-07-2015');
            assert.equal(filteredMeals.length, 2);
        });

    });

    describe('Filtering by time', function() {

        it('should return an empty array if a range of times with no meals is passed', function() {
            var filteredMeals = mealFilters.filterByTime(testArray, '02:30', '04:00');
            assert.equal(filteredMeals.length, 0);
        });

        it('should return all meals if a range of time with every meal is passed', function() {
            var filteredMeals = mealFilters.filterByTime(testArray, '10:00', '23:30');
            assert.equal(filteredMeals.length, 4);
        });

        it('should return the two three meals in the afternoon if a filter from 12:00 to 21:00 is passed', function() {
            var filteredMeals = mealFilters.filterByTime(testArray, '12:00', '21:00');
            assert.equal(filteredMeals.length, 3);
        });

    });
});

