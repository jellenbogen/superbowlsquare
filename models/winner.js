'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    crypto = require('crypto');

var WinnerScehme = new Schema({
    box:  Number,
    quarter: Number
});

var Winner = mongoose.model('Winner', WinnerScehme);

module.exports = {"Winner": Winner};