/*jslint node: true */
"use strict";
/**
 * Define el modelo de un departamento
 * @param sequelize
 * @param DataTypes
 * @returns {*|{}}
 */
module.exports = function(sequelize, DataTypes) {
    var defaultInclude, db;
    //Se definen los campos de un examen
    return sequelize.define("Departamento", {
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
                db.Departamento.hasMany(db.Colaborador, {
                    as: {
                        singular: "colaborador",
                        plural: "colaboradores"
                    }
                });
            },
            save: function(model) {
                return db.Departamento.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Departamento.create(model);
                });
            }
        }
    });
};
