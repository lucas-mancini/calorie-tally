'use strict';

/* global define:true*/
define(['knockout',
    'jquery',
    '../controllers/apiController.js',
    './userViewModel.js'
    ], function(ko, $, apiController, UserViewModel) {
  return function() {
    var self = this;

    self.allUsers = ko.observableArray([]);

    self.loadAllUsers = function(isAdmin) {
        if (isAdmin) {
            apiController.listUsers(
            function(data) {
                self.allUsers.removeAll();
                data.forEach(function(user) {
                    self.allUsers.push(
                        new UserViewModel(user.name, user.expectedCaloriesPerDay, user.admin)
                    );
                });
            }, function(data) {
                $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
            });
        }
    };

  };
});
