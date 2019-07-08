const path = require('path');
const multer = require('multer');
const uuid = require('uuid');


module.exports.uploadFile = (cb) => {
	var storage = multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, './uploads');
		},
		filename: function (req, file, callback) {
			var fileName = path.parse(file.originalname).name;
			callback(null, uuid() + '-' + Date.now() + path.extname(file.originalname));
		},
	});
	cb(storage);
};