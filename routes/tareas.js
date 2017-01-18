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
    db.Tarea.findById(req.params.id).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});
/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/ para obtener Todos los proyectos
 */
router.get('/', function(req, res, next) {
    db.Tarea.findAll().then(function(resp) {
        return res.send(resp);
    }).catch(next);
});

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener Todos los proyectos
 * filtrados por nombre o descripcion.
 */
router.get('/filtro/:parm', function(req, res, next) {
    db.Tarea.findAll({
        where: {
            $or: [{
                nombre: {
                    $like: '%' + req.params.parm + '%'
                }
            }, {
                descripcion: {
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
    db.Tarea.findById(req.params.id).then(function(subproyectoEliminado) {
        if (subproyectoEliminado) {
            return subproyectoEliminado.destroy().then(function() {
                return res.send('OK');
            });
        } else {
            return res.send('OK');
        }
    }).catch(next);
});


router.post('/', function(req, res, next) {

    var data = utils.getterFromPost(req);
    var tareaEmulada = {
        id: data.get('id'),
        nombre: data.get('nombre', 'Debe seleccionar un nombre para el subproyecto.'),
        descripcion: data.get('descripcion'),
        fecini: data.get('fecini'),
        fecfin: data.get('fecfin'),
        estado: data.get('estado'),
        SubproyectoId: data.get('SubproyectoId', 'Debe seleccionar un Subproyecto.'),
        ColaboradorId: data.get('ColaboradorId', 'Debe seleccionar un Colaborador.')
    };

    db.Tarea.save(tareaEmulada).then(function(tareaEmuladaActualizada) {
        res.send(tareaEmuladaActualizada);
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
