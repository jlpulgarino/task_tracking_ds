/*jslint node: true */
"use strict";
/**
 * Define el modelo de un Subproyecto
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}}
 */
module.exports = function(sequelize, DataTypes) {
    var defaultInclude, db;
    //Se definen los campos de un examen
    return sequelize.define("Subproyecto", {
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
        }
    }, {
        timestamps: true,
        classMethods: {
            associate: function(dbP) {
                db = dbP;
                db.Subproyecto.belongsTo(db.Departamento);
                db.Subproyecto.hasMany(db.Tarea, {
                    as: {
                        singular: "tarea",
                        plural: "tareas"
                    }
                });
            },
            save: function(model) {
                return db.Subproyecto.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Subproyecto.create(model);
                });
            }
        }
    });
};
