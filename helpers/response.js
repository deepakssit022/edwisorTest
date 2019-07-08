/*
 *
 * ALL THE RESPONSES SHOULD BE IN THIS FILE.
 * 
 */

'use strict';
const models = require('mongoose').models;
const mongoServices = require('../services/mongoService');
const logger = require('../core/logger');
module.exports = async (req, res, data) => {

    try {
        let responseData = {
            success: async (message, code) => {
                res.status(code).json({
                    is_success: true,
                    message: message,
                    responseCode: code
                });
            },
            failure: async (error, code, message) => {
                res.status(code).json({
                    is_success: false,
                    message: error,
                    responseCode: code
                });
            },
            data: async (item, code) => {
                res.status(code).json({
                    is_success: true,
                    data: item,
                    responseCode: code
                });
            },
            page: async (items, total, page_no, code) => {
                res.status(code).json({
                    is_success: true,
                    data: {
                        items: items,
                        skip: page_no || 0,
                        total: total || items.length,
                    },
                    responseCode: code
                });
            }
        }
        if (req.logId) {
            let criteria = { _id: req.logId };
            let middleWareData = await mongoServices.mongoServices.getFirstData(models.middleWare, criteria);

            middleWareData.response = data //JSON.stringify(middleWareData);
            let middleWareUpdatedData = await mongoServices.mongoServices.addTest(middleWareData);

            return middleWareUpdatedData;
        } else {
            return responseData
        }
    }
    catch (err) {
        return res.status(403).send({
            responseCode: 403,
            message: err,
            data: {}
        });
    }
};