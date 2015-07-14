'use strict';

/* global define:true */
define(['jquery',
    'bootbox',
    './apiController.js',
    '../views/mealDialogView.js'
    ], function($, bootbox, apiController, mealDialogView) {
  return function() {
    var self = this;

    self.init = function(meal) {
        var dialog = bootbox.dialog({
            title: 'Edit meal',
            message: mealDialogView.dialogMarkup(),
            buttons: {
                cancel: {
                    label: 'Cancel',
                    className: 'btn-default',
                    callback: function() { /* no op */}
                },
                success: {
                    label: 'Save',
                    className: 'btn-success',
                    callback: function() {
                        var description = $('#meal-description-input').val();
                        var numberOfCalories = $('#meal-no-calories-input').val();
                        var dateTime = $('#meal-date-time-input').val() + 'Z';

                        apiController.updateMeal(meal.id(), {
                            description: description,
                            numberOfCalories: numberOfCalories,
                            dateTime: dateTime
                        }, function(data) {
                            meal.description(data.description);
                            meal.numberOfCalories(data.numberOfCalories);
                            meal.dateAndTime(data.dateTime);
                        }, function(data) {
                            $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
                        });
                    }
                }
            }
        });
        dialog.init(function() {
            // set meal's description on the form
            $('#meal-description-input').val(meal.description());

            // set meal's calories on the form
            $('#meal-no-calories-input').val(meal.numberOfCalories());

            // set meal's UTC date on the form
            $('#meal-date-time-input').val(mealDialogView.formatDateForInputControl(meal.dateAndTime()));
        });
    };

  };
});
