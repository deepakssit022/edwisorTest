var config = require('config'); // To access the json files in config folder.
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var fs = require('fs');
process.env.PORT = config.get('dbServer.port');
const logger = require('./core/logger').logger;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(cors());

require('./settings/database').configure(mongoose);
require('./settings/express').configure(app);
require('./settings/routes').configureRoutes(app);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

var server = http.createServer(app);

var port = process.env.PORT || config.get('dbServer.port');
server.listen(port, function () {
	logger.info('express running on ' + port + ' Port');
});

exports.module = exports = app;
