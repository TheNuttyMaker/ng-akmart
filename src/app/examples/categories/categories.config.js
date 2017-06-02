(function() {
    'use strict';

    angular
        .module('app.examples.categories')
        .provider('categoriesProvider', provider);

    /* @ngInject */
    function provider($stateProvider, triMenuProvider) {
        // runtime dependencies for the service can be injected here, at the provider.$get() function.
        this.$get = function($state) { // for example
            return {
                addState: function(title) {
                    //console.log("here 1 " + title);
                    $stateProvider.state('triangular.categories' + title, {
                        resolve: {
                            products: ['FmartService', function(FmartService) {
                                return FmartService.getProducts(title)
                            }]
                        },
                        url: '/categories/' + title,
                        templateUrl: 'app/examples/categories/categories.tmpl.html',
                        controller: 'CategoriesController',
                        controllerAs: 'vm'
                    });
                }
            };
        }
    };


})();