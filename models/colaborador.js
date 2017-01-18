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
    return sequelize.define("Colaborador", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        usuario: {
            type: DataTypes.STRING(30),
            field: 'usuario',
            allowNull: false
        },
        nombre: {
            type: DataTypes.STRING(250),
            field: 'nombre',
            allowNull: false
        },
        rol: {
            type: DataTypes.STRING(1),
            field: 'rol',
            allowNull: true
        },
        cargo: {
            type: DataTypes.STRING(1500),
            field: 'cargo',
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(100),
            field: 'email',
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(50),
            field: 'password',
            allowNull: true
        }

    }, {
        timestamps: true,
        classMethods: {
            associate: function(dbP) {
                db = dbP;
                db.Colaborador.belongsTo(db.Departamento);
                db.Colaborador.hasMany(db.Tarea);
            },
            save: function(model) {
                return db.Colaborador.findById(model.id).then(function(modelAnt) {
                    if (modelAnt)
                        return modelAnt.update(model);
                    else
                        return db.Colaborador.create(model);
                });
            }
        }
    });
};
