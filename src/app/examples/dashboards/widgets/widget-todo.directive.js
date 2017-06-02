(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .directive('todoWidget', todoWidget);

    /* @ngInject */
    function todoWidget() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            require: 'triWidget',
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope) {
            $scope.todos = [{
                name: 'Get Flat Rs 50 off for shopping of Rs 1000 or more.',
                done: false
            }, {
                name: 'Free Home Delivery for shopping above Rs 50.',
                done: true
            }, {
                name: 'Get Flat Rs 150 off for shopping of Rs 2000 or more.',
                done: false
            }, {
                name: 'Get Flat Rs 250 off for shopping of Rs 3000 or more.',
                done: false
            }];
        }
    }
})();