'use strict';
/* global window */
/* global document */

/* global define:true*/
define(['../controllers/apiController.js',
    'jquery',
    'bootbox',
    'notify-bootstrap'
    ], function(apiController, $, bootbox) {
  return function() {
    var self = this;

    self._loginDialogMarkup = function() {
      return '<div class="row">' +
      '<div class="col-md-12">' +
      '  <form class="form-horizontal">' +
      '    <div class="form-group">' +
      '      <div class="col-md-8 col-md-offset-2">' +
      '        <input id="username-input" name="username" type="text"' +
      '          class="form-control input-md" placeholder="Username"/>' +
      '      </div>' +
      '    </div>' +
      '    <div class="form-group">' +
      '      <div class="col-md-8 col-md-offset-2">' +
      '        <input id="password-input" name="password" type="password" class="form-control input-md" placeholder="Password" />' +
      '      </div>' +
      '    </div>' +
      '  </form>' +
      '</div>' +
             '</div>';
    };

    self._createAccountDialogMarkup = function() {
      return '<div class="row">' +
      '<div class="col-md-12">' +
      '  <form class="form-horizontal">' +
      '    <div class="form-group">' +
      '      <div class="col-md-8 col-md-offset-2">' +
      '        <input id="username-input" name="username" type="text"' +
      '          class="form-control input-md" placeholder="Username"/>' +
      '      </div>' +
      '    </div>' +
      '    <div class="form-group">' +
      '      <div class="col-md-8 col-md-offset-2">' +
      '        <input id="password-input" name="password" type="password" class="form-control input-md"' +
      '        placeholder="Password" />' +
      '      </div>' +
      '    </div>' +
      '    <div class="form-group">' +
      '      <div class="col-md-8 col-md-offset-2">' +
      '        <input id="password-bis-input" name="password" type="password" class="form-control input-md"' +
      '        placeholder="Retype password" />' +
      '      </div>' +
      '    </div>' +
      '    <div class="form-group">' +
      '      <div class="col-md-8 col-md-offset-2">' +
      '        <input id="expected-calories-input" name="password" type="number" min="0"' +
      '        class="form-control input-md" placeholder="Expected number of calories per day" />' +
      '      </div>' +
      '    </div>' +
      '  </form>' +
      '</div>' +
             '</div>';
    };

    self._saveAuthToken = function(token) {
      window.localStorage.setItem('token', token);
    };

    self._getAuthToken = function(token) {
      return window.localStorage.getItem('token', token);
    };

    self._clearAuthToken = function() {
      window.localStorage.removeItem('token');
    };

    self._getLoggedUserData = function(username, done) {
      apiController.ajaxSetupWithAuthToken();

      apiController.getSingleUser(username,
        function(data) { // get single user successful
          done(username, data.expectedCaloriesPerDay, data.admin);
        },
        function(data) { // get single user error
          $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
        });
    };

    self._showLoginDialog = function(done) {
      var dialog = bootbox.dialog({
        title: 'Please login to CalorieTally',
        message: self._loginDialogMarkup(),
        closeButton: false,
        buttons: {
            createAccount: {
              label: 'Create an account',
              className: 'btn-primary',
              callback: function() {
                self._showCreateAccountDialog(done);
              }
            },
            success: {
              label: 'Login',
              className: 'btn-success',
              callback: function() {
                  var usernameInForm = $('#username-input').val();
                  var passwordInForm = $('#password-input').val();

                  if (usernameInForm && passwordInForm) {
                    self._authenticateUser(usernameInForm, passwordInForm, done);
                  }

                  return false; // keep dialog opened
              }
            }
        }
      });
      // set focus to user name
      dialog.bind('shown.bs.modal', function() {
          dialog.find('#username-input').focus();
      });
    };

    self._showCreateAccountDialog = function(done) {
      var dialog = bootbox.dialog({
        title: 'Create a new CalorieTally account',
        message: self._createAccountDialogMarkup(),
        closeButton: false,
        buttons: {
            success: {
              label: 'Sign up',
              className: 'btn-success',
              callback: function() {
                  var usernameInForm = $('#username-input').val();
                  var passwordInForm = $('#password-input').val();
                  var secondPasswordInForm = $('#password-bis-input').val();
                  var expectedCaloriesInForm = $('#expected-calories-input').val();

                  // do some basic validation first
                  var validation = usernameInForm && passwordInForm && secondPasswordInForm && expectedCaloriesInForm;
                  if (!validation) {
                    $.notify('Please complete all the information correctly', {className: 'error', globalPosition: 'left middle'});
                    return false;
                  }
                  if (passwordInForm !== secondPasswordInForm) {
                    $.notify('Passwords don\'t match', {className: 'error', globalPosition: 'left middle'});
                    return false;
                  }

                  // create a new username using POST method
                  apiController.createUser({
                    name: usernameInForm,
                    password: passwordInForm,
                    expectedCalories: expectedCaloriesInForm
                  }, function(data) {
                    // authenticate the brand new user
                    self._authenticateUser(data.name, passwordInForm, done);
                  }, function(data) {
                    $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
                  });

                  return false; // keep dialog opened
              }
            }
        }
      });
      // set focus to user name
      dialog.bind('shown.bs.modal', function() {
          dialog.find('#username-input').focus();
      });
    };

    self._authenticateUser = function(username, password, done) {
      apiController.authenticate(username, password,
        function(data) { // authentication successful
          self._saveAuthToken(data.token);
          self._getLoggedUserData(username, done);
          bootbox.hideAll(); // hide all modal dialogs
        },
        function(data) {  // authentication error
          $.notify(data.responseJSON.message, {className: 'error', globalPosition: 'left middle'});
      });
    };

    self.init = function(done) {
      self._showLoginDialog(done);
    };

    self.logout = function() {
      apiController.clearAjaxSetup();
      self._clearAuthToken();
      document.location.reload();
    };

  };
});
