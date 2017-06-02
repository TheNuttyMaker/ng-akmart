(function() {
    'use strict';

    angular
        .module('app.examples.categories')
        .run(categoriesRun);

    /* @ngInject */
    function categoriesRun($rootScope, $cookies, $state, categoriesProvider, triMenu, $http, $urlRouter, FmartService) {
        $http.get("app/examples/categories/data/categories.json").success(function(data) {
            data.forEach(function(category, key) {
                //console.log("category is " + category.image + "  key is " + key);
                var subarray = [];
                category.sub_categories.forEach(function(subcategory, subkey) {
                    categoriesProvider.addState(subcategory.category);
                    var obj = {
                        name: subcategory.name,
                        state: 'triangular.categories' + subcategory.category,
                        image: subcategory.image,
                        type: 'link'
                    };
                    subarray.push(obj);

                });
                triMenu.addMenu({
                    name: category.name,
                    type: 'dropdown',
                    priority: 4.0 + key,
                    image: category.image,
                    children: subarray
                });
            });
        });
    }
})();