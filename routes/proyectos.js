var allow = require('../services/allow');
var utils = require('../services/utils');
var db = require('../models');
var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
var moment = require('moment');

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener un proyecto particular
 */
router.get('/:id', function(req, res, next) {
    db.Proyecto.findById(req.params.id).then(function(resp) {
        return res.send(resp);
    }).catch(next);
});
/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/ para obtener Todos los proyectos
 */
router.get('/', function(req, res, next) {
    db.Proyecto.findAll().then(function(resp) {
        return res.send(resp);
    }).catch(next);
});

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener Todos los proyectos
 * filtrados por nombre o descripcion.
 */
router.get('/filtro/:parm', function(req, res, next) {
    db.Proyecto.findAll({
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
    console.log('Delete('+req.params.id+')');
    db.Proyecto.findById(req.params.id).then(function(proyectoEliminado) {
        if (proyectoEliminado) {
            return proyectoEliminado.destroy().then(function() {
                return res.send('OK');
            });
        } else {
            return res.send('OK');
        }
    }).catch(next);
});


router.post('/', function(req, res, next) {

    var data = utils.getterFromPost(req);
    var proyectoEmulado = {
        id: data.get('id'),
        nombre: data.get('nombre', 'El nombre es requerido'),
        descripcion: data.get('descripcion'),
        estado: data.get('estado')
    };

    db.Proyecto.save(proyectoEmulado).then(function(proyectoActualizado) {
        res.send(proyectoActualizado);
    }).catch(next);

});

/**
 * MANEJO DE SUBPROYECTOS
 */
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

router.get('/:id/gantt/:filtro', function(req, res, next) {
    var rangoProyecto = [0,999999999];
    var rangoSubproyecto = [0,999999999];
    var filtro = req.params.filtro;
    var camposFiltro = filtro.split('_');
    var filtroSbpry = parseInt(camposFiltro[1]);
    var filtroTarea = camposFiltro[2];
    if(req.params.id > 0){
        rangoProyecto[0] = req.params.id;
        rangoProyecto[1] = req.params.id;
    }
    if(filtroSbpry > 0){
        rangoSubproyecto[0] = filtroSbpry;
        rangoSubproyecto[1] = filtroSbpry;
    }
    if(filtroTarea == 'T'){
        filtroTarea = '%';
    }
    db.Proyecto.findAll({
    include: [{
        model: db.Subproyecto,
          include: [
            {
              model: db.Tarea,
              include: [
                  {
                      model: db.Colaborador
                  },
                  {
                      model: db.Registro
                  },
                  {
                      model: db.Estimacion
                  }
              ],
              where: {estado: {
                  $like: filtroTarea
              }}
            }
          ],
          where: {id: {
              $between: rangoSubproyecto
          }}
    }],
    where: {id: {
        $between: rangoProyecto
    }}
}).then(function(proyectos){
    console.log(proyectos);
    return proyectos;
}).then(proyectos => {
      const resObj = proyectos.map(proyecto => {

        //tidy up the proyecto data
        return Object.assign(
          {},
          {
            id: proyecto.id,
            nombre: proyecto.nombre,
            subproyectos: proyecto.Subproyectos.map(subproyecto => {

              //tidy up the subproyecto data
              return Object.assign(
                {},
                {
                  id: subproyecto.id,
                  nombre: subproyecto.nombre,
                  tareas: subproyecto.Tareas.map(tarea => {

                        //tidy up the subproyecto data
                        return Object.assign(
                          {},
                          {
                            id: tarea.id,
                            nombre: tarea.nombre,
                            estado: tarea.estado,
                            fecini: moment(new Date(tarea.fecini)).format("YYYY-MM-DD"),
                            fecfin: moment(new Date(tarea.fecfin)).format("YYYY-MM-DD"),
                            dias: moment(new Date(tarea.fecfin)).diff(moment(new Date(tarea.fecini)), 'days'),
                            colaborador: tarea.Colaborador,
                            registros: tarea.Registros.map(registro => {
                                return Object.assign(
                                  {},
                                  {
                                      id: registro.id,
                                      fecha: moment(new Date(registro.fecha)).format("YYYY-MM-DD"),
                                      horas: registro.horas
                                  })
                            }),
                            estimaciones: tarea.Estimacions.map(estimacion => {
                                return Object.assign(
                                  {},
                                  {
                                      id: estimacion.id,
                                      semana: estimacion.semana,
                                      porcentaje: estimacion.porcentaje
                                  })
                            })
                          }
                          )
                      })
                }
                )
            })
          }
        )
      });
      res.send(resObj)
      //res.send(proyectos)
    });
});

router.get('/:id/burndown/', function(req, res, next) {
    db.Proyecto.findAll({
    include: [{
        model: db.Subproyecto,
          include: [
            {
              model: db.Tarea
            }
          ]
    }]
}).then(proyectos => {
      const resObj = proyectos.map(proyecto => {

        //tidy up the proyecto data
        return Object.assign(
          {},
          {
            id: proyecto.id,
            nombre: proyecto.nombre,
            subproyectos: proyecto.Subproyectos.map(subproyecto => {

              //tidy up the subproyecto data
              return Object.assign(
                {},
                {
                  id: subproyecto.id,
                  nombre: subproyecto.nombre,
                  tareas: subproyecto.Tareas.map(tarea => {

                        //tidy up the subproyecto data
                        return Object.assign(
                          {},
                          {
                            id: tarea.id,
                            nombre: tarea.nombre,
                            estado: tarea.estado,
                            fecini: new Date(tarea.fecini),
                            fecfin: new Date(tarea.fecfin),
                            dias: moment(new Date(tarea.fecfin)).diff(moment(new Date(tarea.fecini)), 'days')
                          }
                          )
                      })
                }
                )
            })
          }
        )
      });
      res.send(resObj)
    });
});


router.post('/:id/subproyectos/', function(req, res, next) {
    var proyectoId = req.params.id;
    var data = utils.getterFromPost(req);
    var subproyecto = {
        id: data.get('id'),
        nombre: data.get('nombre', 'Debe seleccionar un nombre para el subproyecto.'),
        estado: data.get('estado'),
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


module.exports = router;
