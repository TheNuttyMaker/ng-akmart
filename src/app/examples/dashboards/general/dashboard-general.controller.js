(function() {
    'use strict';

    angular
        .module('app.examples.dashboards')
        .controller('DashboardGeneralController', DashboardGeneralController);

    /* @ngInject */
    function DashboardGeneralController($scope, $state, $mdDialog, $firebase, $firebaseArray, triMenu) {
        var vm = this;
        vm.item = {
            description: '',
            selected: true
        };
        var refOffer = firebase.database().ref().child('offers');
        var todoMenu = triMenu.getMenu('General');

        vm.orderTodos = orderTodos;
        vm.removeTodo = removeTodo;
        vm.addTodo = addTodo;
        vm.todoSelected = todoSelected;

        //////////////////////////

        function init() {
            //vm.todos = DashboardGeneralService.getTodos();
            //DashboardGeneralService.updateMenuBadge();
            vm.todos = $firebaseArray(refOffer);
            vm.todos.$loaded().then(function() {
                updateMenuBadge(vm.todos);
            });


        }

        function orderTodos(task) {
            switch (task.priority) {
                case 'high':
                    return 1;
                case 'medium':
                    return 2;
                case 'low':
                    return 3;
                default: // no priority set
                    return 4;
            }
        }

        function addTodo(todo) {
            var newTodo = vm.item.description.trim();
            if (!newTodo.length) {
                return;
            }
            vm.todos.$add(todo).then(function(ref) {
                updateMenuBadge(vm.todos);
                vm.item.description = "";
            });
        }

        function removeTodo(todo) {
            vm.todos.$remove(todo).then(function(ref) {
                updateMenuBadge(vm.todos);
            });
        }

        function todoSelected(todo) {
            vm.todos.$save(todo).then(function(ref) {
                updateMenuBadge(vm.todos);
            });

        }

        // init

        init();

        // watches

        // $scope.$on('addTodo', function(ev) {
        //     $mdDialog.show({
        //             templateUrl: 'app/examples/dashboards/general/add-todo-dialog.tmpl.html',
        //             targetEvent: ev,
        //             controller: 'DialogController',
        //             controllerAs: 'vm'
        //         })
        //         .then(function(newTodo) {
        //             vm.todos.$add(todo);
        //             //DashboardGeneralService.addTodo(newTodo);
        //         });
        // });

        function todoCount(todos) {
            var count = 0;
            for (var i = todos.length - 1; i >= 0; i--) {
                if (todos[i].selected === false) {
                    count++;
                }
            }
            return todos.length - count;
        }

        function updateMenuBadge(todo) {
            todoMenu.badge = todoCount(todo);
        }
    }
})();