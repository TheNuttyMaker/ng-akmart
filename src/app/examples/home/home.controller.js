(function() {
    'use strict';

    angular
        .module('app.examples.home')
        .controller('HomeController', HomeController);

    /* @ngInject */
    function HomeController(products, $scope, offers, $firebase, $mdDialog, $firebaseArray, $mdToast, Auth, Cart) {
        var vm = this;
        //vm.todos1 = [{ "description": "Get Flat Rs 50 off for shopping of Rs 1000 or more.", "selected": true, "$id": "-KjxA8jqXVOXWMkzo4es", "$priority": null }, { "description": "Get Flat Rs 250 off for shopping of Rs 3000 or more.", "selected": false, "$id": "-KjxAK90qxFh1C2qSq7r", "$priority": null }, { "description": "hello", "selected": true, "$id": "-Kk3XwwXkNKBwhhNL-fG", "$priority": null }, { "description": "new", "selected": false, "$id": "-Kk3Xxj0cPDlxBi7fAoN", "$priority": null }];
        vm.products = products.data;
        vm.addToCart = addToCart;
        vm.checkCart = checkCart;
        vm.getQuantity = getQuantity;
        vm.openImage = openImage;

        function getQuantity(product_id) {
            for (var i = 0; i < Cart.cart.items.length; i++) {
                if (Cart.cart.items[i].product_id === product_id) {
                    return Cart.cart.items[i].quantity;
                }
            }
        };

        function checkCart(id) {
            if (!_.includes(Cart.cart.skuArray, id)) {
                //console.log("check cart " + id);
                return true;
            } else {
                return false;
            }
        };

        function addToCart(item, quantity) {
            //Check if user already logged in
            if (!Auth.isLoggedIn()) {
                vm.message = "Please login to add items to the cart!";
                $mdToast.show(
                    $mdToast.simple()
                    .content(vm.message)
                    .position('bottom right')
                    .hideDelay(3000)
                );
            } else {
                console.log("item" + JSON.stringify(item));
                Cart.cart.addItem(item, quantity);
            }
        }

        function openImage(product, $event) {
            $mdDialog.show({
                controller: 'GalleryDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/examples/categories/gallery-dialog.tmpl.html',
                clickOutsideToClose: true,
                focusOnOpen: false,
                targetEvent: $event,
                locals: {
                    product: product
                }
            });
        }

        //ss vm.initToutiaoSlide = initToutiaoSlide;
        var refOffer = firebase.database().ref().child('offers');
        //vm.todos1 = offers;
        //console.log("todos are  " + JSON.stringify(vm.todos1));
        function init() {
            //vm.todos = DashboardGeneralService.getTodos();
            //DashboardGeneralService.updateMenuBadge();
            vm.todos1 = $firebaseArray(refOffer);
            vm.todos1.$loaded().then(function() {

                // console.log("todos are  " + JSON.stringify(vm.todos1));  
                //updateMenuBadge(vm.todos);
            });
        }
        init();
    }
})();