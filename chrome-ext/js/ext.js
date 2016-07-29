/*******************************
* The Yada Chrome Extension
* Date: 7-18-2016
*
********************************/



(function() {
"use strict"

  let ext = angular.module('YadaExtension', ['ngRoute', 'ngCookies', 'angular-storage', 'angular-jwt'])

    //Router
    .config(['$routeProvider',function($routeProvider) {

        $routeProvider
          .when('/', {
            templateUrl: '/home.html',
            controller: 'YadaExtController',
          })
          .when('/log-in', {
            templateUrl: '/log-in.html',
            controller: 'LoginExtController',
          })
          .when('/editor', {
            templateUrl: '/editor.html',
            controller: 'EditorExtController',
          })


    }])
    .run(['$rootScope','$location', 'UserExtService', function($rootScope, $location, UserExtService) {
      $rootScope.extUrl = document.referrer;

      UserExtService.checkLogStatus();

    }])


      // Services
      require('./services/user-ext-service')(ext);
      require('./services/yada-ext-service')(ext);


      // Controllers
      require('./controllers/nav-ext-controller')(ext);
      require('./controllers/login-ext-controller')(ext);
      require('./controllers/yada-ext-controller')(ext);
      require('./controllers/editor-ext-controller')(ext);


      // Filters

      // Directives


})()
