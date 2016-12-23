(function() {
    angular.module('RDash').service('Proyecto', function  ($rootScope, Http, EventHandler ) {
        console.log('JLPO_CREACION_SERVICIO');
        self = this;
        self.create = function(proyecto, file, progressCallback, endCallback) {
            Upload.upload({
                url: 'api/proyectos/',
                fields: proyecto
            }).progress(progressCallback).success(endCallback).error(EventHandler.error);
        };

        self.getAll = function(){
            return Http.get('proyectos');
        };

        self.get = function(proyectoId){
            return Http.get('proyectos/'+proyectoId);
        };

    });

})();
