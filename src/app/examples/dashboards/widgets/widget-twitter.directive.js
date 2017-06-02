(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .directive('twitterWidget', twitterWidget);

    /* @ngInject */
    function twitterWidget() {
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
            $scope.tweets = [{
                user: 'oxygenna',
                body: ' Don\'t miss it! The all new 3D Shop feature! Attract more customers  #3dshop #yourshopmanager'
            }, {
                user: 'oxygenna',
                body: 'Looking for a design for eCommerce to attract the clients? This one\'s worth $2.8 million.'
            }, {
                user: 'oxygenna',
                body: 'New android e-commerce mobile app! Your customers are mobile, are you?'
            }];

            $scope.selectedTab = 0;

            $scope.prevTweet = function() {
                $scope.selectedTab--;
                if ($scope.selectedTab < 0) {
                    $scope.selectedTab = $scope.tweets.length - 1;
                }
            };

            $scope.nextTweet = function() {
                $scope.selectedTab++;
                if ($scope.selectedTab === $scope.tweets.length) {
                    $scope.selectedTab = 0;
                }
            };
        }
    }
})();