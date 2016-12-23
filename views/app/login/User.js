/*jslint node: true */
angular.module('app').service('User', userService);

function userService($rootScope, $window, $location, Http, EventHandler) {
    var user = null;
    var self = this;


    self.getUser = function() {
        return user;
    };
    self.login = function(userLogin, callback) {
        Http.post('/login', userLogin).then(function(data, status, headers, config) {
            user = data;
            callback();
        });
    };
    self.checkLoggedin = function(userLogin) {
        Http.get('/loggedin').then(function(data, status, headers, config) {
            if (data !== '0') {
                user = data;
            }
        });
    };
    self.logout = function() {
        Http.post('/logout', {}).then(function(data, status, headers, config) {
            user = data;
        }).error(EventHandler.error);
    };
}
