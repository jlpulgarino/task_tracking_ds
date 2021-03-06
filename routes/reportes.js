var allow = require('../services/allow');
var utils = require('../services/utils');
var db = require('../models');
var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
var moment = require('moment');
var excel = require('node-excel-export');


/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener un proyecto particular
 */
router.get('/', function(req, res, next) {

    // You can define styles as json object
    // More info: https://github.com/protobi/js-xlsx#cell-styles
    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    //Array of objects representing heading rows (very top)
    let heading = [
        [{
            value: 'a1',
            style: styles.headerDark
        }, {
            value: 'b1',
            style: styles.headerDark
        }, {
            value: 'c1',
            style: styles.headerDark
        }],
        ['a2', 'b2', 'c2'] // <-- It can be only values
    ];

    //Here you specify the export structure
    var specification = {
        customer_name: { // <- the key should match the actual data key
            displayName: 'Customer', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: function(value, row) { // <- style renderer function
                // if the status is 1 then color in green else color in red
                // Notice how we use another cell value to style the current one
                return (row.status_id == 1) ? styles.cellGreen : {
                    fill: {
                        fgColor: {
                            rgb: 'FFFF0000'
                        }
                    }
                }; // <- Inline cell style is possible
            },
            width: 120 // <- width in pixels
        },
        status_id: {
            displayName: 'Status',
            headerStyle: styles.headerDark,
            cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
                return (value == 1) ? 'Active' : 'Inactive';
            },
            width: '10' // <- width in chars (when the number is passed as string)
        },
        note: {
            displayName: 'Description',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 220 // <- width in pixels
        }
    }

    // The data set should have the following shape (Array of Objects)
    // The order of the keys is irrelevant, it is also irrelevant if the
    // dataset contains more fields as the report is build based on the
    // specification provided above. But you should have all the fields
    // that are listed in the report specification
    var dataset = [{
        customer_name: 'IBM',
        status_id: 1,
        note: 'some note',
        misc: 'not shown'
    }, {
        customer_name: 'HP',
        status_id: 0,
        note: 'some note'
    }, {
        customer_name: 'MS',
        status_id: 0,
        note: 'some note',
        misc: 'not shown'
    }]

    // Create the excel report.
    // This function will return Buffer
    var report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Sheet name', // <- Specify sheet name (optional)
                heading: heading, // <- Raw heading array (optional)
                specification: specification, // <- Report specification
                data: dataset // <-- Report data
            }
        ]
    );

    // You can then return this straight
    res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report);

    // OR you can save this buffer to the disk by creating a file.

});



/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener un proyecto particular
 */
router.get('/rptAll/:filtro', function(req, res, next) {

var rangoDepartamento = [0,999999999];
    var filtro = req.params.filtro;
    var camposFiltro = filtro.split('_');
    var filtroDepto = parseInt(camposFiltro[0]);
    var filtroAnio = parseInt(camposFiltro[1]);
    var filtroSemIni = parseInt(camposFiltro[2]);
    var filtroSemFin = parseInt(camposFiltro[3]);
    if(filtroDepto > 0){
        rangoDepartamento[0] = filtroDepto;
        rangoDepartamento[1] = filtroDepto;
    }


    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    var specification = {
        proyectoid: {
            displayName: 'IdProyecto',
            headerStyle: styles.headerDark,
            width: '15' // <- width in pixels
        },
        nombre: {
            displayName: 'NomProyecto',
            headerStyle: styles.headerDark,
            width: '50'
        },
        DepartamentoId: {
            displayName: 'Departmento',
            headerStyle: styles.headerDark,
            width: '15'
        },
        subproyectoid: {
            displayName: 'IdSubproyecto',
            headerStyle: styles.headerDark,
            width: '15'
        },
        nomsubproyecto: {
            displayName: 'NomSubproyecto',
            headerStyle: styles.headerDark,
            width: '50'
        },
        tareaid: {
            displayName: 'IdTarea',
            headerStyle: styles.headerDark,
            width: '15'
        },
        nomtarea: {
            displayName: 'NomTarea',
            headerStyle: styles.headerDark,
            width: '15'
        },
        estado: {
            displayName: 'Estado',
            headerStyle: styles.headerDark,
            width: '10'
        },
        nom_colb: {
            displayName: 'Colaborador',
            headerStyle: styles.headerDark,
            width: '15'
        },
        estimado: {
            displayName: 'H/Estimadas',
            headerStyle: styles.headerDark,
            width: '12'
        },
        anio: {
            displayName: 'Año',
            headerStyle: styles.headerDark,
            width: '10'
        },
        semana: {
            displayName: 'Semana',
            headerStyle: styles.headerDark,
            width: '10'
        },
        planeado: {
            displayName: 'H/Planeadas',
            headerStyle: styles.headerDark,
            width: '12'
        },
        registrado: {
            displayName: 'H/Trabajadas',
            headerStyle: styles.headerDark,
            width: '12'
        }
    }


    var dataset = [];
    db.sequelize.query('SELECT * FROM public.tareasvw where  "DepartamentoId" between :depto1 and :depto2 and anio = :anioP and semana between :sem1 and :sem2 ',
    { replacements: { depto1: rangoDepartamento[0], depto2:rangoDepartamento[1], anioP: filtroAnio, sem1: filtroSemIni , sem2: filtroSemFin }}).then(function(resp) {
        if (resp.length > 0) {
            dataset = resp[0];
        }
        var report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Tareas', // <- Specify sheet name (optional)
                    //heading: heading, // <- Raw heading array (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        // You can then return this straight
        res.attachment('tareasRpt.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);
        //return res.send(dataset);
    });


});

/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener un proyecto particular
 */
router.get('/rptCerr/:filtro', function(req, res, next) {

    var filtro = req.params.filtro;
    var camposFiltro = filtro.split('_');
    var filtroAnio = parseInt(camposFiltro[0]);
    var filtroSemIni = parseInt(camposFiltro[1]);
    var filtroSemFin = parseInt(camposFiltro[2]);

    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    var specification = {
        proyectoid: {
            displayName: 'IdProyecto',
            headerStyle: styles.headerDark,
            width: '15' // <- width in pixels
        },
        nombre: {
            displayName: 'NomProyecto',
            headerStyle: styles.headerDark,
            width: '50'
        },
        anio: {
            displayName: 'Año',
            headerStyle: styles.headerDark,
            width: '10'
        },
        semana: {
            displayName: 'Semana',
            headerStyle: styles.headerDark,
            width: '10'
        },
        totalpry: {
            displayName: 'Tot.Tareas Proyecto',
            headerStyle: styles.headerDark,
            width: '15'
        },
        nom_colb: {
            displayName: 'Colaborador',
            headerStyle: styles.headerDark,
            width: '15'
        },
        totalclb: {
            displayName: 'Tot.Tareas Colaborador',
            headerStyle: styles.headerDark,
            width: '15'
        }
    }


    var dataset = [];
    db.sequelize.query('SELECT * FROM public.tareascerradasvw where anio = :anioP and semana between :sem1 and :sem2 ',
    { replacements: { anioP: filtroAnio , sem1: filtroSemIni , sem2: filtroSemFin }}).then(function(resp) {
        if (resp.length > 0) {
            dataset = resp[0];
        }
        var report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Tareas', // <- Specify sheet name (optional)
                    //heading: heading, // <- Raw heading array (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        // You can then return this straight
        res.attachment('tareasRpt.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);
        //return res.send(dataset);
    });


});


/**
 * Define el comportamiento de un Get enviado a la ruta 'proyecto/:id' para obtener un proyecto particular
 */
router.get('/rptPlnd/:filtro', function(req, res, next) {

    var filtro = req.params.filtro;
    var camposFiltro = filtro.split('_');
    var filtroAnio = parseInt(camposFiltro[0]);
    var filtroSemIni = parseInt(camposFiltro[1]);
    var filtroSemFin = parseInt(camposFiltro[2]);

    var styles = {
        headerDark: {
            fill: {
                fgColor: {
                    rgb: 'FF000000'
                }
            },
            font: {
                color: {
                    rgb: 'FFFFFFFF'
                },
                sz: 14,
                bold: true,
                underline: true
            }
        },
        cellPink: {
            fill: {
                fgColor: {
                    rgb: 'FFFFCCFF'
                }
            }
        },
        cellGreen: {
            fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
            }
        }
    };

    var specification = {
        proyectoid: {
            displayName: 'IdProyecto',
            headerStyle: styles.headerDark,
            width: '15' // <- width in pixels
        },
        nombre: {
            displayName: 'NomProyecto',
            headerStyle: styles.headerDark,
            width: '50'
        },
        anio: {
            displayName: 'Año',
            headerStyle: styles.headerDark,
            width: '10'
        },
        semana: {
            displayName: 'Semana',
            headerStyle: styles.headerDark,
            width: '10'
        },
        totalpry: {
            displayName: 'Tot.Tareas Proyecto',
            headerStyle: styles.headerDark,
            width: '15'
        },
        nom_colb: {
            displayName: 'Colaborador',
            headerStyle: styles.headerDark,
            width: '15'
        },
        totalclb: {
            displayName: 'Tot.Tareas Colaborador',
            headerStyle: styles.headerDark,
            width: '15'
        }
    }


    var dataset = [];
    db.sequelize.query('SELECT * FROM public.tareasplaneadasvw where anio = :anioP and semana between :sem1 and :sem2 ',
    { replacements: { anioP: filtroAnio , sem1: filtroSemIni , sem2: filtroSemFin }}).then(function(resp) {
        if (resp.length > 0) {
            dataset = resp[0];
        }
        var report = excel.buildExport(
            [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                {
                    name: 'Tareas', // <- Specify sheet name (optional)
                    //heading: heading, // <- Raw heading array (optional)
                    specification: specification, // <- Report specification
                    data: dataset // <-- Report data
                }
            ]
        );

        // You can then return this straight
        res.attachment('tareasRpt.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);
        //return res.send(dataset);
    });


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

router.get('/:id/estimaciones/:anio/:semana', function(req, res, next) {
    db.Tarea.findAll({
        include: [{
            model: db.Estimacion,
            where: {
                semana: req.params.semana
            }
        }],
        where: {
            id: req.params.id
        }
    }).then(function(tareas) {
        return tareas;
    }).then(tareas => {
        const resObj = tareas.map(tarea => {
                return Object.assign({}, {
                    id: tarea.id,
                    nombre: tarea.nombre,
                    estado: tarea.estado,
                    horas: tarea.horas,
                    fecini: moment(new Date(tarea.fecini)).format("YYYY-MM-DD"),
                    fecfin: moment(new Date(tarea.fecfin)).format("YYYY-MM-DD"),
                    estimaciones: tarea.Estimacions.map(estimacion => {
                        return Object.assign({}, {
                            id: estimacion.id,
                            semana: estimacion.semana,
                            horas: estimacion.horas,
                            TareaId: tarea.id
                        })
                    }),
                    subproyecto: tarea.Subproyecto
                })
            })
            //res.send(tareas)
        res.send(resObj);
    }).catch(next);

});



module.exports = router;
