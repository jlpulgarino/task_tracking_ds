/*jslint node: true */
"use strict";
/**
 * Define el modelo de un proyecto
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}}
 */
module.exports = function(sequelize, DataTypes) {
    var defaultInclude, db;
    //Se definen los campos de un examen
    return sequelize.define("Proyecto", {
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
        }
    }, {
        timestamps: true,
        classMethods: {
            associate: function(dbP) {
                db = dbP;
                db.Proyecto.hasMany(db.Subproyecto, {
                    as: {
                        singular: "subproyecto",
                        plural: "subproyectos"
                    }
                });
            },
            save: function(model) {
                return db.Proyecto.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Proyecto.create(model);
                });
            }
        }
    });
};
