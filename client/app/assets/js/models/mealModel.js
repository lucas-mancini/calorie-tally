'use strict';

/* global define:true*/
define(['knockout'
    ], function(ko) {
  return function(meal) {
    var self = this;

    self.id = ko.observable(meal._id);
    self.description = ko.observable(meal.description);
    self.numberOfCalories = ko.observable(meal.numberOfCalories);
    self.dateAndTime = ko.observable(meal.dateTime);

    self.creator = ko.observable(meal.creator.name);

    self.formattedDateAndTime = ko.computed(function() {
        var formatTimeValue = function(number) {
            // add a trailing 0 if the time has one digit, i.e. turn 8 into '08'
            var numberAsString = number.toString();
            var digits = numberAsString.length;
            return digits < 2 ? '0' + numberAsString : numberAsString;
        };

        var dateAndTime = new Date(self.dateAndTime());

        var year = dateAndTime.getUTCFullYear();
        var month = formatTimeValue(dateAndTime.getUTCMonth() + 1);
        var day = formatTimeValue(dateAndTime.getUTCDate());
        var hours = dateAndTime.getUTCHours();
        var minutes = formatTimeValue(dateAndTime.getUTCMinutes());

        /* convert to am/pm format */
        var am = true;
        if (hours > 12) {
            hours -= 12;
            am = false;
        }
        hours = formatTimeValue(hours);

        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + (am ? ' a. m.' : ' p. m.');
    }, self);
  };
});
