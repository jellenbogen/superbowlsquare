/**
 * Module dependencies.
 */
// var Venmo = require('venmo');
// var venmo = new Venmo(client_id, client_secret);
var Box = require('../models/box.js')["Box"];
var User = require('../models/user.js')["User"];


/**
 * Add the selected box for this user
 * @param boxInfo
 * {
 *      index: 3 ----------------------------------------- / This square index that was selected
 *      userId: 65343443 --------------------------------- / Facebook user id
 * }
 * @param callback this will be called once the boxInfo is insterted with the added run or null
 */
exports.addBox = function(boxInfo, callback) {
    var insertUserSelectedBox = function() {
        Box.create(boxInfo, function(err, box) {
            if (err) {
                callback({err: err});
            } else {
                callback(box);
            }
        });
    };
    Box.findOne(boxInfo, function(err, box) {
        if (err) {
            callback({err: "There was an error selecting this box"});
        } else if (box != null) {
            callback({err: "This box is taken"});
        } else {
            insertUserSelectedBox();
        }
    })
};

/**
 * @param boxInfo
 * {
 *      index: 3 ----------------------------------------- / This square index that was selected
 *      userId: 65343443 --------------------------------- / Facebook user id
 * }
 * @param callBack
 */
exports.removeBox = function(boxInfo, callBack) {
    Box.remove({index: boxInfo.index}, function(err, results) {
        console.log(err ? err : results);
        callBack(err ? {err: err} : {results: results});
    });
};

/**
 * Return all the selected boxes
 * @param callback - function(docs) array of returned docs, will return empty list if none are found
 */
exports.getAllBoxes = function(callback) {
    Box.find({}).toArray(function(err, docs){
        if (!err) {
            var selectedBox = {};
            for (var ii = 0; ii < docs.length; ii++) {
                var aDoc = docs[ii];
                selectedBox[aDoc.index] = aDoc.userId;
            }
            callback(selectedBox);
        } else {
            callback({err: "No boxes have been selected" + err});
        }
    });
};

/**
 * Remove all selected boxes
 */
exports.removeAllBoxes = function(callBack) {
    Box.remove(function(err, results) {
        console.log(err ? err : results);
        callBack(err ? {err: err} : {results: results});
    });
};