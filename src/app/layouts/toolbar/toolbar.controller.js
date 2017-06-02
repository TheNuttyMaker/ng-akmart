(function() {
    'use strict';

    angular
        .module('triangular.components')
        .controller('ToolbarController', DefaultToolbarController);

    /* @ngInject */
    function DefaultToolbarController($scope, $injector, $rootScope, $mdMenu, $mdMedia, $state, $element, $filter, $mdUtil, $mdSidenav, $mdToast, $timeout, $document, triBreadcrumbsService, triSettings, triLayout, $mdDialog, $location, Auth, User, Cart, $window) {

        // this.$onInit = function() {
        //     Auth.isLoggedInAsync(function(login) {
        //         console.log("lkjhgfdsdfghjjhgfdfghjjhgfd " + login);
        //         return login; // this is where you get the return value
        //     });
        // };
        var vm = this;
        vm.breadcrumbs = triBreadcrumbsService.breadcrumbs;
        vm.emailNew = false;
        vm.languages = triSettings.languages;
        vm.appName = triSettings.name;
        vm.openSideNav = openSideNav;
        vm.hideMenuButton = hideMenuButton;
        vm.switchLanguage = switchLanguage;
        vm.toggleNotificationsTab = toggleNotificationsTab;
        vm.isFullScreen = false;
        vm.fullScreenIcon = 'zmdi zmdi-fullscreen';
        vm.toggleFullScreen = toggleFullScreen;
        vm.showLoginDialog = showLoginDialog;
        vm.logout = logout;
        vm.login = false;
        vm.getCurrentUser = Auth.getCurrentUser;
        // vm.checkCart = checkCart;
        $rootScope.cart = Cart.cart;
        vm.getTotalQuantity = getTotalQuantity;
        vm.totalQuantity = 0;
        $rootScope.isLoggedIn = Auth.isLoggedIn;
        $rootScope.isAdmin = Auth.isAdmin;
        // create blank user variable for login form
        vm.user = {
            name: '',
            email: '',
            password: ''
        };
        vm.avatar = 'assets/images/avatars/avatar-4.png';
        console.log("log in inside cntroller bahar" + $rootScope.isLoggedIn());
        if ($rootScope.isLoggedIn()) {
            console.log("log in inside cntroller" + $rootScope.isLoggedIn());
        }

        // if ($injector.has('UserService')) {
        //     var UserService = $injector.get('UserService');
        //     //MAKE SURE WE'RE NOT ALREADY LOGGED ON
        //     UserService.auth.$onAuthStateChanged(function(firebaseUser) {
        //         //console.log('cuser ' + JSON.stringify(firebaseUser));
        //         //console.log('cusernae ' + JSON.stringify(firebaseUser.email));
        //         if (firebaseUser) {
        //             vm.currentUser = {
        //                 displayName: firebaseUser.email,
        //                 username: firebaseUser.email,
        //                 avatar: 'assets/images/avatars/avatar-4.png',
        //                 roles: ['SUPERADMIN']
        //             };
        //         }

        //     });

        // } 

        ////////////////
        //get cart items 
        //new  console.log("cart inside  " + $rootScope.totalQuantity);
        function getTotalQuantity() {
            // Cart.cart.loadItems();
            vm.totalQuantity = 0;
            if ($rootScope.cart.items) {
                for (var i = 0; i < $rootScope.cart.items.length; i++) {
                    if ($rootScope.cart.items[i]) {
                        vm.totalQuantity = vm.totalQuantity + $rootScope.cart.items[i].quantity;
                    }
                }
            }
            return vm.totalQuantity;
        };
        $timeout(function() {
            if (Cart.cart.items.length === 0)
                Cart.cart.loadItems()
            if (vm.totalQuantity === 0)
                getTotalQuantity();
        }, 2000);
        $timeout(function() {
            if (Cart.cart.items.length === 0)
                Cart.cart.loadItems()
            if (vm.totalQuantity === 0)
                getTotalQuantity();
        }, 3000);
        $timeout(function() {
            if (Cart.cart.items.length === 0)
                Cart.cart.loadItems()
            if (vm.totalQuantity === 0)
                getTotalQuantity();
        }, 5000);
        //getTotalQuantity();

        function showLoginDialog($event) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
            $mdDialog.show({
                targetEvent: $event,
                controller: function($timeout, $q, $scope, $mdDialog) {
                    var user = this;
                    $scope.cancel = function($event) {
                        $mdDialog.cancel();
                    };
                    $scope.finish = function($event) {
                        $mdDialog.hide();
                    };
                    $scope.answer = function(answer) {
                        var user = {
                            email: answer.email,
                            password: answer.password
                        };
                        //console.log('event  '+ JSON.stringify(user));
                        return UserService
                            .login(user)
                            .then(function() {
                                $mdDialog.hide(answer);
                                vm.currentUser = {
                                    displayName: user.email,
                                    username: user.email,
                                    avatar: 'assets/images/avatars/avatar-4.png',
                                    roles: ['SUPERADMIN']
                                };
                                //$state.go('triangular.dashboard-social');
                                // console.log("" + JSON.stringify(answer));
                                $mdToast.show(
                                    $mdToast.simple()
                                    .content('Welcome ' + user.email + '!')
                                    .position('bottom right')
                                    .hideDelay(5000)
                                );
                            }, function(reason) {
                                vm.error = reason.message;
                                $mdToast.show(
                                    $mdToast.simple()
                                    .content(vm.error)
                                    .position('bottom right')
                                    .hideDelay(5000)
                                );
                            });



                    };

                    //shopnxnew
                    $scope.signin = function(signin) {
                        $scope.submitted = true;
                        console.log("user is " + JSON.stringify(signin));

                        Auth.login({
                                email: signin.email,
                                password: signin.password
                            })
                            .then(function() {
                                // Account created, redirect to the page with requested a signup
                                console.log("log in success");
                                $mdDialog.hide(signin);

                                vm.acurrentUser = User.get();
                                console.log("from auth service" + JSON.stringify(vm.acurrentUser));
                                vm.currentUser = {
                                    displayName: user.name,
                                    username: user.email,
                                    avatar: 'assets/images/avatars/avatar-4.png',
                                    roles: ['SUPERADMIN']
                                };
                                //$state.go('triangular.dashboard-social');
                                // console.log("" + JSON.stringify(register));
                                $state.go('triangular.home');
                                $window.location.reload();
                                $mdToast.show(
                                    $mdToast.simple()
                                    .content('Welcome ' + user.email + '!')
                                    .position('bottom right')
                                    .hideDelay(5000)
                                );
                            })

                        .catch(function(err) {
                            //err = err.data;
                            vm.error = err.data;
                            $mdToast.show(
                                $mdToast.simple()
                                .content(vm.error)
                                .position('bottom right')
                                .hideDelay(5000)
                            );
                            // Update validity of form fields that match the mongoose errors
                            //   angular.forEach(err.errors, function(error, field) {
                            //     form[field].$setValidity('mongoose', false);
                            //     $scope.errors[field] = error.message;
                            //   });
                        });

                    };


                    $scope.register = function(register) {
                        $scope.submitted = true;
                        console.log("user is " + JSON.stringify(register));

                        Auth.createUser({
                                name: register.name,
                                email: register.email,
                                password: register.password
                            })
                            .then(function(data) {
                                // Account created, redirect to the page with requested a signup
                                console.log("sign up success" + data);
                                $mdDialog.cancel();
                                $mdToast.show(
                                    $mdToast.simple()
                                    .content('Welcome ' + register.name + '!')
                                    .position('bottom right')
                                    .hideDelay(5000)
                                );
                            })
                            .catch(function(err) {
                                //err = err.data;
                                vm.error = err.data;
                                $mdToast.show(
                                    $mdToast.simple()
                                    .content(vm.error)
                                    .position('bottom right')
                                    .hideDelay(5000)
                                );
                                // Update validity of form fields that match the mongoose errors
                                //   angular.forEach(err.errors, function(error, field) {
                                //     form[field].$setValidity('mongoose', false);
                                //     $scope.errors[field] = error.message;
                                //   });
                            });

                    };
                },
                controllerAs: 'user',
                clickOutsideToClose: true,
                preserveScope: true,
                fullscreen: true,
                templateUrl: 'tabDialog.tmpl.html'
            });
        };

        function openSideNav(navID) {
            $mdUtil.debounce(function() {
                $mdSidenav(navID).toggle();
            }, 300)();
        }

        function logout() {
            Auth.logout();
            $window.location.reload();
        }

        function switchLanguage(languageCode) {
            if ($injector.has('$translate')) {
                var $translate = $injector.get('$translate');
                $translate.use(languageCode)
                    .then(function() {
                        $mdToast.show(
                            $mdToast.simple()
                            .content($filter('triTranslate')('Language Changed'))
                            .position('bottom right')
                            .hideDelay(500)
                        );
                        $rootScope.$emit('changeTitle');
                    });
            }
        }

        function hideMenuButton() {
            switch (triLayout.layout.sideMenuSize) {
                case 'hidden':
                    // always show button if menu is hidden
                    return false;
                case 'off':
                    // never show button if menu is turned off
                    return true;
                default:
                    // show the menu button when screen is mobile and menu is hidden
                    return $mdMedia('gt-sm');
            }
        }

        function toggleNotificationsTab(tab) {
            $rootScope.$broadcast('triSwitchNotificationTab', tab);
            vm.openSideNav('notifications');
        }

        function toggleFullScreen() {
            vm.isFullScreen = !vm.isFullScreen;
            vm.fullScreenIcon = vm.isFullScreen ? 'zmdi zmdi-fullscreen-exit' : 'zmdi zmdi-fullscreen';
            // more info here: https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
            var doc = $document[0];
            if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
                if (doc.documentElement.requestFullscreen) {
                    doc.documentElement.requestFullscreen();
                } else if (doc.documentElement.msRequestFullscreen) {
                    doc.documentElement.msRequestFullscreen();
                } else if (doc.documentElement.mozRequestFullScreen) {
                    doc.documentElement.mozRequestFullScreen();
                } else if (doc.documentElement.webkitRequestFullscreen) {
                    doc.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (doc.exitFullscreen) {
                    doc.exitFullscreen();
                } else if (doc.msExitFullscreen) {
                    doc.msExitFullscreen();
                } else if (doc.mozCancelFullScreen) {
                    doc.mozCancelFullScreen();
                } else if (doc.webkitExitFullscreen) {
                    doc.webkitExitFullscreen();
                }
            }
        }

        // function stateHome() {
        //     console.log("state is " + $state.current.name);
        //     if ($state.current.name === "triangular.home") {
        //         //triBreadcrumbsService.addCrumb("AK Food Mart");
        //         return false;
        //     } else return false;
        // }

        $scope.$on('newMailNotification', function() {
            vm.emailNew = true;
        });
    }
})();