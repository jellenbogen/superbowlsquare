/**
 * Module dependencies.
 */
var Winner = require('../models/winner.js')["Winner"];


/**
 * Add the selected box for this user
 * @param winnerInfo
 * {
 *      quarter: 1 ----------------------------------------- / The quarter of the game we're in
 *      boxNumber ------------------------------------------ / The box number that won
 * }
 * @param callback this will be called once the boxInfo is insterted with the added run or null
 */
exports.addWinner = function(winnerInfo, callback) {
    Winner.create(winnerInfo, function(err, winner) {
        if (err) {
            callback({err: err});
        } else {
            callback(winner);
        }
    });
};

exports.getAllWinners = function(callback) {
    Winner.find({}).exec(function(err, docs){
        if (!err) {
            var winners = [];
            for (var ii = 0; ii < docs.length; ii++) {
                var aDoc = docs[ii];
                winners[aDoc.quarter-1] = aDoc.boxNumber;
            }
            callback(winners);
        } else {
            callback({err: "No winners have been added" + err});
        }
    });
};


exports.removeAllWinners = function(callBack) {
    Winner.remove({}, function(err, results) {
        console.log(err ? err : results);
        callBack(err ? {err: err} : {results: results});
    });
};