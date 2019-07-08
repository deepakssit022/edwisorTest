var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const logger = require('../core/logger').logger;


var unprotected = [
	/\//,   
	/\/login*/,
	/\/assets\/*/,
	/favicon.ico/
];

var redirectUnauthenticated = function(err, req, res, next) {
	logger.info('Request [' + err.status + '] was for ' + req.path);
	res.json({
		message: 'request is not authorized'
	});
};

var jwtCheck = jwt({
	secret: jwks.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: 'https://development0.eu.auth0.com/.well-known/jwks.json'
	}),
	audience: 'http://localhost:3001/',
	issuer: 'https://development0.eu.auth0.com/',
	algorithms: ['RS256']
});


module.exports.configure = (app) => {
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(jwtCheck.unless({path: unprotected}), redirectUnauthenticated );

	var root = path.normalize(__dirname + './../');
	app.set('views', path.join(root, 'views'));
	app.set('view engine', 'jade');
	app.use(express.static(path.join(root, 'public')));
};