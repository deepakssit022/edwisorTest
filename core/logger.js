var winston = require('winston'); // To use as a Logger
var rotate = require('winston-daily-rotate-file');
var config = require('config');
var fs = require('fs');

const dir = config.get('logger.logFileDir');

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}


module.exports.logger = winston.createLogger({
	level: 'info',
	transports: [
		new (winston.transports.Console)({
			colorize: true,
		}),
		new winston.transports.DailyRotateFile({
			filename: config.get('logger.logFileName'),
			dirname: config.get('logger.logFileDir'),
			maxsize: 20971520, //20MB
			maxFiles: 25,
			datePattern: '.dd-MM-yyyy'
		})
	]
});