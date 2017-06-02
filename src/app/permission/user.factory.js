(function() {
    'use strict';

    angular
        .module('app.permission')
        .factory('UserService', UserService)
        .factory('fireBaseData', fireBaseData)
        .factory('OfferService', OfferService);

    /* @ngInject */
    function UserService($q, $http, RoleStore, $firebaseAuth) {
        var auth = $firebaseAuth();
        var authData = null;
        var currentUser = {
            /*            displayName: 'Login',
                        username: 'login',
                        avatar: 'assets/images/avatars/avatar-5.png',
                        roles: ['']*/
        };

        var service = {
            getCurrentUser: getCurrentUser,
            getUsers: getUsers,
            hasPermission: hasPermission,
            login: login,

            register: register,
            logout: logout,
            requireAuthentication: requireAuthentication,
            isAuthenticated: isAuthenticated,
            getUser: getUser,
            auth: $firebaseAuth()

        };

        return service;

        ///////////////

        function getCurrentUser() {
            if (currentUser === undefined)
                return 0;
            return currentUser;
        }

        function login(user) {
            return auth
                .$signInWithEmailAndPassword(user.email, user.password)
                .then(storeAuthData);
        }

        function register(user) {
            return auth
                .$createUserWithEmailAndPassword(user.email, user.password)
                .then(storeAuthData);
        }

        function logout() {
            return auth
                .$signOut()
                .then(clearAuthData);
        }

        function requireAuthentication() {
            return auth
                .$waitForSignIn().then(onSignIn);
        }

        function isAuthenticated() {
            return !!authData;
        }

        function getUser() {
            if (authData) {
                return authData;
            }
        }

        function getUsers() {
            return $http.get('app/permission/data/users.json');
        }

        function hasPermission(permission) {
            var deferred = $q.defer();
            var hasPermission = false;

            // check if user has permission via its roles
            angular.forEach(currentUser.roles, function(role) {
                // check role exists
                if (RoleStore.hasRoleDefinition(role)) {
                    // get the role
                    var roles = RoleStore.getStore();

                    if (angular.isDefined(roles[role])) {
                        // check if the permission we are validating is in this role's permissions
                        if (-1 !== roles[role].validationFunction.indexOf(permission)) {
                            hasPermission = true;
                        }
                    }
                }
            });

            // if we have permission resolve otherwise reject the promise
            if (hasPermission) {
                deferred.resolve();
            } else {
                deferred.reject();
            }

            // return promise
            return deferred.promise;
        }

        /*        function login(username) {
                    // you would replace the code below with a call you your API
                    // request all users
                    return getUsers()
                    .then(function successCallback(response) {
                        var returnUser = getCurrentUser();
                        angular.forEach(response.data, function(user) {
                            if(user.username === username) {
                                returnUser = user;
                                currentUser = user;
                            }
                        });
                        return returnUser;
                    });
                }*/


        function storeAuthData(response) {

            // console.log('res ' + JSON.stringify(response));
            authData = response;
            currentUser.username = response.email;
            //console.log("username" + currentUser.username);
            return authData;
        }

        function onSignIn(user) {
            authData = user;
            return auth.$requireSignIn();
        }

        function clearAuthData() {
            authData = null;
            currentUser = {};
        }
    }



    function fireBaseData($firebase) {

        var ref = firebase.database().ref(),
            refCart = firebase.database().ref().child('cart'),
            refUser = firebase.database().ref().child('users'),
            refCategory = firebase.database().ref().child('category'),
            refOrder = firebase.database().ref().child('orders'),
            refOffer = firebase.database().ref().child('offers'),
            refFeatured = firebase.database().ref().child('featured'),
            refMenu = firebase.database().ref().child('menu');

        /*	var ref = new Firebase("https://foodkart-3c10a.firebaseio.com/"),
            refCart = new Firebase("https://foodkart-3c10a.firebaseio.com/cart"),
            refUser = new Firebase("https://foodkart-3c10a.firebaseio.com/users"),
            refCategory = new Firebase("https://foodkart-3c10a.firebaseio.com/category"),
            refOrder = new Firebase("https://foodkart-3c10a.firebaseio.com/orders"),
            refFeatured = new Firebase("https://foodkart-3c10a.firebaseio.com/featured"),
            refMenu = new Firebase("https://foodkart-3c10a.firebaseio.com/menu");*/
        return {
            ref: function() {
                return ref;
            },
            refCart: function() {
                return refCart;
            },
            refUser: function() {
                return refUser;
            },
            refCategory: function() {
                return refCategory;
            },
            refOrder: function() {
                return refOrder;
            },
            refOffer: function() {
                return refOffer;
            },
            refFeatured: function() {
                return refFeatured;
            },
            refMenu: function() {
                return refMenu;
            }
        }
    }


    /*.factory('sharedUtils', ['$ionicLoading', '$ionicPopup', function($ionicLoading, $ionicPopup) {


        var functionObj = {};

        functionObj.showLoading = function() {
            $ionicLoading.show({
                content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
                animation: 'fade-in', // The animation to use
                showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
                maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
                showDelay: 0 // The delay in showing the indicator
            });
        };
        functionObj.hideLoading = function() {
            $ionicLoading.hide();
        };


        functionObj.showAlert = function(title, message) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: message
            });
        };

        return functionObj;

    }])*/

    function OfferService(fireBaseData, $firebaseArray) {

        var uid; // uid is temporary user_id

        var offers = {}; // the main Object
        //Check if user already logged in
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                uid = user.uid;
                offers.items = $firebaseArray(fireBaseData.refOffer().child(uid));
            }
        });
        //Add to offers
        offers.add = function(item) {
            //check if item is already added or not
            fireBaseData.refOffer().child(uid).once("value", function(snapshot) {
                var name = "item" + item.product_id;

                if (snapshot.hasChild(name) == true) {

                    //if item is already in the offers
                    var currentQty = snapshot.child(name).val().item_qty;

                    fireBaseData.refOffer().child(uid).child(name).update({ // update
                        item_qty: currentQty + 1
                    });

                } else {

                    //if item is new in the offers
                    fireBaseData.refOffer().child(uid).child(name).set({ // set
                        item_name: item.name,
                        item_image: item.image,
                        item_price: item.price,
                        item_qty: 1
                    });
                }
            });
        };

        offers.drop = function(item_id) {
            fireBaseData.refOffer().child(uid).child(item_id).remove();
        };
        return offers;
    }





})();