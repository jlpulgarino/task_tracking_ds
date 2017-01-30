/*jslint node: true */
"use strict";
/**
 * Define el modelo de una Tarea
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}}
 */
module.exports = function(sequelize, DataTypes) {
    var defaultInclude, db;
    //Se definen los campos de un examen
    return sequelize.define("Tarea", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(250),
            field: 'nombre',
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(1500),
            field: 'descripcion',
            allowNull: true
        },
        estado: {
            type: DataTypes.STRING(1),
            field: 'estado',
            allowNull: true
        },
        fecini: {
            type: DataTypes.DATE,
            field: 'fecini',
            allowNull: true
        },
        fecfin: {
            type: DataTypes.DATE,
            field: 'fecfin',
            allowNull: true
        },
        horas: {
            type: DataTypes.INTEGER,
            field: 'horas',
            allowNull: false
        }
    }, {
        timestamps: true,
        classMethods: {
            associate: function(dbP) {
                db = dbP;
                db.Tarea.belongsTo(db.Subproyecto);
                db.Tarea.belongsTo(db.Colaborador);
                db.Tarea.hasMany(db.Registro);
                db.Tarea.hasMany(db.Estimacion);
            },
            save: function(model) {
                return db.Tarea.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Tarea.create(model);
                });
            }
        }
    });
};
