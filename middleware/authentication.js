"use strict";

const jwt = require('jsonwebtoken');
const models = require('mongoose').models;
const config = require('config');
const async = require('async');
var mongoServices = require('../services/mongoService');
/*******************************************************************************
Function to generate Access Token for USERS.
*******************************************************************************/
exports.getToken = async (user, cb) => {
    var claims = {
        id: user._doc._id,
        testName: user._doc.testName,
    }
    return jwt.sign(claims, config.get('auth.secret'), { expiresIn: '1h' });
};

/*******************************************************************************
Function to verify Access Token for USERS.
*******************************************************************************/
exports.verifyToken = async (req, res, next) => {
    try {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (!token) {
            return res.status(403).send({
                responseCode: 403,
                success: false,
                message: 'Token is required.'
            });
        }
        let criteria = {
            token: token
        }
        let testToken = await mongoServices.mongoServices.getFirstData(models.Test, criteria);
        if (!testToken) {
            return res.status(403).send({
                responseCode: 403,
                message: 'token expired',
                data: {}
            });
        } else {
            let claims = await jwt.verify(token, config.get('auth.secret'), { ignoreExpiration: true });
            req.test = claims;
            let createLogData = await createLog(req, res);
            req.logId = createLogData;
            next();
        }
    }
    catch (err) {
        return res.status(403).send({
            responseCode: 403,
            message: 'err in user finding via token',
            data: {}
        });
    }
};

let createLog = async (req, res) => {

    try {
        if (req.test) {
            var testId = req.test.id;
        }
        var middleWareModel = new models.middleWare({
            url: req.url,
            user: testId,
        });
        let middleWareData = mongoServices.mongoServices.addTest(middleWareModel);
        return middleWareData.id
    }
    catch (err) {
        return res.status(403).send({
            responseCode: 403,
            message: 'err in storing log',
            data: {}
        });
    }

}