var express = require('express'),
    _ = require('underscore'),
    sha1 = require('sha1'),
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    usersController = require('./controllers/users.js'),
    boxesController = require('./controllers/boxes.js'),
    winnersController = require('./controllers/winners.js'),
    passport = require('passport'),
    cons = require('consolidate'),
    swig = require('swig'),
    VenmoStrategy = require('passport-venmo').Strategy,
    session = require('express-session'),
    static = require('serve-static'),
    errorhandler = require('errorhandler'),
    MongoStore = require('connect-mongo')(session);

var config = require('./config.js');
var boxPrice = config.boxPrice;

var User = require('./models/user.js')["User"];
var adminId = require('./models/user.js')["adminId"];
var Box = require('./models/box.js')["Box"];
var Winner = require('./models/winner.js')["Winner"];

var mongoose = require('mongoose');
mongoose.connect(config.mongo.connectionString, {useNewUrlParser: true});

SuperBowl = {};
SuperBowl.app = express();
SuperBowl.app.use(static(path.join(__dirname, '../site')));
SuperBowl.app.engine('.html', cons.swig);
SuperBowl.app.set('view engine', 'html');
SuperBowl.app.set('views', './templates/');

SuperBowl.app.use(passport.initialize());
SuperBowl.app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.sessionSecret
}));


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

// Use the VenmoStrategy
// Strategies in Passport require a 'verify' function, which
// is the anonymous function we define as the second parameter
// of passport.use
// The 'verify' function accepts an accessToken, refreshToken,
// a 'venmo' object containing an authorized user's information
// and invoke callback function with the user object.
passport.use(new VenmoStrategy({
        clientID: config.venmo.clientId,
        clientSecret: config.venmo.clientSecret,
        callbackURL: config.venmo.callbackUrl
    },
    function(accessToken, refreshToken, venmo, done) {
        User.findOne({
            'id': venmo.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            // checks if the user has been already been created, if not
            // we create a new instance of the User model
            var venmoJson = venmo._json;
            if (!user) {
                user = new User({
                    id: venmoJson.id,
                    userId: venmoJson.id,
                    name: venmoJson.displayName,
                    username: venmoJson.username,
                    email: venmoJson.email,
                    first_name: venmoJson.first_name,
                    last_name: venmoJson.last_name,
                    provider: 'venmo',
                    venmo: venmoJson,
                    userPhoto: {
                        width: 160,
                        height: 160,
                        url: venmoJson.profile_picture_url
                    },
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    boxCount: 0,
                    amountPaid: 0,
                    amountOwed: 0
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                user.access_token = accessToken;
                user.venmo = venmo._json;
                user.userPhoto = {
                    width: 160,
                    height: 160,
                    url: venmoJson.profile_picture_url
                }
                user.save();
                return done(err, user);
            }
        });
    }
));

SuperBowl.getSessionUser = function(req, res, callback) {
    User.findOne({
        'id': req.session.user.id
    }, function(err, sessionUser) {
        if (sessionUser) {
            callback(sessionUser)
        } else {
            res.header("Content-Type:","application/json");
            res.header("Access-Control-Allow-Origin", "*");
            res.send({error: 'Unable to fetch session user'});
        }
    });
};

/*
 * -------------- App Functions --------------
 */
SuperBowl.app.get('/addBox', function(req, res) {
    res.header("Content-Type:","application/json");
    res.header("Access-Control-Allow-Origin", "*");
    var params = req.query;

    if (params.index && params.userId) {
        var addBox = function(sessionUser) {
            var addBoxCallback = function(savedSelectedBox) {
                var reponse = savedSelectedBox ? savedSelectedBox : {err: 'Selected box was not saved, please try again'};
                if (savedSelectedBox){
                    sessionUser.boxCount++;
                    sessionUser.amountOwed += boxPrice;
                    sessionUser.save(function() {
                        req.session.user = sessionUser;
                    });
                }
                res.send(reponse);
            };

            boxesController.addBox(params, addBoxCallback);
        };
        SuperBowl.getSessionUser(req, res, addBox);
    } else {
        res.send({error: 'Please supply both an index and userId'});
    }
});

SuperBowl.app.get('/removeBox', function(req, res) {
    res.header("Content-Type:","application/json");
    res.header("Access-Control-Allow-Origin", "*");
    var params = req.query;

    if (params.index && params.userId) {
        var removeBox = function(sessionUser) {
            boxesController.removeBox(params, function(boxes){
                sessionUser.boxCount--;
                sessionUser.amountOwed -= boxPrice;
                sessionUser.save(function() {
                    req.session.user = sessionUser;
                    res.send(boxes);
                });
            });
        };
        SuperBowl.getSessionUser(req, res, removeBox);
    } else {
        res.send({error: 'Please supply a valid index'});
    }
});

SuperBowl.app.get('/removeAllBoxes', function(req, res){
    boxesController.removeAllBoxes(function(){
        res.header("Content-Type:","application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send({message: 'All selected boxes have been removed.'});
    });
});

SuperBowl.app.get('/boxes', function(req, res) {
    boxesController.getAllBoxes(function(docs){
        res.header("Content-Type:","application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(docs);
    });
});

SuperBowl.app.get('/users', function(req, res) {
    usersController.getAllUsers(function(docs){
        res.header("Content-Type:","application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(docs);
    });
});

SuperBowl.app.get('/userList', function(req, res) {
    usersController.userList(function(docs){
        res.header("Content-Type:","application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(docs);
    });
});

SuperBowl.app.get('/addUser', function(req, res) {
    var params = req.query;
    res.header("Content-Type:","application/json");
    res.header("Access-Control-Allow-Origin", "*");

    var addUserCallback = function(savedUser) {
        var reponse = savedUser ? savedUser : {err: 'Selected user was not saved, please try again'};
        res.send(reponse);
    };

    if (params.userInfo) {
        var userInfo = JSON.parse(params.userInfo);
        usersController.addUser(userInfo, addUserCallback);
    } else {
        res.send({err: 'Please supply a valid userId'});
    }
});

SuperBowl.app.get('/removeAllUsers', function(req, res){
    usersController.removeAllUsers(function(){
        res.header("Content-Type:","application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send({message: 'All users have been removed.'});
    });
});

SuperBowl.app.get('/addWinner', function(req, res) {
    var params = req.query;
    res.header("Content-Type:","application/json");
    res.header("Access-Control-Allow-Origin", "*");

    var addWinnerCallback = function(savedWinner) {
        var reponse = savedWinner ? savedWinner : {err: 'Winner was not saved, please try again'};
        res.send(reponse);
    };

    if (params.quarter && params.boxNumber) {
        winnersController.addWinner(params, addWinnerCallback);
    } else {
        res.send({err: 'Please supply both an quarter and boxNumber'});
    }
});

SuperBowl.app.get('/unpaid', function(req, res) {
    res.header("Content-Type:","application/json");
    res.header("Access-Control-Allow-Origin", "*");

    var unpaidUsersCallback = function(unpaidUsers) {
        res.send(unpaidUsers);
    };

    usersController.unpaidUsers(unpaidUsersCallback);
});

SuperBowl.app.get('/removeAllWinners', function(req, res){
    winnersController.removeAllWinners(function(){
        res.header("Content-Type:","application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send({message: 'All users have been removed.'});
    });
});

SuperBowl.app.get('/winners', function(req, res) {
    winnersController.getAllWinners(function(docs){
        res.header("Content-Type:","application/json");
        res.header("Access-Control-Allow-Origin", "*");
        res.send(docs);
    });
});

/**
 * Return all the selected boxes
 * @param callback - function(docs) array of returned docs, will return empty list if none are found
 */
SuperBowl.app.get('/squareData', function(req, res) {
    res.header("Content-Type:","application/json");
    res.header("Access-Control-Allow-Origin", "*");

    var onSessionUserFetched = function(sessionUser) {
        var squareData = {
            selectedBoxes: {},
            winners: [],
            userData: sessionUser
        };

        var addWinners = function() {
            Winner.find({}).exec(function(err, docs){
                if (!err) {
                    var winners = [];
                    for (var ii = 0; ii < docs.length; ii++) {
                        var aDoc = docs[ii];
                        squareData.winners[aDoc.quarter-1] = aDoc.boxNumber;
                    }
                    res.send(squareData);
                } else {
                    res.send({err: "No winners have been added" + err});
                }
            });
        };

        Box.find({}).exec(function(err, docs){
            if (!err) {
                var selectedBoxes = {};
                for (var ii = 0; ii < docs.length; ii++) {
                    var aDoc = docs[ii];
                    selectedBoxes[aDoc.index] = aDoc.userId;
                }
                squareData.selectedBoxes = selectedBoxes;
            }
            addWinners();
        });
    }
    SuperBowl.getSessionUser(req, res, onSessionUserFetched);
});

SuperBowl.app.get('/', function(req, res){
    res.header("Content-Type","text/html");
    res.header("Access-Control-Allow-Origin", "*");

    if (!req.session.user) {
        res.redirect('/login');
    } else {
        //var index = fs.readFileSync('../site/html/index-list.html');
        //res.end(index);
        res.render('index.html', {userData: '' + JSON.stringify(req.session.user)});
    }
});

SuperBowl.app.get('/login', function(req, res){
    res.header("Content-Type","text/html");
    res.header("Access-Control-Allow-Origin", "*");
    res.render('login.html');
});

SuperBowl.app.get('/auth/venmo', passport.authenticate('venmo', {
    scope: ['make_payments', 'access_feed', 'access_profile', 'access_email', 'access_phone', 'access_balance', 'access_friends'],
    failureRedirect: '/'
}), usersController.signin);

SuperBowl.app.get('/auth/venmo/callback', passport.authenticate('venmo', {
    failureRedirect: '/'
}), function(req, res) {
    User.findOne({
        'id': req.user.venmo.id
    }, function(err, user) {
        if (!err) {
            req.session.user = user;
        }
        res.redirect('/');
    });
});

SuperBowl.app.get('/auth/logout', function(req, res) {
    req.session.destroy();
    res.header("Content-Type:","application/json");
    res.header("Access-Control-Allow-Origin", "*");
    res.send({success: true});
});

SuperBowl.app.get('/payUp', function(req, res){
    var sessionUserFetched = function(sessionUser) {
        var numberOfBoxes = (sessionUser.amountOwed / boxPrice);
        var paymentInfo = {
            access_token: sessionUser.access_token,
            note: "Super Bowl Square: " + numberOfBoxes + (numberOfBoxes > 1 ? " boxes" : " box"),
            email: "jonathanellenbogen@gmail.com",
            amount: sessionUser.amountOwed
        };
        var paymentSuccess = function(err, r, venmo_receipt) {
            res.header("Content-Type:", "application/json");
            res.header("Access-Control-Allow-Origin", "*");
            var venmo_receipt = JSON.parse(venmo_receipt);

            if (!venmo_receipt.error) {
                var saveTransaction = function(sessionUser) {
                    sessionUser.amountOwed -= paymentInfo.amount;
                    sessionUser.amountPaid += paymentInfo.amount;
                    sessionUser.save(function () {
                        req.session.user = sessionUser;
                        res.send({'success': true, venmo_receipt: venmo_receipt, userData: req.session.user});
                    });
                };
                SuperBowl.getSessionUser(req, res, saveTransaction);
            } else {
                res.send({success: false, error: venmo_receipt.error});
            }
        };
        request.post('https://api.venmo.com/v1/payments', {form: paymentInfo}, paymentSuccess)
    };

    SuperBowl.getSessionUser(req, res, sessionUserFetched);
});

// development only
if ('development' === SuperBowl.app.get('env')) {
    SuperBowl.app.use(errorhandler());
}

SuperBowl.app.listen(8080);

/**
 User.findOne({
        'id': "1497333736931328967"
    }, function(err, user) {
        if (!err) {
            user.amountPaid += 20;
            user.amountOwed -= 20;
            user.save(function () {
                console.log('updated');
            });
        }
    });
 */