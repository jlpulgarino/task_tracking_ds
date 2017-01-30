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
    return sequelize.define("Estimacion", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        semana: {
            type: DataTypes.INTEGER,
            field: 'semana',
            allowNull: false
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
                db.Estimacion.belongsTo(db.Tarea);
            },
            save: function(model) {
                return db.Estimacion.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Estimacion.create(model);
                });
            }
        }
    });
};
