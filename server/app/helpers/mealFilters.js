/**
  * Filters a list of meals by the time passed
  * @param {Array} meals The list of meals to filter
  * @param {String} dateFrom Starting time for the filter, in dd-mm-yyyy format.
  * @param {String} dateTo Ending time for the filter, in dd-mm-yyyy format.
  * @return {Array} list of filtered meals. */
exports.filterByDate = function(meals, dateFrom, dateTo) {
    return meals.filter(function(meal) {
        try {
            var splittedDateFrom = dateFrom.split('-');
            var from = new Date(splittedDateFrom[2], parseInt(splittedDateFrom[1]) - 1, splittedDateFrom[0], 0, 0);

            var splittedDateTo = dateTo.split('-');
            var to = new Date(splittedDateTo[2], parseInt(splittedDateTo[1]) - 1, splittedDateTo[0], 0, 0);

            // create date object from meal, resetting hours, minutes and seconds
            var mealDate = new Date(meal.dateTime);
            mealDate.setHours(0);
            mealDate.setMinutes(0);
            mealDate.setSeconds(0);

            return mealDate >= from && mealDate <= to;
        }
        catch (err) {
            console.error(err);
            return true;
        }
    });
};

/**
  * Filters a list of meals by the time passed
  * @param {Array} meals The list of meals to filter
  * @param {String} timeFrom Starting time for the filter, in HH:MM format.
  * @param {String} timeTo Ending time for the filter, in HH:MM format.
  * @return {Array} list of filtered meals. */
exports.filterByTime = function(meals, timeFrom, timeTo) {
    // check if the format is valid
    var timeRegex = /^([2][0-3]|[01]?[0-9])([.:][0-5][0-9])?$/;
    if (!timeFrom.match(timeRegex) || !timeTo.match(timeRegex)) {
        return meals;
    }

    return meals.filter(function(meal) {
        var timeFromHours = parseInt(timeFrom.split(':')[0]);
        var timeFromMinutes = parseInt(timeFrom.split(':')[1]);
        var timeToHours = parseInt(timeTo.split(':')[0]);
        var timeToMinutes = parseInt(timeTo.split(':')[1]);

        var mealDate = new Date(meal.dateTime); // date should be stored in UTC
        var mealHours = mealDate.getUTCHours();
        var mealMinutes = mealDate.getUTCMinutes();

        if (mealHours == timeFromHours && mealHours == timeToHours) {
            if (mealMinutes > timeFromMinutes && mealMinutes < timeToMinutes) {
                return true;
            }
        }
        else if (mealHours == timeFromHours) {
            if (mealMinutes > timeFromMinutes) {
                return true;
            }
        }
        else if (mealHours > timeFromHours && mealHours < timeToHours) {
            return true;
        }
        else if (mealHours == timeToHours) {
            if (mealMinutes < timeToMinutes) {
                return true;
            }
        }

        return false;
    });
};

