'use strict';

/* global define:true*/
define(['knockout',
    '../controllers/apiController.js',
    './mealModel.js',
    'jquery',
    'bootbox',
    '../controllers/changeMealController.js',
    '../controllers/addMealController.js'
    ], function(ko, apiController, MealModel, $, bootbox, ChangeMealController, AddMealController) {
  return function(user) {
    var self = this;

    self.user = user;
    self.myMeals = ko.observableArray([]);

    self.totalCaloriesToday = ko.computed(function() {
        var result = 0;
        var now = new Date();

        ko.utils.arrayForEach(self.myMeals(), function(meal) {
            var mealDate = new Date(meal.dateAndTime());
            if (now.getUTCFullYear() === mealDate.getUTCFullYear() &&
                now.getUTCMonth() === mealDate.getUTCMonth() &&
                now.getUTCDate() === mealDate.getUTCDate()) {
                result += meal.numberOfCalories();
            }
        });

        return result;
    }, self);

    self._transformDateToServerFormat = function(date) {
        try {
            // transform date from yyyy-mm-dd to dd-mm-yyyy
            var splittedDate = date.split('-');
            return splittedDate[2] + '-' + splittedDate[1] + '-' + splittedDate[0];
        }
        catch (err) {
            return '';
        }
    };

    self._mealsLoadedSuccess = function(data) {
        self.myMeals.removeAll();
        data.forEach(function(meal) {
            self.myMeals.push(new MealModel(meal));
        });
    };

    self._mealsLoadedError = function(data) {
        $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
    };

    self.loadMyMeals = function() {
        apiController.listMealsAndFilter({
          username: self.user.userName(),
          timeFrom: '',
          timeTo: '',
          dateFrom: '',
          dateTo: ''
        }, self._mealsLoadedSuccess, self._mealsLoadedError);
    };

    self.filterMyMeals = function() {
        var timeFromInputElement = $('#filter-time-from-input').val();
        var timeToInputElement = $('#filter-time-to-input').val();

        var formattedDateFromInputElement = self._transformDateToServerFormat($('#filter-date-from-input').val());
        var formattedDateToInputElement = self._transformDateToServerFormat($('#filter-date-to-input').val());

        if (timeFromInputElement && timeToInputElement && formattedDateFromInputElement && formattedDateToInputElement) {
            apiController.listMealsAndFilter({
              username: self.user.userName(),
              timeFrom: timeFromInputElement,
              timeTo: timeToInputElement,
              dateFrom: formattedDateFromInputElement,
              dateTo: formattedDateToInputElement
            }, self._mealsLoadedSuccess, self._mealsLoadedError);
        }
    };

    self.addMeal = function() {
        var addMealController = new AddMealController();
        addMealController.init(self.user.userName(), self.myMeals);
    };

    self.editMeal = function(meal) {
        var changeMealController = new ChangeMealController();
        changeMealController.init(meal);
    };

    self.removeMeal = function(meal) {
        bootbox.confirm('Are you sure you want to delete the meal?', function(result) {
            if (result) {
                apiController.deleteMeal(meal.id(),
                    function(data) {
                        if (data.success) {
                            self.myMeals.remove(meal);
                        }
                        else {
                            $.notify(data.message, {className: 'error', globalPosition: 'left middle'});
                        }
                    },
                    function(data) {
                        $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
                });
            }
        });

    };

  };
});
