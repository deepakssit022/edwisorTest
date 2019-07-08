"use strict"

var models = require('mongoose').models;
var userValidator = require('../../validators/user');
const Joi = require('joi'); // For form validations
const authentication = require('../../middleware/authentication');
var responseHelper = require('../../helpers/response');
var mongoServices = require('../../services/mongoService');
var logger = require('../../core/logger').logger;
const checkBlankFunction = require('../../middleware/checkBlankFunc');
var boom = require('boom'); // To send the error messages.
const responseConstants = require('../../helpers/responseConstants');
const constants = require('../../helpers/constans');


/*
 * =======================
 * API for User Sign Up
 * =======================
 */

exports.signUp = async (req, res) => {
    try {
        let userName = req.body.userName;
        let email = req.body.email;
        let password = req.body.password;
        let countryCode = req.body.countryCode;
        let phoneNumber = req.body.phoneNumber;
        let address = req.body.address;
        let dob = req.body.dob;
        let gender = req.body.gender;

        // Check for values in required fields
        const manValues = [{
            email: email,
            password: password,
        }];
        const manValuesResult = await checkBlankFunction.checkBlank(res, manValues);
        if (manValuesResult && manValuesResult.success.toString() == constants.booleanValues.false.toString()) {
            throw boom.notFound(manValuesResult.message);
        }

        // Check for correct data types
        const form = Joi.validate({ userName: userName, email: email }, userValidator);
        if (form.error) {
            throw boom.badRequest(form.error.message);
        }
        
        let emailCriteria = { email: email };
        let userValidate = await mongoServices.mongoServices.getData(models.User, emailCriteria); //Check if email already exists. 
        let userPhoneCriteria = { countryCode: countryCode, phoneNumber: phoneNumber }
        let phoneValidate = await mongoServices.mongoServices.getData(models.User, userPhoneCriteria); //Check if phone already exists 
        if (userValidate.length > 0) {
            throw boom.methodNotAllowed(responseConstants.responseMessages.emailAlreadyExist);
        } else if (phoneValidate.length > 0) {
            throw boom.methodNotAllowed(responseConstants.responseMessages.phoneAlreadyExist);
        } else {

            // Generatinf password hash
            let encryptedPassword = await models.User.schema.methods.generateHash(password);
            let user = new models.User();
            user.email = email;
            user.userName = userName;
            user.password = encryptedPassword;
            user.isLogin = constants.booleanValues.true;
            user.lastLoginTime = new Date();
            user.dob = dob;
            user.gender = gender;
            user.address = address;
            user.countryCode = countryCode;
            user.phoneNumber = phoneNumber;
            let userData = await mongoServices.mongoServices.addData(user);
            const userResult = await mongoServices.mongoServices.addData(userData);
            let accessToken = await authentication.getToken(userResult); // Generating access token
            let criteria = { _id: userResult._id }
            var dataToSet = { $set: { accessToken: accessToken } }
            var options = { new: true }
            const UpdateResult = await mongoServices.mongoServices.update(models.User, criteria, dataToSet, options);
            let response = await responseHelper(req, res, UpdateResult);
            return response.success("SignUp successful.", responseConstants.responseFlags.success);
        }
    }
    catch (err) {
        // Logging errors
        logger.error('Error in admin login ' + err);

        let responseError = await responseHelper(res, res, err.message);
        return responseError.failure(err.message, responseConstants.responseFlags.failure);
    }
}

/*
 * =======================
 * API for User Sign In
 * =======================
 */

exports.login = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let manValues;

        // Check for values in required fields
        manValues = [{
            email: email,
            password: password,
        }];
        const manValuesResult = await checkBlankFunction.checkBlank(res, manValues);
        if (manValuesResult && manValuesResult.success.toString() == constants.booleanValues.false.toString()) {
            throw boom.notFound(manValuesResult.message);
        }

        // Check for correct data types
        const form = Joi.validate({ email: email, password: password }, userValidator);
        if (form.error) {
            throw boom.badRequest(form.error.message);
        }
        let criteria = {};
        criteria = { email: email }
        let userData = await mongoServices.mongoServices.getFirstData(models.User, criteria);

        let validatePassword = await userData.validPassword(password); //Validating password
        if (password && !validatePassword) {
            throw boom.illegal(responseConstants.responseMessages.incorrectPassword);
        } else {
            let newAccessToken = await authentication.getToken(userData);
            userData.accessToken = newAccessToken;
            userData.lastLoginTime = new Date();
            let updateUserData = await mongoServices.mongoServices.addData(userData);
            let data = {
                accessToken: newAccessToken,
                email: email,
                lastLoginTime: new Date()
            }
            let response = await responseHelper(req, res, data);
            return response.data(data, responseConstants.responseFlags.success);
        }
    }
    catch (err) {
        // Logging errors
        logger.error('Error in admin login ' + err);

        let responseError = await responseHelper(res, res, err.message);
        return responseError.failure(err.message, responseConstants.responseFlags.failure);
    }
}