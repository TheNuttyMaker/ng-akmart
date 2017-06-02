(function() {
    'use strict';

    angular
        .module('triangular.components')
        .controller('RightSidenavController', RightSidenavController);

    /* @ngInject */
    function RightSidenavController($scope, $rootScope, $injector, $http, $mdSidenav, $state, API_CONFIG, fireBaseData, $firebaseArray, $timeout, Cart, Order, Auth) {
        var vm = this;
        // sets the current active tab
        $rootScope.isLoggedIn = Auth.isLoggedIn;
        vm.close = close;
        vm.currentTab = 0;
        vm.checkoutState = checkoutState;
        vm.getTotalPrice = getTotalPrice;
        vm.cart = "Please login to add items to cart";
        vm.order = "Please login to see your orders";
        $rootScope.cart = Cart.cart;
        $rootScope.Orders = [];

        if ($rootScope.isLoggedIn()) {
            console.log("Inside orders" + $rootScope.isLoggedIn());
            $rootScope.Orders = Order.my.query({}, function(res) {});
        }

        $timeout(function() {
            if ($rootScope.Orders.length === 0 && $rootScope.isLoggedIn()) {
                $rootScope.Orders = Order.my.query({}, function(res) {});
            }

        }, 2000);

        function getTotalPrice() {
            var totalPrice = 0;
            if ($rootScope.cart.items) {
                for (var i = 0; i < $rootScope.cart.items.length; i++) {
                    if ($rootScope.cart.items[i]) {
                        totalPrice = totalPrice + $rootScope.cart.items[i].quantity * $rootScope.cart.items[i].price;
                    }
                }
            }
            return totalPrice;
        };

        /*        if ($injector.has('UserService')) {
                    var UserService = $injector.get('UserService');
                    //MAKE SURE WE'RE NOT ALREADY LOGGED ON
                    UserService.auth.$onAuthStateChanged(function(firebaseUser) {
                        // console.log('cuser ' + JSON.stringify(firebaseUser));
                        //console.log('cusernae ' + JSON.stringify(firebaseUser.email));
                        if (firebaseUser) {
                            vm.currentUser = {
                                displayName: firebaseUser.email,
                                username: firebaseUser.email,
                                avatar: 'assets/images/avatars/avatar-4.png',
                                roles: ['SUPERADMIN']
                            };
                        }

                    });

                }*/


        ////////////////
        vm.inc = function(item) {
            //console.log("inc " + JSON.stringify(item));
            Cart.cart.addItem(item, 1);
        };

        vm.dec = function(item) {
            Cart.cart.addItem(item, -1);
        };

        function checkoutState() {
            $state.go('triangular.forms-wizard');
            vm.close();
        }


        // add an event to switch tabs (used when user clicks a menu item before sidebar opens)
        $scope.$on('triSwitchNotificationTab', function($event, tab) {
            vm.currentTab = tab;
        });

        // fetch some dummy emails from the API
        /*        $http({
                    method: 'GET',
                    url: API_CONFIG.url + 'email/inbox'
                }).success(function(data) {
                    vm.emails = data.slice(1, 20);
                });*/


        // $http({
        //     method: 'GET',
        //     url: 'https://finemart.herokuapp.com/api/products/subcategory/111'
        // }).success(function(data) {
        //     //console.log("data is ss " + JSON.stringify(data));
        //     vm.emai = data.slice(1, 7);

        // });


        function close() {
            $mdSidenav('notifications').close();
        }



        // order function starts here     
    }
})();