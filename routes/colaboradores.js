var allow = require('../services/allow');
var utils = require('../services/utils');
var db = require('../models');
var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
var bcrypt   = require('bcrypt-nodejs');
var passport = require('passport');
var moment = require('moment');

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
 * filtrados por nombre o descripcion.
 */
/*
 router.post('/login', passport.authenticate('local-login', {
     successRedirect : '/profile', // redirect to the secure profile section
     failureRedirect : '/colaboradores/login', // redirect back to the signup page if there is an error
     failureFlash : true // allow flash messages
 }));
*/
router.post('/login', function(req, res, next) {
    var data = utils.getterFromPost(req);
    var usuarioForm = data.get('username', 'Debe seleccionar un usuario para el colaborador.');
    var passwordForm = data.get('password', 'Debe seleccionar un password para el colaborador.');

    db.Colaborador.findAll({
        where: {
            $and: [{
                usuario: {
                    $eq: usuarioForm
                }
            }, {
                password: {
                    $eq: passwordForm
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
    var contrasena = data.get('password', 'Debe seleccionar un password para el colaborador.');
    /*contrasena = bcrypt.hashSync(contrasena, bcrypt.genSaltSync(8), null);*/
    var colaboradorEmulado = {
        id: data.get('id'),
        usuario: data.get('usuario', 'Debe seleccionar un usuario para el colaborador.'),
        nombre: data.get('nombre', 'Debe seleccionar un nombre para el colaborador.'),
        rol: data.get('rol', 'Debe seleccionar un rol para el colaborador.'),
        cargo: data.get('cargo', 'Debe seleccionar un cargo para el colaborador.'),
        email: data.get('email', 'Debe seleccionar un rol email el colaborador.'),
        password: contrasena,
        DepartamentoId: data.get('DepartamentoId', 'Debe seleccionar un Departamento.')
    };

    db.Colaborador.save(colaboradorEmulado).then(function(colaboradorActualizado) {
        res.send(colaboradorActualizado);
    }).catch(next);

});

router.get('/:id/tareas/:filtro', function(req, res, next) {
    var rangoProyecto = [0,999999999];
    var rangoSubproyecto = [0,999999999];
    var rangoColaborador = [0,999999999];
    var filtro = req.params.filtro;
    var camposFiltro = filtro.split('_');
    var filtroPry = camposFiltro[0];
    var filtroSbpry = parseInt(camposFiltro[1]);
    var filtroTarea = camposFiltro[2];
    if(req.params.id > 0){
        rangoColaborador[0] = req.params.id;
        rangoColaborador[1] = req.params.id;
    }
    if(filtroSbpry > 0){
        rangoSubproyecto[0] = filtroSbpry;
        rangoSubproyecto[1] = filtroSbpry;
    }
    if(filtroTarea == 'T'){
        filtroTarea = '%';
    }
    if(filtroPry > 0){
        rangoProyecto[0] = filtroPry;
        rangoProyecto[1] = filtroPry;
    }


	db.Colaborador.findAll({
		include: [{
            model: db.Tarea,
            include: [
                {
                    model: db.Registro
                },
                {
                    model: db.Estimacion
                },
                {
                    model: db.Subproyecto,
                    include: [
                        {
                            model: db.Proyecto,
                            where: {id: {
                                $between: rangoProyecto
                            }}
                        }
                    ],
                      where: {id: {
                          $between: rangoSubproyecto
                      }}
                }
            ],
            where: {estado:{
              $like: filtroTarea
            }}
        }],
		where: {id: {
			$between: rangoColaborador
        }}
	}).then(function(colaborares){
		return colaborares;
	}).then(colaboradores => {
		const resObj = colaboradores.map(colaborador =>  {
			return Object.assign(
				{},
				{
					id: colaborador.id,
					nombre: colaborador.nombre,
					tareas: colaborador.Tareas.map(tarea => {
						return Object.assign(
							{},
							{
                                id: tarea.id,
                                nombre: tarea.nombre,
                                estado: tarea.estado,
                                horas: tarea.horas,
                                fecini: moment(new Date(tarea.fecini)).format("YYYY-MM-DD"),
                                fecfin: moment(new Date(tarea.fecfin)).format("YYYY-MM-DD"),
                                registros: tarea.Registros.map(registro => {
                                    return Object.assign(
                                      {},
                                      {
                                          id: registro.id,
                                          fecha: moment(new Date(registro.fecha)).format("YYYY-MM-DD"),
                                          semana: moment(new Date(registro.fecha)).week(),
                                          horas: registro.horas
                                      })
                                }),
                                estimaciones: tarea.Estimacions.map(estimacion => {
                                    return Object.assign(
                                      {},
                                      {
                                          id: estimacion.id,
                                          semana: estimacion.semana,
                                          horas: estimacion.horas
                                      })
                                }),
                                subproyecto: tarea.Subproyecto

							}
						)
					})
				}
			)
		})
        //res.send(colaboradores)
        res.send(resObj);
	});
});


module.exports = router;
