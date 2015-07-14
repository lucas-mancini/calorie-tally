'use strict';

/* global define:true */
define(['jquery',
    'bootbox',
    './apiController.js'
    ], function($, bootbox, apiController) {
  return function() {
    var self = this;

    self._updateExpectedCaloriesForUser = function(user, newValue) {
        apiController.updateUser(user.userName(), {
            name: user.userName(),
            expectedCaloriesPerDay: newValue
        }, function(data) {
            user.expectedCaloriesPerDay(data.expectedCaloriesPerDay);
        }, function(data) {
            $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
        });
    };

    self.init = function(user) {
        bootbox.prompt({
            title: 'Change the amount of expected calories per day for ' + user.userName(),
            value: user.expectedCaloriesPerDay(),
            callback: function(newValue) {
                if (newValue !== null) {
                    var newValueAsInteger = parseInt(newValue);
                    if (!isNaN(newValueAsInteger) && newValueAsInteger > 0) {
                        self._updateExpectedCaloriesForUser(user, newValueAsInteger);
                    }
                    else {
                        $.notify('Invalid value, the number of calories should be a positive integer',
                            {className: 'error', globalPosition: 'left middle'});
                    }
                }
            }
        });
    };

  };
});
