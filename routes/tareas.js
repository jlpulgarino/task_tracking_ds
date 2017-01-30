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
        horas: data.get('horas', 'Debe seleccionar un numero de horas.'),
        SubproyectoId: data.get('SubproyectoId', 'Debe seleccionar un Subproyecto.'),
        ColaboradorId: data.get('ColaboradorId', 'Debe seleccionar un Colaborador.')
    };

    db.Tarea.save(tareaEmulada).then(function(tareaEmuladaActualizada) {
        res.send(tareaEmuladaActualizada);
    }).catch(next);

});

module.exports = router;
