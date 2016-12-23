var app = angular.module('app');

app.controller('LoginCtrl', function($rootScope, $scope, $location, $route, $mdDialog, User, EventHandler) {

    User.checkLoggedin();
    $scope.userLogin = {};

    $scope.login = function(credenciales) {
        var errorMessage = null;
        var username = credenciales.username;
        var password = credenciales.password;

        if (!username || username === "" || username === null) {
            errorMessage = 'Debe ingresar su usuario para realizar la autenticación';
        } else if (!password || password === "" || password === null) {
            errorMessage = 'Debe ingresar su contraseña para realizar la autenticación';
        }



        if (errorMessage) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Error en formulario de ingreso')
                .textContent(errorMessage)
                .ariaLabel('Alert Dialog Demo')
                .ok('Aceptar')
            );
        } else {
            User.login(credenciales);
        }



    };

    $scope.keyUpListener = function($event, credenciales) {
        if ($event.keyCode === 13) {
            $scope.login(credenciales);
        }
    };


});
