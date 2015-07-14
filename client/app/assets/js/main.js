'use strict';

/* global define:true*/
define(['jquery',
    'knockout',
    '../../assets/js/models/appViewModel.js',
    '../../assets/js/models/loginViewModel.js',
    '../../assets/js/models/userViewModel.js',
    'jquery.bootstrap'
    ], function($, ko, AppViewModel, Login, UserViewModel) {

  var login = new Login();
  login.init(function(username, expectedCaloriesPerDay, admin) {
    var user = new UserViewModel(username, expectedCaloriesPerDay, admin);

    var UI = new AppViewModel(user, login);
    ko.applyBindings(UI);

    /* the meals and users are loaded by the 'click' data bindings associated
    to the elements of the navigation bar in _leftmenutabs.jade */
  });

});
