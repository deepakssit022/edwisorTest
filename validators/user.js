const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const schema = Joi.object().keys({
	email: Joi.string().email(),
	userName: Joi.string(),
	password: Joi.string(),
	profilePic: Joi.string(),
	countryCode: Joi.string(),
	phoneNumber: Joi.string(),
	gender: Joi.string(),
	address: Joi.string()
});

module.exports = schema;
