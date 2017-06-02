(function() {
    'use strict';

    angular
        .module('app.examples.categories')
        .controller('CategoriesController', CategoriesController);

    /* @ngInject */
    function CategoriesController($http, $mdToast, triLoaderService, $mdDialog, products, Auth, Cart) {
        var oxygennaAPIUrl = 'http://api.oxygenna.com';

        var vm = this;
        vm.feed = [];
        vm.openImage = openImage;
        vm.products = products.data;
        vm.addToCart = addToCart;
        vm.checkCart = checkCart;
        vm.getQuantity = getQuantity;

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

    }
})();