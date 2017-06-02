(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .config(moduleConfig);

    /* @ngInject */
    function moduleConfig($stateProvider, triMenuProvider) {

        $stateProvider
            .state('triangular.sales-layout', {
                abstract: true,
                views: {
                    sidebarLeft: {
                        templateUrl: 'app/layouts/leftsidenav/leftsidenav.tmpl.html',
                        controller: 'MenuController',
                        controllerAs: 'vm'
                    },
                    content: {
                        template: '<div id="admin-panel-content-view" flex ui-view></div>'
                    },
                    belowContent: {
                        template: '<div ui-view="belowContent"></div>'
                    }
                }
            })
            // .state('triangular.dashboard-general', {
            //     url: '/dashboards/general',
            //     templateUrl: 'app/examples/dashboards/general/dashboard-general.tmpl.html'
            // })
            .state('triangular.dashboard-general', {
                url: '/dashboards/offers',
                templateUrl: 'app/examples/dashboards/general/dashboard-general.tmpl.html',
                controller: 'DashboardGeneralController',
                controllerAs: 'vm',
                data: {
                    layout: {
                        contentClass: 'layout-column full-image-background mb-bg-fb-08 background-overlay-static',
                        innerContentClass: 'overlay-gradient-20'
                    }
                }
            })
            .state('triangular.dashboard-analytics', {
                url: '/dashboards/analytics',
                templateUrl: 'app/examples/dashboards/analytics/dashboard-analytics.tmpl.html',
                controller: 'DashboardAnalyticsController',
                controllerAs: 'vm'
            })
            .state('triangular.dashboard-server', {
                url: '/dashboards/server',
                templateUrl: 'app/examples/dashboards/server/dashboard-server.tmpl.html',
                controller: 'DashboardServerController',
                controllerAs: 'vm'
            })
            .state('triangular.dashboard-widgets', {
                url: '/dashboards/widgets',
                templateUrl: 'app/examples/dashboards/widgets.tmpl.html'
            })
            .state('triangular.dashboard-social', {
                url: '/dashboards/social',
                templateUrl: 'app/examples/dashboards/social/dashboard-social.tmpl.html',
                controller: 'DashboardSocialController',
                controllerAs: 'vm'
            })
            .state('triangular.dashboard-sales', {
                url: '/dashboards/sales',
                // data: {
                //     layout: {
                //         showToolbar: false
                //     }
                // },
                resolve: {
                    'isLoggedIn': function(Auth) {
                        return Auth.promise;
                    }
                },
                views: {
                    '': {
                        templateUrl: 'app/examples/dashboards/sales/dashboard-sales.tmpl.html',
                        controller: 'DashboardSalesController',
                        controllerAs: 'vm'
                    },
                    'belowContent': {
                        templateUrl: 'app/examples/dashboards/sales/fab-button.tmpl.html',
                        controller: 'SalesFabController',
                        controllerAs: 'vm'
                    }
                }
            })
            .state('triangular.dashboard-draggable', {
                url: '/dashboards/draggable-widgets',
                templateUrl: 'app/examples/dashboards/dashboard-draggable.tmpl.html',
                controller: 'DashboardDraggableController',
                controllerAs: 'vm'
            });

        triMenuProvider.addMenu({
            name: 'Dashboards',
            icon: 'zmdi zmdi-home',
            type: 'dropdown',
            priority: 1.1,
            children: [{
                    name: 'Analytics',
                    state: 'triangular.dashboard-analytics',
                    type: 'link'
                },
                // {
                //     name: 'General',
                //     state: 'triangular.dashboard-general',
                //     type: 'link'
                // },
                {
                    id: 'General',
                    name: 'Offers',
                    state: 'triangular.dashboard-general',
                    type: 'link',
                    badge: ''
                },
                {
                    name: 'Sales',
                    state: 'triangular.dashboard-sales',
                    type: 'link'
                },
                {
                    name: 'Server',
                    state: 'triangular.dashboard-server',
                    type: 'link'
                }
                /*                , {
                                    name: 'Social',
                                    state: 'triangular.dashboard-social',
                                    type: 'link'
                                }
                                            ,{
                                                name: 'Widgets',
                                                state: 'triangular.dashboard-widgets',
                                                type: 'link'
                                            }
                                            ,{
                                                name: 'Draggable',
                                                state: 'triangular.dashboard-draggable',
                                                type: 'link'
                                            }*/
            ]
        });

    }
})();