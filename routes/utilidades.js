var allow = require('../services/allow');
var utils = require('../services/utils');
var db = require('../models');
var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/semana/:fechaNum', function(req, res, next) {
    var fecNum = parseInt(req.params.fechaNum);
    console.log(new Date(fecNum));
    var weeknumber = moment(new Date(fecNum)).isoWeek();
    var resp={
        semana: weeknumber
    };
    res.send(resp);
});

router.get('/semanas', function(req, res, next) {
    db.sequelize.query('SELECT * FROM public.semanasvw ').then(function(resp) {
            if (resp.length > 0) {
                dataset = resp[0];
            }
    		return res.send(dataset);
    });
});

router.get('/semanas/:id', function(req, res, next) {
    db.sequelize.query('SELECT * FROM public.semanasvw where semana = :semana',
    { replacements: {semana: req.params.id}}).then(function(resp) {
            if (resp.length > 0) {
                dataset = resp[0];
            }
    		return res.send(dataset);
    });
});

module.exports = router;
