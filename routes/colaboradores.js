var allow = require('../services/allow');
var utils = require('../services/utils');
var db = require('../models');
var Promise = require('bluebird');
var express = require('express');
var router = express.Router();

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener un proyecto particular
 */
router.get('/:id', function(req, res, next) {
    db.Colaborador.findById(req.params.id).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});
/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/ para obtener Todos los proyectos
 */
router.get('/', function(req, res, next) {
    db.Colaborador.findAll().then(function(resp) {
        return res.send(resp);
    }).catch(next);
});

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener Todos los proyectos
 * filtrados por nombre o descripcion.
 */
router.get('/filtro/:parm', function(req, res, next) {
    db.Colaborador.findAll({
        where: {
            $or: [{
                nombre: {
                    $like: '%' + req.params.parm + '%'
                }
            }, {
                cargo: {
                    $like: '%' + req.params.parm + '%'
                }
            }]
        }
    }).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener Todos los proyectos
 */
router.delete('/:id', function(req, res, next) {
    db.Colaborador.findById(req.params.id).then(function(colaboradorEliminado) {
        if (colaboradorEliminado) {
            return colaboradorEliminado.destroy().then(function() {
                return res.send('OK');
            });
        } else {
            return res.send('OK');
        }
    }).catch(next);
});


router.post('/', function(req, res, next) {

    var data = utils.getterFromPost(req);
    var colaboradorEmulado = {
        id: data.get('id'),
        usuario: data.get('usuario', 'Debe seleccionar un usuario para el colaborador.'),
        nombre: data.get('nombre', 'Debe seleccionar un nombre para el colaborador.'),
        rol: data.get('rol', 'Debe seleccionar un rol para el colaborador.'),
        cargo: data.get('cargo', 'Debe seleccionar un cargo para el colaborador.'),
        email: data.get('email', 'Debe seleccionar un rol email el colaborador.'),
        password: data.get('password', 'Debe seleccionar un password para el colaborador.'),
        DepartamentoId: data.get('DepartamentoId', 'Debe seleccionar un Departamento.')
    };

    db.Colaborador.save(colaboradorEmulado).then(function(colaboradorActualizado) {
        res.send(colaboradorActualizado);
    }).catch(next);

});

/**
 * MANEJO DE TAREAS
 */
 /*
router.get('/:id/subproyectos/', function(req, res, next) {
    var proyectoId = req.params.id;
    var proyectoEmulado = db.Proyecto.build({
        id: proyectoId
    });
    return proyectoEmulado.getSubproyectos().then(function(subproyectos) {
        subproyectos.sort(function(a, b) {
            return a.id - b.id;
        });
        res.send(subproyectos);
    });
});

router.post('/:id/subproyectos/', function(req, res, next) {
    var proyectoId = req.params.id;
    var data = utils.getterFromPost(req);
    var subproyecto = {
        id: data.get('id'),
        nombre: data.get('nombre', 'Debe seleccionar un nombre para el subproyecto.'),
        descripcion: data.get('descripcion'),
        DepartamentoId: data.get('DepartamentoId', 'Debe seleccionar un departamento.')
    };


    var proyectoEmulado = db.Proyecto.build({
        id: proyectoId
    });
    var subproyectoCreado;
    return db.Subproyecto.save(subproyecto).then(function(subproyectoCreatedP) {
        subproyectoCreado = subproyectoCreatedP;
        return subproyectoCreado;
    }).then(function() {
        console.log('proyecto[' + proyectoEmulado.id + '], subproyectoCreado.id=' + subproyectoCreado.id);
        return proyectoEmulado.addSubproyecto(subproyectoCreado.id, subproyectoCreado);
    }).then(function() {
        res.send(subproyectoCreado);
    }).catch(next);
});

router.delete('/:proyectoId/subproyectos/:id', function(req, res, next) {
    var proyectoId = req.params.proyectoId;
    var subproyectoId = req.params.id;
    var subproyecto = db.Subproyecto.build({
        id: subproyectoId
    });

    subproyecto.destroy().then(function() {
        return res.send('OK');
    }).catch(next);

});

*/
module.exports = router;
