'use strict';

/* global define:true*/
define(['jquery',
    'knockout',
    '../controllers/changeUserSettingsController.js'
  ], function($, ko, ChangeUserSettingsController) {
  return function(name, expectedCaloriesPerDay, admin) {
    var self = this;

    self.userName = ko.observable(name);
    self.expectedCaloriesPerDay = ko.observable(expectedCaloriesPerDay);
    self.admin = ko.observable(admin);

    self.adminDisplay = ko.computed(function() {
      return self.admin() ? 'YES' : 'NO';
    });

    self.changeUserSettings = function() {
        var changeSettingsController = new ChangeUserSettingsController();
        changeSettingsController.init(self);
    };
  };
});
