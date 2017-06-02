(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router',
            'triangular',
            'ngAnimate', 'ngCookies', 'ngSanitize', 'ngMessages', 'ngMaterial',
            'googlechart', 'chart.js', 'linkify', 'ui.calendar', 'angularMoment', 'textAngular', 'uiGmapgoogle-maps', 'hljs', 'md.data.table', angularDragula(angular), 'ngFileUpload',
            // 'seed-module',
            // uncomment above to activate the example seed module
            'app.translate',
            // only need one language?  if you want to turn off translations
            // comment out or remove the 'app.translate', line above
            'app.permission', 'ksSwiper',
            // dont need permissions?  if you want to turn off permissions
            // comment out or remove the 'app.permission', line above
            // also remove 'permission' from the first line of dependencies
            // https://github.com/Narzerus/angular-permission see here for why
            'app.examples',
            'firebase', 'ngResource', 'btford.socket-io'
        ])

    // set a constant for the API we are connecting to
    .constant('API_CONFIG', {
            'url': 'http://triangular-api.oxygenna.com/'
        })
        // .constant('SERVERURL', {
        //     'url': 'http://localhost:9000',
        //     'order': 'http://localhost:9000/api/orders/'
        // })
        .constant('SERVERURL', {
            'url': 'https://akmart.herokuapp.com',
            'order': 'https://akmart.herokuapp.com/api/orders/'
        })
        .constant('APPNAME', {
            'name': 'AKFOODMART'
        })


    .config(function($firebaseRefProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            var config = {
                apiKey: "AIzaSyDeYFru7LDR1PmSvfrxL6lrVYrrKm6z8Oc",
                authDomain: "foodkart-3c10a.firebaseapp.com",
                databaseURL: "https://foodkart-3c10a.firebaseio.com",
                storageBucket: "foodkart-3c10a.appspot.com",
                messagingSenderId: "987740463882"
            };

            firebase.initializeApp(config);

            $urlRouterProvider
                .otherwise('/');
            //$locationProvider.html5Mode(true);
            $httpProvider.interceptors.push('authInterceptor');
        })
        .factory('authInterceptor', function($rootScope, $q, $location, APPNAME) {


            return {
                // Add authorization token to headers
                request: function(config) {
                    var tokenName = APPNAME.name + 'token';
                    config.headers = config.headers || {};
                    if (localStorage[tokenName]) {
                        config.headers.Authorization = 'Bearer ' + localStorage[tokenName];
                    }
                    return config;
                },

                // Intercept 401s and redirect you to login
                responseError: function(response) {
                    var tokenName = APPNAME.name + 'token';
                    if (response.status === 401) {
                        // $location.path('/login');
                        // remove any stale tokens
                        //$cookieStore.remove('token');
                        delete localStorage[tokenName];
                        // $mdToast.show(
                        //     $mdToast.simple()
                        //     .content('Login Error! Kindly login again')
                        //     .position('bottom right')
                        //     .hideDelay(5000)
                        // );
                        return $q.reject(response);
                    } else {
                        return $q.reject(response);
                    }
                }
            };
        })

    .run(function($rootScope, Auth, $state, $mdToast) {

        // Redirect to login if route requires auth and you're not logged in
        $rootScope.$on('$stateChangeStart', function(event, next) {
            Auth.isLoggedInAsync(function(loggedIn) {
                if (next.authenticate && !loggedIn) {
                    event.preventDefault();
                    Auth.saveAttemptUrl();
                    $state.go('home');
                }
            });
        });
    });
})();