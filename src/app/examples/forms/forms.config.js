(function() {
    'use strict';

    angular
        .module('app.examples.forms')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
            .state('triangular.forms-wizard', {
                url: '/forms/wizard',
                templateUrl: 'app/examples/forms/wizard.tmpl.html',
                // resolve: {
                //     'isLog': function(Auth) {
                //         return Auth.promise;
                //     }
                // },
                controller: 'FormWizardController',
                controllerAs: 'WizardController',
                data: {
                    layout: {
                        contentClass: 'layout-column full-image-background mb-bg-fb-02 background-overlay-static',
                        innerContentClass: 'overlay-gradient-20'
                    }
                }
            })

        // triMenuProvider.addMenu({
        //     name: 'Forms',
        //     icon: 'zmdi zmdi-calendar-check',
        //     type: 'dropdown',
        //     priority: 3.3,
        //     children: [{
        //         name: 'Wizard',
        //         type: 'link',
        //         state: 'triangular.forms-wizard'
        //     }]
        // });
        // triMenuProvider.addMenu({
        //     type: 'divider',
        //     priority: 3.4
        // });
    }
})();