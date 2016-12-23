(function() {
    /**
     * Controlador de las proyectos
     */
    angular.module('RDash').controller('ProyectosCtrl', function($scope, $mdDialog, $mdEditDialog, $location, Proyecto) {
        console.log('JLPO_CREACION_CONTROLADOR');
        $scope.selected = [];

        refresh();

        function refresh() {
            console.log('Entro JLPO');
            Proyecto.getAll().then(function(proyectos) {
                $scope.proyectos = proyectos;
            });
        }


        $scope.select = function(proyecto) {
            $scope.proyectoSelected = proyecto;
        };

        $scope.getProyectos = function() {
            $scope.promise = Proyecto.getAll().$promise;
        };

        $scope.editDescripcion = function(event, proyecto) {
            event.stopPropagation();

            var promise = $mdEditDialog.large({
                // messages: {
                //   test: 'I don\'t like tests!'
                // },
                modelValue: proyecto.descripcion,
                placeholder: 'Editar descripcion',
                save: function(input) {
                    proyecto.descripcion = input.$modelValue;
                },
                targetEvent: event,
                validators: {
                    'md-maxlength': 30
                }
            });
            console.log(proyecto);

            promise.then(function(ctrl) {
                var input = ctrl.getInput();

                input.$viewChangeListeners.push(function() {
                    input.$setValidity('test', input.$modelValue !== 'test');
                });
            });

            //$scope.promise = Proyecto.getAll().$promise;
        };


        $scope.query = {
            order: 'nombre',
            limit: 10,
            page: 1
        };

    });
})();
