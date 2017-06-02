(function() {
    'use strict';

    angular
        .module('app.examples.home')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
            .state('triangular.home', {
                url: '/home',
                templateUrl: 'app/examples/home/home.tmpl.html',
                resolve: {
                    offers: function($firebase, $firebaseArray) {
                        var refOffer = firebase.database().ref().child('offers');
                        var todo = [];
                        todo = $firebaseArray(refOffer);
                        //console.log("todos in service  " + JSON.stringify(todo));
                        return todo;

                    },
                    products: ['FmartService', function(FmartService) {
                        return FmartService.getProducts('916')
                    }],

                    state: ['triBreadcrumbsService', 'triSettings', function(triBreadcrumbsService, triSettings) {
                        var name = triSettings.name;
                        triBreadcrumbsService.reset();
                        var crumb = { 'name': name }
                        triBreadcrumbsService.addCrumb(crumb);
                    }]
                },
                // set the controller to load for this page
                controller: 'HomeController',
                controllerAs: 'vm',
                // layout-column class added to make footer move to
                // bottom of the page on short pages
                // data: {
                //     layout: {
                //         contentClass: 'layout-column'
                //     }
                // }
            });

        // triMenuProvider.addMenu({
        //     name: 'Seed Module',
        //     icon: 'fa fa-tree',
        //     type: 'dropdown',
        //     priority: 1.1,
        //     children: [{
        //         name: 'Start Page',
        //         state: 'triangular.home',
        //         type: 'link'
        //     }]
        // });
    }
})();