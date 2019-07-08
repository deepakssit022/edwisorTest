const models = require('mongoose').models;
const bodyParser = require('body-parser');
// const test = require('../controllers/test/test');
// const auth = require('../middleware/authentication');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

/*******************************************************************************
Configuration for MULTER (image upload).
*******************************************************************************/
var upload;

require('./uploadFile').uploadFile((storage) => {
	upload = multer({ storage: storage });
});

module.exports.configureRoutes = function (app) {
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	/**************************** TEST API'S ************************************/
	require('./../routes/index')(app, upload);
};