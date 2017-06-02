(function() {
    'use strict';

    angular
        .module('app.examples.threeD')
        .config(config);

    /* @ngInject */
    function config($stateProvider, triMenuProvider) {
        $stateProvider
            .state('triangular.threeD', {
                url: '/threeD',
                templateUrl: 'app/examples/threeD/threeD.tmpl.html',
                controller: 'ThreeDController',
                controllerAs: 'vm',
                data: {
                    layout: {
                        contentClass: 'layout-column',
                        toolbarSize: 'default',
                        toolbarShrink: false,
                        sideMenuSize: 'icon',
                        toolbarClass: '',
                        footer: false
                    }
                }
            });

        triMenuProvider.addMenu({
            name: ' 3D YourShop',
            state: 'triangular.threeD',
            type: 'link',
            image: 'assets/images/3d.png',
            priority: 2.2
        });
    }
})();