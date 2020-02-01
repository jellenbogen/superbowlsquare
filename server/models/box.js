'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    crypto = require('crypto');

var BoxSchema = new Schema({
    index:  String,
    userId: String
});

var Box = mongoose.model('Box', BoxSchema);

module.exports = {"Box": Box, price: 20};