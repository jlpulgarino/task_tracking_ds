/*var checkLoggedin = function($q, $timeout, Http, $location, $rootScope, User) {
    var deferred = $q.defer();
    Http.get('/loggedin').then(function(user) {
        if (user === '0') {
            $timeout(function() {
                deferred.reject();
            }, 0);
            if ($location.url() !== '/') {
                $location.url('/');
            }
        } else {
            $timeout(deferred.resolve, 0);
            User.setUser(user);
        }
    });
};*/

/**
 * Se declara el modulo de la aplicacion y sus dependencias
 * @type {angular.Module}
 */
var app = angular.module('app', ['ngRoute', 'ngMaterial', 'ui.ace', 'angularResizable', 'ngFileUpload','md.data.table']);

/**
 * Configuracion del modulo de la aplicacion
 * Se determina el tema usado por Angular Material
 * Se determinan las rutas de la aplicacion
 * incluyendo los templates a usar en cada una y el controlador correspondiente
 */
app.config(function($routeProvider, $httpProvider, $mdThemingProvider) {
    $mdThemingProvider.theme('default').primaryPalette('blue-grey').accentPalette('orange').backgroundPalette('grey');
    moment.locale('es');
    $routeProvider
        .when('/proyectos', {
            controller: 'ProyectosCtrl',
            templateUrl: 'app/proyectos/proyectos.html'
        })
        .otherwise({
            controller: 'LoginCtrl',
            templateUrl: 'app/login/login.html',
            /*resolve: {
                loggedin: checkLoggedin
            }*/
        });
});
