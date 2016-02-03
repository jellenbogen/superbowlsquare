'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    crypto = require('crypto');

var adminId = "978198632333312237";

var UserSchema = new Schema({
    id:  String,
    userId: String,
    first_name: String,
    last_name:   String,
    email: String,
    userPhoto: { height: Number, width: Number, url: String },
    boxCount: Number,
    amountPaid: Number,
    amountOwed: Number,
    provider: String,
    salt: String,
    venmo: {},
    access_token: String,
    refresh_token: String
});

var User = mongoose.model('User', UserSchema);

module.exports = {"User": User, adminId: adminId};