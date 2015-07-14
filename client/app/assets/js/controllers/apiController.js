'use strict';
/* global window */

/* global define:true*/
define(['jquery'
    ], function($) {

    var backendUrl = 'http://localhost:8080/api/';

    return {

      _getAuthToken: function() {
        return window.localStorage.getItem('token');
      },

      ajaxSetupWithAuthToken: function() {
        var token = this._getAuthToken();

        if (token) {
          $.ajaxSetup({
            headers: {
              'x-access-token': token
            }
          });
        }
      },

      clearAjaxSetup: function() {
        $.ajaxSetup({ headers: { 'x-access-token': ''} });
      },

      createUser: function(newUser, success, error) {
        $.post(backendUrl + 'users', newUser)
          .done(success)
          .fail(error);
      },

      authenticate: function(username, password, success, error) {
        $.post(backendUrl + 'authenticate', {name: username, password: password})
          .done(success)
          .fail(error);
      },

      listUsers: function(success, error) {
        $.get(backendUrl + 'users').done(success).fail(error);
      },

      getSingleUser: function(username, success, error) {
        $.get(backendUrl + 'users/' + username)
          .done(success)
          .fail(error);
      },

      updateUser: function(username, userObj, success, error) {
        $.ajax({
          method: 'PUT',
          url: backendUrl + 'users/' + username,
          data: userObj
        })
        .done(success)
        .fail(error);
      },

      listMeals: function(success, error) {
        $.get(backendUrl + 'meals').done(success).fail(error);
      },

      listMealsAndFilter: function(filterParamsObj, success, error) {
        $.get(backendUrl + 'meals/filter?' + $.param(filterParamsObj))
          .done(success)
          .fail(error);
      },

      createMeal: function(newMeal, success, error) {
        $.post(backendUrl + 'meals', newMeal)
          .done(success)
          .fail(error);
      },

      deleteMeal: function(mealId, success, error) {
        $.ajax({
          method: 'DELETE',
          url: backendUrl + 'meals/' + mealId
        })
        .done(success)
        .fail(error);
      },

      updateMeal: function(mealId, mealObj, success, error) {
        $.ajax({
          method: 'PUT',
          url: backendUrl + 'meals/' + mealId,
          data: mealObj
        })
        .done(success)
        .fail(error);
      }

    };

  });
