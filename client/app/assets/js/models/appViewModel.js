'use strict';

/* global define:true*/
define(['jquery',
    'knockout',
    '../../../assets/js/models/sammyViewModel.js',
    '../../../assets/js/models/myMealsViewModel.js',
    '../../../assets/js/models/allMealsViewModel.js',
    '../../../assets/js/models/allUsersViewModel.js',
    'knockout.validation'
    ], function($, ko, SammyViewModel, MyMealsViewModel, AllMealsViewModel, AllUsersViewModel) {
  return function(user, login) {
    var self = this;

    // Configure knockout validation plugin
    // To decorate form-group elements, use the validationElement binding
    ko.validation.configure({
      decorateElement: true,
      errorElementClass: 'has-error',
      errorMessageClass: 'help-block',
      errorsAsTitle: false
    });

    // Add submodels here

    // Sammy view model for local navigation
    self.sammy = new SammyViewModel();

    // Login view model
    self.login = login;

    // User view model
    self.user = user;

    // My meals view model
    self.myMeals = new MyMealsViewModel(user);

    // All meals view model
    self.allMeals = new AllMealsViewModel();

    // All users view model
    self.allUsers = new AllUsersViewModel();
  };
});
