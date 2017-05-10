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
    return sequelize.define("Nota", {
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
        texto: {
            type: DataTypes.STRING(1500),
            field: 'nota',
            allowNull: false
        }
    }, {
        timestamps: true,
        classMethods: {
            associate: function(dbP) {
                db = dbP;
                db.Nota.belongsTo(db.Tarea);
            },
            save: function(model) {
                return db.Nota.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Nota.create(model);
                });
            }
        }
    });
};
