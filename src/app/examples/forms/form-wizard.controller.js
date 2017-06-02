(function() {
    'use strict';

    angular
        .module('app.examples.forms')
        .controller('FormWizardController', FormWizardController);

    /* @ngInject */
    function FormWizardController(Auth, $rootScope, $mdToast, Cart, Order, APPNAME, $timeout, $window, $state) {
        var WizardController = this;
        $rootScope.isLogin = Auth.isLoggedIn;
        //$rootScope.Orders
        WizardController.user = Auth.currentUser;
        WizardController.data = {};
        WizardController.progress = 0;
        WizardController.selectedTab = null;
        WizardController.nextStep = nextStep;
        WizardController.nextStepDisabled = nextStepDisabled;
        WizardController.prevStep = prevStep;
        WizardController.prevStepDisabled = prevStepDisabled;
        WizardController.nextHide = nextHide;
        WizardController.prevHide = prevHide;
        WizardController.isFormValid = isFormValid;
        WizardController.activeTab = 0;
        WizardController.confirmTab = 1;
        WizardController.cod = cod;
        WizardController.homeState = homeState;
        WizardController.getTotalPrice = getTotalPrice;

        //#############################cart items and order items
        WizardController.cartItems = Cart.cart.items;

        console.log("isloggedIn       isloggedIn     " + JSON.stringify($rootScope.isLogin()));
        WizardController.changeTab = function() {
            //  WizardController.selectedTab = (WizardController.selectedTab + 1) % 3;
        }

        console.log("log in inside cntroller bahar" + $rootScope.isLogin());
        if ($rootScope.isLogin()) {
            console.log("log in inside cntroller" + $rootScope.isLogin());
            WizardController.progress = 50;
            WizardController.selectedTab = 1;
            WizardController.activeTab = 1;

        }

        var reload = function() {
            console.log("dekh lo paaji");
            $state.go('triangular.home');
            $window.location.reload();
        }

        function homeState() {
            $state.go('triangular.home');
        }

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

        function cod() {
            console.log("WizardController.cartItems   " + JSON.stringify(WizardController.cartItems));
            if (WizardController.cartItems.length === 0) {
                console.log("returning");
                $mdToast.show(
                    $mdToast.simple()
                    .content('Please add tems to the Cart!')
                    .position('top right')
                    .hideDelay(5000)
                );
                return;
            }
            var data = { phone: WizardController.data.address.phone, name: WizardController.data.address.name, address: WizardController.data.address.address, city: WizardController.data.address.city, payment: 'Pending', items: WizardController.cartItems, totalPrice: WizardController.getTotalPrice() }
            Order.save(data).$promise.then(
                function(val) {
                    $rootScope.Orders = Order.my.query({}, function(res) {
                        var total = 0;
                        for (var i = 0; i < res.length; i++) {
                            var subTotal = 0;
                            for (var j = 0; j < res[i].items.length; j++) {
                                subTotal += res[i].items[j].price * parseInt(res[i].items[j].quantity);
                                total += res[i].items[j].price * parseInt(res[i].items[j].quantity);
                            }
                            res[i].subTotal = subTotal;
                        }
                        res.total = total;
                        console.log("orders are   " + JSON.stringify($rootScope.Orders));
                    });
                    WizardController.progress = 100;
                    WizardController.confirmTab = 0;
                    WizardController.selectedTab = 2;
                    Cart.cart.clearItems();
                    //$state.go('triangular.home');
                    //$window.location.reload();
                });

            var msg = 'Processing Payment ...';
            console.log("msg " + msg);
        }


        function nextStep() {
            WizardController.selectedTab = WizardController.selectedTab + 1;
        }

        function nextStepDisabled() {
            switch (WizardController.selectedTab) {
                case 0:
                    return false;
                    break;
                case 1:
                    return true;
                    break;
                case 2:
                    return false;
            }

            // get current active form
            //  var form = $scope.triWizard.getForm(WizardController.selectedTab);
            //var formInvalid = true;
            // if (angular.isDefined(form) && angular.isDefined(form.$invalid)) {
            //     formInvalid = form.$invalid;
            // }
            //return formInvalid;
        }

        function isFormValid(step) {
            if (angular.isDefined(forms[step])) {
                return forms[step].$valid;
            }
        }

        function prevStep() {
            WizardController.selectedTab = WizardController.selectedTab - 1;
        }

        function prevStepDisabled() {
            switch (WizardController.selectedTab) {
                case 0:
                    return false;
                    break;
                case 1:
                    return false;
                    break;
                case 2:
                    return false;
            }

        }

        function nextHide() {
            switch (WizardController.selectedTab) {
                case 0:
                    return false;
                    break;
                case 1:
                    return false;
                    break;
                case 2:
                    return true;
            }
        }

        function prevHide() {
            switch (WizardController.selectedTab) {
                case 0:
                    return true;
                    break;
                case 1:
                    return false;
                    break;
                case 2:
                    return true;
            }
        }


    }
})();