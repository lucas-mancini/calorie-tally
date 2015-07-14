'use strict';

require.config({
  paths: {
    'bower_components': '../../bower_components',
    'jquery': '../../bower_components/jquery/dist/jquery',
    'sammy': '../../bower_components/sammy/lib/sammy',
    'knockout.validation': '../../bower_components/knockout.validation/Dist/knockout.validation',
    'bootbox': '../../bower_components/bootbox/bootbox',
    'notify': '../../bower_components/notifyjs-dist/notify',
    'notify-bootstrap': '../../bower_components/notifyjs-dist/styles/bootstrap/notify-bootstrap',
    'jquery.bootstrap': '../../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap'
  },
  shim: {
    'jquery.bootstrap': {
      deps: ['jquery']
    },
    'knockout.validation': {
      deps: ['knockout']
    },
    'notify': {
      deps: ['jquery']
    },
    'notify-bootstrap': {
      deps: ['notify']
    }
  },
  map: {
    '*': {
      'knockout': '../../bower_components/knockout.js/knockout',
      'ko': '../../bower_components/knockout.js/knockout'
    }
  }
});

// Use the debug version of knockout in development only
/* global window:true*/
if (window.knockoutBootstrapDebug) {
  require.config({
    map: {
      '*': {
        'knockout': '../../bower_components/knockout.js/knockout.debug.js',
        'ko': '../../bower_components/knockout.js/knockout.debug.js'
      }
    }
  });
}

if (!window.requireTestMode) {
  require(['main'], function () { });
}
