'use strict';

/* global define:true*/
define(['knockout',
    '../controllers/apiController.js',
    './mealModel.js',
    'jquery',
    'bootbox',
    '../controllers/changeMealController.js'
    ], function(ko, apiController, MealModel, $, bootbox, ChangeMealController) {
  return function() {
    var self = this;

    self.allMeals = ko.observableArray([]);

    self.loadAllMeals = function(isAdmin) {
        if (isAdmin) {
            apiController.listMeals(
                function(data) {
                    self.allMeals.removeAll();
                    data.forEach(function(meal) {
                        self.allMeals.push(new MealModel(meal));
                    });
                }, function(data) {
                    $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
            });
        }
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
                            self.allMeals.remove(meal);
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
