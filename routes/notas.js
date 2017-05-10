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
    db.Nota.findById(req.params.id).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});
/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/ para obtener Todos los proyectos
 */
router.get('/', function(req, res, next) {
    db.Nota.findAll().then(function(resp) {
        return res.send(resp);
    }).catch(next);
});

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener Todos los proyectos
 * filtrados por nombre o descripcion.
 */
router.get('/tarea/:id', function(req, res, next) {
    db.Nota.findAll({
        where: { TareaId : req.params.id}
    }).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener Todos los proyectos
 */
router.delete('/:id', function(req, res, next) {
    db.Nota.findById(req.params.id).then(function(notaEliminada) {
        if (notaEliminada) {
            return notaEliminada.destroy().then(function() {
                return res.send('OK');
            });
        } else {
            return res.send('OK');
        }
    }).catch(next);
});


router.post('/', function(req, res, next) {

    var data = utils.getterFromPost(req);
    var notaEmulada = {
        id: data.get('id'),
        fecha: data.get('fecha', 'Debe seleccionar una fecha.'),
        texto: data.get('texto', 'Debe indicar texto.'),
        TareaId: data.get('TareaId', 'Debe seleccionar una tarea.')
    };

    db.Nota.save(notaEmulada).then(function(notaEmuladaActualizada) {
        res.send(notaEmuladaActualizada);
    }).catch(next);

});

module.exports = router;
