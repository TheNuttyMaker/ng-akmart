 (function() {
     'use strict';



     angular
         .module('app')
         .factory('Order', function Order($resource, User, $q, SERVERURL, APPNAME) {
             var obj = {};
             obj = $resource(SERVERURL.order + ':id', null, { 'update': { method: 'PUT' } });
             obj.my = $resource(SERVERURL.order + 'my', null, { 'update': { method: 'PUT' } });
             obj.all = $resource(SERVERURL.order + 'all', null, { method: 'GET' });
             obj.status = [
                 { name: 'Accepted', val: 201 },
                 { name: 'Delivered', val: 202 },
                 { name: 'Cancelled', val: 203 }
             ];
             return obj;
         });
 }());