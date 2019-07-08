"use strict";
var models = require('mongoose').models;


exports.mongoServices = {
    addData: async (modelName) => {
        return modelName.save();
    },

    update: async (modelName, criteria, dataToSet, options) => {
        return modelName.findOneAndUpdate(criteria, dataToSet, options)
    },

    updateMany: async (modelName, criteria, dataToSet, options) => {
        return modelName.updateMany(criteria, dataToSet, options)
    },

    getData: async (modelName, criteria, skip, limit) => {
        return modelName.find(criteria).skip(Number(skip)).limit(Number(limit));
    },

    getSortedData: async (modelName, criteria, skip, limit) => {
        return modelName.find(criteria).skip(Number(skip)).limit(Number(limit)).sort({createdAt: 1, _id: 1});
    },

    getSelectedData: async (modelName, criteria, skip, limit) => {
        return modelName.find(criteria)
        .select('userName email userPoints lastLoginTime dob gender')
        .skip(Number(skip))
        .limit(Number(limit));
    },

    getPopulatedData: async (modelName, criteria, skip, limit, dataToPopulate) => {
        return modelName.find(criteria)
        .populate(dataToPopulate)
        .skip(Number(skip))
        .limit(Number(limit))
        
    },
    
    getFirstData: async (modelName, criteria) => {
        return modelName.findOne(criteria);
    },

    getFirstPopulatedData: async (modelName, criteria, dataToPopulate) => {
        return modelName.findOne(criteria)
        .populate(dataToPopulate);
    },

    countData: async (modelName, criteria) => {
        return modelName.countDocuments(criteria);
    },

    countTotalData: async (modelName, criteria) => {
        return modelName.estimatedDocumentCount(criteria);
    },

    aggregateData: async (modelName, dataToAggregate) => {
        return modelName.aggregate(dataToAggregate)
    },

    getLastData: async (modelName, criteria) => {
        return modelName.find(criteria)
        .sort({createdAt:-1})
        .limit(1)
    }
}