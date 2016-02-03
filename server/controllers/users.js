/**
 * Module dependencies.
 */
var User = require('../models/user.js')["User"];

exports.addUser = function(userInfo, callback) {
    userInfo.amountPaid = 0;
    userInfo.amountOwed = 0;
    userInfo.boxCount = 0;

    var insertUser = function() {
        User.create(userInfo, function (err, user) {
            if (err) {
                callback({err: err});
            } else {
                callback(user);
            }
        });
    };

    User.findOne({userId: userInfo.userId}, function(err, user) {
        if (err) {
            callback({err: "There was an error adding this user"});
        } else {
            insertUser();
        }
    })
};

/**
 * Remove all users
 */
exports.removeAllUsers = function(callBack) {
    User.remove({}, function(err, results) {
        console.log(err ? err : results);
        callBack(err ? {err: err} : {results: results});
    });
};

/**
 * Return all the users playing
 * @param callback - function(docs) array of returned docs, will return empty list if none are found
 */
exports.getAllUsers = function(callback) {
    User.find({}).exec(function(err, docs){
        if (!err) {
            var users = {};
            for (var ii = 0; ii < docs.length; ii++) {
                var aDoc = docs[ii];
                users[aDoc.userId] = aDoc;
            }
            callback(users);
        } else {
            callback({err: "No users have been added" + err});
        }
    });
};

exports.userList = function(callback) {
    User.find({}).exec(function(err, docs){
        if (!err) {
            var users = {};
            for (var ii = 0; ii < docs.length; ii++) {
                var aDoc = docs[ii];
                users[aDoc.userId] = {
                    name: aDoc.first_name + ' ' + aDoc.last_name,
                    amountOwed: aDoc.amountOwed,
                    amountPaid: aDoc.amountPaid,
                    boxCount: aDoc.boxCount
                };
            }
            callback(users);
        } else {
            callback({err: "No users have been added" + err});
        }
    });
};

/**
 * Return all the users who have amountOwed > 0
 * @param callback - function(docs) array of returned docs, will return empty list if none are found
 */
exports.unpaidUsers = function(callback) {
    User.find({
        amountOwed: {
            $gt: 0
        }
    }).exec(function(err, docs){
        if (!err) {
            var users = {};
            for (var ii = 0; ii < docs.length; ii++) {
                var aDoc = docs[ii];
                users[aDoc.userId] = {
                    name: aDoc.first_name + ' ' + aDoc.last_name,
                    amountOwed: aDoc.amountOwed,
                    amountPaid: aDoc.amountPaid,
                    boxCount: aDoc.boxCount
                };
            }
            callback(users);
        } else {
            callback({err: err});
        }
    });
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};

exports.receipt = function(req, res) {
    console.log(req.body);
    res.render('success', {user: req.user ? JSON.stringify(req.user) : 'null'});
};