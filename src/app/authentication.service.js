(function() {
    'use strict';

    angular
        .module('app')
        .value('redirectToUrlAfterLogin', { url: '/' })
        .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q, redirectToUrlAfterLogin, SERVERURL, APPNAME) {
            var currentUser = {};
            var tokenName = APPNAME.name + 'token';
            //var x={};
            // if ($cookieStore.get('token')) {
            //     currentUser = User.get();
            // }
            if (localStorage[tokenName]) {
                console.log("here start");
                currentUser = User.get();
            }

            /**
             * Get auth token
             */
            function getToken() {
                // return $cookieStore.get('token');
                return localStorage[tokenName];
            };

            /**
             * Set auth token
             */
            function setToken(token) {
                localStorage[tokenName] = token;
            };

            /**
             * delete auth token
             */
            function deleteToken() {
                // return $cookieStore.get('token');
                delete localStorage[tokenName];
            }

            // function doAsync() {
            //     var deferred = $q.defer();
            //     $scope.x = $cookieStore.get('token');

            //     if ($scope.x) {
            //         console.log("check0");
            //         deferred.resolve(x);
            //     } else {
            //         console.log("check0 error");
            //         deferred.reject('Greeting  not resolved');
            //     }

            //     return deferred.promise;
            // }

            function checkUser() {
                console.log("check2");
                if (localStorage[tokenName]) {
                    $http.get(SERVERURL.url + '/api/users/me/').success(function(data) {
                        currentUser = data;
                    })
                } else return false;
            }


            return {

                /**
                 * Authenticate user and save token
                 *
                 * @param  {Object}   user     - login info
                 * @param  {Function} callback - optional
                 * @return {Promise}
                 */

                // setUser: function() {
                //     return doAsync()
                //         .then(function(response) {
                //             return checkUser();
                //         });
                // },



                // promises: $http.get(SERVERURL.url + '/api/users/me/').success(function(data) {
                //     console.log("local storage" + JSON.stringify(localStorage[tokenName]));
                //     currentUser = data;
                //     return currentUser;
                // }).catch(
                //     function(data) {
                //         console.log("error" + JSON.stringify(data));
                //     }
                // ),


                promise: function(callback) {
                    var cb = callback || angular.noop;
                    var deferred = $q.defer();
                    if (localStorage[tokenName]) {
                        $http.get(SERVERURL.url + '/api/users/me/').then(success, error);

                        function success(data) {
                            //console.log("config route promise storage" + JSON.stringify(localStorage[tokenName]));
                            currentUser = data;
                            return currentUser;
                        }

                        function error(err) {
                            //console.log("error" + JSON.stringify(err));
                            return cb(err);
                        }
                        return deferred.promise;
                    } else return;
                },


                login: function(user, callback) {
                    var cb = callback || angular.noop;
                    var deferred = $q.defer();
                    $http.post(SERVERURL.url + '/auth/local', {
                        email: user.email,
                        password: user.password
                    }).then(success, error);

                    function success(data) {
                        // $cookieStore.put('token', data.data.token);
                        setToken(data.data.token);
                        console.log("her login");
                        currentUser = User.get();
                        deferred.resolve(data);
                        return currentUser;
                    }

                    function error(err) {
                        this.logout();
                        deferred.reject(err);
                        return cb(err);
                    }
                    return deferred.promise;
                },
                /**
                 * GetToken access token and user info
                 *
                 * @param  {Function}
                 */
                logout: function() {
                    // $cookieStore.remove('token');
                    //delete localStorage[tokenName];
                    deleteToken();

                    currentUser = {};
                },

                saveAttemptUrl: function() {
                    if ($location.path().toLowerCase() !== '/login' || $location.path().toLowerCase() !== '/signup') {
                        redirectToUrlAfterLogin.url = $location.path();
                    } else {
                        redirectToUrlAfterLogin.url = '/';
                    }
                },
                redirectToAttemptedUrl: function() {
                    $location.path(redirectToUrlAfterLogin.url);
                },
                /**
                 * Create a new user
                 *
                 * @param  {Object}   user     - user info
                 * @param  {Function} callback - optional
                 * @return {Promise}
                 */
                createUser: function(user, callback) {
                    var cb = callback || angular.noop;
                    return User.save(user,
                        function(data) {
                            localStorage[tokenName] = data.token
                            currentUser = User.get();
                            return cb(user);
                        },
                        function(err) {
                            this.logout();
                            return cb(err);
                        }.bind(this)).$promise;
                },

                /**
                 * Change password
                 *
                 * @param  {String}   oldPassword
                 * @param  {String}   newPassword
                 * @param  {Function} callback    - optional
                 * @return {Promise}
                 */
                changePassword: function(oldPassword, newPassword, callback) {
                    var cb = callback || angular.noop;

                    return User.changePassword({ id: currentUser._id }, {
                        oldPassword: oldPassword,
                        newPassword: newPassword
                    }, function(user) {
                        return cb(user);
                    }, function(err) {
                        return cb(err);
                    }).$promise;
                },

                /**
                 * Gets all available info on authenticated user
                 *
                 * @return {Object} user
                 */
                getCurrentUser: function() {
                    return currentUser;
                },

                /**
                 * Check if a user is logged in
                 *
                 * @return {Boolean}
                 */
                isLoggedIn: function() {
                    return currentUser.hasOwnProperty('name');
                },

                /**
                 * Waits for currentUser to resolve before checking if user is logged in
                 */
                isLoggedInAsync: function(cb) {
                    if (currentUser.hasOwnProperty('$promise')) {
                        currentUser.$promise.then(function() {
                            cb(true);
                        }).catch(function() {
                            cb(false);
                        });
                    } else if (currentUser.hasOwnProperty('role')) {
                        cb(true);
                    } else {
                        cb(false);
                    }
                },

                /**
                 * Check if a user is an admin
                 *
                 * @return {Boolean}
                 */
                isAdmin: function() {
                    return currentUser.role === 'admin';
                },

                /**
                 * Get auth token
                 */
                getToken: getToken,

                /**
                 * Set auth token
                 */
                setToken: setToken,

                /**
                 * delete auth token
                 */
                deleteToken: deleteToken

            };
        });

})();