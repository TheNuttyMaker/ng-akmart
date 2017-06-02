(function() {
    'use strict';

    angular
        .module('app.examples.service', []);
})();

(function() {
    'use strict';

    angular
        .module('app.examples.service')
        .factory('FmartService', FmartService);

    /* @ngInject */
    function FmartService($q, $http, SERVERURL) {
        var products = {};
        var service = {
            getProducts: getProducts,
            getCategories: getCategories
        };
        console.log("fmartservice");

        return service;

        ///////////////


        function getProducts(subcategory) {
            console.log("inside getProducts service");
            //var url = 'https://finemart.herokuapp.com/api/products/subcategory/' + subcategory;
            var url = SERVERURL.url + '/api/products/subcategory/' + subcategory;
            console.log("url is " + url);
            return $http.get(url).
            success(function(products) {
                    console.log("data iss " + JSON.stringify(products.name));
                    return products;
                })
                .error(function(data, status, headers, config) {
                    console.log("error occured" + data + " status  " + status);
                });
        };

        /*        function getCategories() {
                    console.log("inside getCategories service");
                    var url = 'https://finemart.herokuapp.com/api/category/all';
                    return $http.get(url).
                    success(function(categories) {
                            //console.log("categories are " + JSON.stringify(categories));
                            return categories;
                        })
                        .error(function(data, status, headers, config) {
                            console.log("error occured" + data + " status  " + status);
                        });
                }*/


        function getCategories() {
            return $http.get('app/examples/categories/categories.json');
        };

        // function getCategories() {
        //     console.log("inside getCategories service");
        //     var url = 'http://localhost:9000/api/category/all';
        //     return $http.get(url).
        //     success(function(categories) {
        //             //console.log("categories are " + JSON.stringify(categories));
        //             return categories;
        //         })
        //         .error(function(data, status, headers, config) {
        //             console.log("error occured" + data + " status  " + status);
        //         });
        // }

    }
})();