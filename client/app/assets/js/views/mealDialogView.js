'use strict';

/* global define:true */
define([], function() {
  return {

    dialogMarkup: function() { return '<div class="row">' +
        '<div class="col-md-12">' +
        '  <form class="form-horizontal">' +
        '    <div class="form-group">' +
        '      <label class="col-md-4 control-label" for="description">Description</label>' +
        '      <div class="col-md-7">' +
        '        <input id="meal-description-input" name="description" type="text"' +
        '          class="form-control input-md" value="Example: Friday night pasta" />' +
        '      </div>' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <label class="col-md-4 control-label" for="no-calories">Number of calories</label>' +
        '      <div class="col-md-7">' +
        '        <input id="meal-no-calories-input" name="no-calories" type="number" min="0" class="form-control input-md" value="0"/>' +
        '      </div>' +
        '    </div>' +
        '    <div class="form-group">' +
        '      <label class="col-md-4 control-label" for="dateTime">Date and time</label>' +
        '      <div class="col-md-7">' +
        '        <input id="meal-date-time-input" name="dateTime" type="datetime-local" step="60" class="form-control input-md" />' +
        '      </div>' +
        '    </div>' +
        '  </form>' +
        '</div>' +
                        '</div>';
    },

    formatDateForInputControl: function(dateToFormat) {
        var date = dateToFormat ? new Date(dateToFormat) : new Date();
        date.setSeconds(0, 0);
        return date.toISOString().replace('Z', '');
    }

  };
});
