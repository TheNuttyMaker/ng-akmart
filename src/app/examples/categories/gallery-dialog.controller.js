(function() {
    'use strict';

    angular
        .module('app.examples.categories')
        .controller('GalleryDialogController', GalleryDialogController);

    /* @ngInject */
    function GalleryDialogController($mdDialog, product) {
        var vm = this;
        //vm.currentImage = image;
        // vm.title = day;
        vm.product = product;
        vm.next = next;
        vm.prev = prev;
        console.log("iamge is " + vm.product.image);


        function next() {
            // var index = products.indexOf(vm.currentImage);
            // index = index + 1 < day.images.length ? index + 1 : 0;
            // vm.currentImage = day.images[index];
        };

        function prev() {
            // var index = day.images.indexOf(vm.currentImage);
            // index = index - 1 < 0 ? day.images.length - 1 : index - 1;
            // vm.currentImage = day.images[index];
        };
    };
})();