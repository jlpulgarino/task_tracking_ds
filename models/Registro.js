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
    return sequelize.define("Registro", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        fecha: {
            type: DataTypes.DATE,
            field: 'fecha',
            allowNull: false
        },
        horas: {
            type: DataTypes.DECIMAL(10,2),
            field: 'horas',
            allowNull: false
        }
    }, {
        timestamps: true,
        classMethods: {
            associate: function(dbP) {
                db = dbP;
                db.Registro.belongsTo(db.Tarea);
            },
            save: function(model) {
                return db.Registro.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Registro.create(model);
                });
            }
        }
    });
};
