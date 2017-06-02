(function() {
    'use strict';

    angular
        .module('app')
        .run(runFunction);

    /* @ngInject */
    function runFunction($rootScope, $state, Auth, User, APPNAME) {

        var tokenName = APPNAME.name + 'token';
        // if (localStorage[tokenName]) {
        //     Auth.promise;
        // }
        if (localStorage[tokenName]) {
            console.log("here start APpppppp run");
            Auth.currentUser = User.get();

            console.log("here start " + JSON.stringify(Auth.currentUser));
        }

        // this.$onInit = function() {
        Auth.isLoggedInAsync(function(login) {
            console.log("run fns " + login + "crrnt user " + JSON.stringify(Auth.getCurrentUser()));
            return login; // this is where you get the return value
        });
        // };


        // default redirect if access is denied
        function redirectError() {
            $state.go('500');
        }

        // watches

        // redirect all errors to permissions to 500
        var errorHandle = $rootScope.$on('$stateChangeError', redirectError);

        // remove watch on destroy
        $rootScope.$on('$destroy', function() {
            errorHandle();
        });
    }
})();