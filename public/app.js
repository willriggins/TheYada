(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*******************************
* Home Controller
*


sorting buttons
home == Hot
/controversialLinks
/newLinks

********************************/

module.exports = function(app) {

  app.controller('HomeController', ['$scope', '$location', 'YadaService', function($scope, $location, YadaService){

    /*******************************
    * grab the yadas for the ng-repeat in home.html
    *********************************/

    $scope.yadas = YadaService.getTopYadas();
    $scope.searchString = "";


    /*******************************
    * up and down voting
    ********************************/
    $scope.upIt = function (yada) {
        YadaService.upKarma(yada, function() {
              console.log("callback");
              $scope.yadas = YadaService.updateYadas();
              $location.path("/");
        });

    }
    $scope.downIt = function (yada) {
        YadaService.downKarma(yada, function() {
            console.log("callback");
            $scope.yadas = YadaService.updateYadas();
            $location.path("/");
        });

    }
    /*******************************
    * search
    ********************************/
    $scope.search = function(query) {
        console.log(query);
        YadaService.searchYadas(query, function() {
          $scope.yadas = YadaService.updateYadas();
          $scope.searchString = "";
          $location.path("/");
        });
    }
    /*******************************
    * filter results
    ********************************/
    $scope.hot = function() {
        // might want to refactor
        // add button highlighting by toggling active classes
        // $scope.yadas = YadaService.filter('hot');
        $scope.yadas = YadaService.getTopYadas();
    }
    $scope.controversial = function() {
        $scope.yadas = YadaService.filter('controversial');
    }
    $scope.new = function() {
        $scope.yadas = YadaService.filter('new');
    }
    $scope.top = function() {
        $scope.yadas = YadaService.filter('top');
    }

  }])
}

},{}],2:[function(require,module,exports){
/*******************************
* Login Controller
* display user information from service
********************************/


module.exports = function(app) {

  app.controller('LoginController', ['$scope', '$location','UserService', function($scope, $location, UserService){

    $scope.userObj = UserService.getUser();


    /*******************************
    * login
    ********************************/
    $scope.login = function () {
      UserService.setUser({
        username: $scope.username,
        password: $scope.password,
      })
    }


    /*******************************
    * logout
    ********************************/
    $scope.logout = function() {
      //clear session
      UserService.clearSession();
    }




  }])
}

},{}],3:[function(require,module,exports){
/*******************************
* Nav Controller
*
********************************/

module.exports = function(app) {

  app.controller('NavController', ['$scope','$location', 'YadaService', 'UserService', function($scope, $location, YadaService, UserService){

    $scope.user = UserService.getUser();
    $scope.logStatus = UserService.getLogStatus();


    /*******************************
    * get yadas from server for home page
    ********************************/
    $scope.home = function() {
      YadaService.getTopYadas();
    }


  }])
}

},{}],4:[function(require,module,exports){
'use strict';

/*******************************
* The Yada Web App
* Date: 7-18-2016
*
********************************/

(function () {
  "use strict";

  var app = angular.module('YadaWebApp', ['ngRoute', 'angular-storage', 'angular-jwt'])

  /*******************************
  * ROUTER
  *********************************/
  .config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
      templateUrl: 'home.html',
      controller: 'HomeController'
    }).when('/login', {
      templateUrl: 'log-in.html',
      controller: 'LoginController'
    }).when('/logout', {
      templateUrl: 'log-out.html',
      controller: 'LoginController'
    }).when('/about', {
      templateUrl: 'about.html'
    }).when('/yadayada', {
      templateUrl: 'yadayada.html'
    }).otherwise({
      redirectTo: '/404'
    });
  }])
  /*******************************
  * run function when app is initiated
  * could be used to check for cookies or user log status
  *********************************/
  .run(['$rootScope', '$location', 'UserService', function ($rootScope, $location, UserService) {

    UserService.checkLogStatus();
  }]);

  /*******************************
  * file tree of requirements
  *********************************/
  // Services
  require('./services/user-service')(app);
  require('./services/yada-service')(app);

  // Controllers
  require('./controllers/nav-controller')(app);
  require('./controllers/login-controller')(app);
  require('./controllers/home-controller')(app);

  // Filters
  require('./filters/search-filter.js')(app);

  // Directives

})();
},{"./controllers/home-controller":1,"./controllers/login-controller":2,"./controllers/nav-controller":3,"./filters/search-filter.js":5,"./services/user-service":6,"./services/yada-service":7}],5:[function(require,module,exports){

module.exports = function (app) {

    app.filter('searchFor', function(){
        return function(arr, searchString){
            if(!searchString){
                return arr;
            }
            var result = [];
            searchString = searchString.toLowerCase();
            angular.forEach(arr, function(item){

                item.yadaList.forEach(function(e){

                      if(e.content.toLowerCase().indexOf(searchString) !== -1){
                        console.log(e);
                      // result.push(e);
                  }
                })
      
            });
            return result;
        };
    });
}

},{}],6:[function(require,module,exports){
/*******************************
* User Service
* stores user
********************************/


module.exports = function(app) {

  app.factory('UserService', ['$http', '$location', function($http, $location) {

      let userObj = {};
      let logStatus = {status: false};

      return {

        /*******************************
        * add user
        ********************************/
        setUser(user) {

          $http({
            url: '/login',
            method: 'POST',
            data: user
          }).then(function() {
            angular.copy(user, userObj);
            let log = {status: true};
            angular.copy(log, logStatus);

            $location.path('/');
          })
        },

        checkLogStatus() {
          $http({
            url: 'http://localhost:8080/logStatus',
            method: 'GET'
          }).then(function(response) {
            console.log("user check", response.data);

            let user = response.data
            angular.copy(user, userObj);
            let log = {status: true};
            angular.copy(log, logStatus);

            $location.path('/');
          })
        },


        /*******************************
        * return log status
        ********************************/
        getLogStatus() {
            return logStatus;
        },

        /*******************************
        * current user
        ********************************/
        getUser() {

          return userObj;
        },

        /*******************************
        * clear out user information and reset status
        * redirect to homepage
        ********************************/
        clearSession() {
          $http({
            url: 'http://localhost:8080/logout',
            method: 'POST',
          })
          .then(function(response) {
            console.log("and then", response);
            user = {};
            let log = {status: false};

            angular.copy(user, userObj);
            angular.copy(log, logStatus);

            $location.path('/');
          });

        },
      }


  }])
}

},{}],7:[function(require,module,exports){
/*******************************
* Yada Service
* grabs yadaList from server
********************************/


module.exports = function(app) {


  app.factory('YadaService', ['$http', '$location', function($http, $location) {

    /*******************************
      yadaList should look list:
      [
          id: 0,
          linkScore: 0,
          numberOfYadas: 0,
          timeDiffInSeconds: 0,
          timeOfCreation:{},
          totalVotes: 0,
          url: "",
          yadaList:[{
              content: "",
              karma: 0,
              time: {},
              score: 0,
              user: "",
              link: ""
          }]
      ]
    ********************************/
      let topYadas = [];




      return {
        /*******************************
        * get yadas from server for home page
        ********************************/
        getTopYadas() {
          $http({
              url: '/theYadaList',
              method: 'GET'
            }).then(function(response){
              yadas = response.data;
              angular.copy(yadas, topYadas);
            })
            console.log("initial get", topYadas);
            return topYadas;
        },
        /*******************************
        * up voting yada
        ********************************/
        upKarma(yada, callback) {

            $http({
              url: '/upVote',
              method: 'POST',
              data: yada
            }).then(function(response){
              console.log("up vote update", response.data);
              yadas = response.data;

              angular.copy(yadas, topYadas);
              // callback();
            }).then(callback)
        },
        /*******************************
        * down voting yada
        ********************************/
        downKarma(yada, callback) {

          $http({
            url: '/downVote',
            method: 'POST',
            data: yada
          }).then(function(response){
            console.log("down vote update", response.data);
            yadas = response.data;

            angular.copy(yadas, topYadas);
            // callback();
          }).then(callback)
        },
        /*******************************
        * update w/out new server request
        ********************************/
        updateYadas() {
          console.log("updating");
          return topYadas;
        },

        /*******************************
        * search request
        ********************************/
        searchYadas(searchString, callback) {

            let searchUrl = `/searchYadas?searchInput=${searchString}`;

            $http({
                url: searchUrl,
                method: 'GET'
              }).then(function(response){

                yadas = response.data;
                console.log("searching", yadas);
                angular.copy(yadas, topYadas);
              }).then(callback)

          return topYadas;
        },

        /*******************************
        * filter requests
        ********************************/
        filter(sortStyle) {
          let filterUrl = `/${sortStyle}Links`;

          $http({
              url: filterUrl,
              method: 'GET'
            }).then(function(response){

              yadas = response.data;
              console.log("filtering", yadas);
              angular.copy(yadas, topYadas);
            })

            return topYadas;
        }

      }


  }])
}

},{}]},{},[4])