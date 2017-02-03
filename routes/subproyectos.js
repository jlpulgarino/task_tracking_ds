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
    db.Subproyecto.findById(req.params.id).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});
/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/ para obtener Todos los proyectos
 */
router.get('/', function(req, res, next) {
    db.Subproyecto.findAll().then(function(resp) {
        return res.send(resp);
    }).catch(next);
});

router.get('/departamento/:id', function(req, res, next) {
    var filtroDepto = parseInt(req.params.id);
    var rangoDepartamento = [0,999999999];

    if(filtroDepto > 0){
        rangoDepartamento[0] = filtroDepto;
        rangoDepartamento[1] = filtroDepto;
    }

    db.Subproyecto.findAll({
        include: [{
            model: db.Proyecto
        }],
        where: {
            DepartamentoId: {
                        $between: rangoDepartamento
                }}
    }).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});


/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener Todos los proyectos
 * filtrados por nombre o descripcion.
 */
router.get('/filtro/:parm', function(req, res, next) {
    db.Subproyecto.findAll({
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
    db.Subproyecto.findById(req.params.id).then(function(subproyectoEliminado) {
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
    console.log('Estado subpry:'+data.get('estado'));
    var subproyectoEmulado = {
        id: data.get('id'),
        nombre: data.get('nombre', 'Debe seleccionar un nombre para el subproyecto.'),
        descripcion: data.get('descripcion'),
        estado: data.get('estado'),
        DepartamentoId: data.get('DepartamentoId', 'Debe seleccionar un departamento.'),
        ProyectoId: data.get('ProyectoId', 'Debe seleccionar un proyecto.')
    };

    db.Subproyecto.save(subproyectoEmulado).then(function(subproyectoEmuladoActualizado) {
        res.send(subproyectoEmuladoActualizado);
    }).catch(next);

});

/**
 * MANEJO DE TAREAS
 */

router.get('/:id/tareas/', function(req, res, next) {
    var subproyectoId = req.params.id;
    var subproyectoEmulado = db.Subproyecto.build({
        id: subproyectoId
    });
    return subproyectoEmulado.getTareas().then(function(tareas) {
        tareas.sort(function(a, b) {
            return a.id - b.id;
        });
        res.send(tareas);
    });
});
/*
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
