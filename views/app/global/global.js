var app = angular.module('app');

app.service('utils', function() {
    return {

        dateFromObjectId: function (objectId) {
            return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
        }

    };

});
/**
 * Directiva de funcionalidad y elementos globales para la aplicación
 */
app.directive('dirGlobal', function(){
  return {
    restrict: 'E',
    templateUrl: 'app/global/global.html',
    controller: function($scope, $location, $sce, $rootScope, $mdDialog, User, EventHandler){
        $scope.AppName = 'Cupireservas';
        $scope.allow = User.allow;

        //All functions in this module are exported to $rootScope.utils to be accessed from all modules
        $rootScope.utils = {
            isMobile: isMobile()
        };

        EventHandler.addErrorListener(function(error, status){
          $mdDialog.show(
              $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Mensaje de error')
              .textContent(error.message)
              .ariaLabel('Alert Dialog')
              .ok('Aceptar')
          );
        });

        /* Used to detect whether the users browser is an mobile browser */
        function isMobile() {
            if (sessionStorage.desktop) /* desktop storage */
                return false;
            else if (localStorage.mobile) /* mobile storage */
                return true;

            /* alternative */
            var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile'];
            for (var i in mobile)
                if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0)
                    return true;

                /* nothing found.. assume desktop */
                return false;
            }
        }
    };
});
