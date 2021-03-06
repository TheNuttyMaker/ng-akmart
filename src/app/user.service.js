(function() {
    'use strict';

    angular
        .module('app')
        .factory('User', function($resource, SERVERURL) {
            //if (localStorage['AKFOODMARTtoken']) {

            return $resource(SERVERURL.url + '/api/users/:id/:controller', {
                id: '@_id'
            }, {
                changePassword: {
                    method: 'PUT',
                    params: {
                        controller: 'password'
                    }
                },
                get: {
                    method: 'GET',
                    params: {
                        id: 'me'
                    }
                }
            });
            // } else return {};
        });

})();