'use strict';

/* global define:true */
define(['jquery',
    'bootbox',
    './apiController.js',
    '../views/mealDialogView.js',
    '../models/mealModel.js'
    ], function($, bootbox, apiController, mealDialogView, MealModel) {
  return function() {
    var self = this;

    self.init = function(username, myMeals) {
        var dialog = bootbox.dialog({
            title: 'Create new meal',
            message: mealDialogView.dialogMarkup(),
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default',
                    callback: function() { /* no op */}
                },
                success: {
                    label: 'Create',
                    className: 'btn-success',
                    callback: function() {
                        var description = $('#meal-description-input').val();
                        var numberOfCalories = $('#meal-no-calories-input').val();
                        var dateTime = $('#meal-date-time-input').val() + 'Z';

                        apiController.createMeal({
                            creator: username,
                            description: description,
                            numberOfCalories: numberOfCalories,
                            dateTime: dateTime
                        }, function(data) {
                            myMeals.push(new MealModel(data));
                        }, function(data) {
                            $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
                        });
                    }
                }
            }
        });
        dialog.init(function() {
            // set current UTC date on the form
            $('#meal-date-time-input').val(mealDialogView.formatDateForInputControl());
        });
    };

  };
});
