/*jslint node: true */
"use strict";

var config = require('../config').database;

var fs = require("fs");
var path = require("path");
var cls = require('continuation-local-storage');
var namespace = cls.createNamespace('CR_Sequelize');
var Sequelize = require("sequelize");
Sequelize.cls = namespace;
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db = {};


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    console.log("Associate: ", modelName);
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
