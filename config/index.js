var PRODUCTION = "production";
var DEVELOPMENT = "development";

var env = process.env.NODE_ENV || DEVELOPMENT;
var config = require('./config.json')[env];
var fs = require('fs');
var path = require('path');



if (env === PRODUCTION) {
	config.server.https.privateKey = fs.readFileSync('/etc/pki/tls/private/virtual/myserver.key');
	config.server.https.certificate = fs.readFileSync('/etc/pki/tls/certs/virtual/STAR_virtual_uniandes_edu_co.crt');
} else {
	config.server.https.privateKey = fs.readFileSync(path.join("config","sslcert", "server.key"));
	config.server.https.certificate = fs.readFileSync(path.join("config","sslcert", "server.cert"));
}

module.exports = config;
