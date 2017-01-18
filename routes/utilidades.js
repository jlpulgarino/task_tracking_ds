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


module.exports = router;
