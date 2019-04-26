
// dependencies
//var BSON = require('bson').BSONPure;
var path = require('path');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// main config
var app = express();
app.set('port', process.env.PORT || 1337);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// passport configuration
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose');

// routes
require('./routes')(app);

app.listen(app.get('port'), function(){
  console.log(("Express server listening on port " + app.get('port')))
});

var io = require('socket.io').listen(http);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('export', function(msg) {
        exportData = JSON.parse(msg);
        var cursor = dataBase.collection('accounts').find({"sceneName": exportData.sceneName});

        cursor.count(function (err, count) {
            if (err != null || count == null || count == 0) {
                dataBase.collection('accounts').insertOne(exportData, function (err, db) {
                    if (err) {
                        throw err;
                    }
                    console.log("Inserted scene " + exportData.sceneName + " for the user");
                });
            }
            else {
                dataBase.collection('testCollection').replaceOne({"sceneName": exportData.sceneName}, exportData, function (err, db) {
                    if (err) {
                        throw err;
                    }
                    console.log("Updated scene " + exportData.sceneName + " for the user");
                });
            }
        });
    });

    socket.on('import', function(msg){
        console.log("Scene " + msg + " Requested");
        var importData = JSON.stringify({"sceneName": msg, 'saveData' : '', 'sessionData':''});
        var cursor = dataBase.collection('accounts').find({"sceneName": msg});

        cursor.count(function (err, count) {
            if (err == null && count > 0) {
                cursor.next(function (err, data) {
                    importData = JSON.stringify(data);
                    console.log('Retrieved the requested scene ' + importData.sceneName);
                    socket.emit('importData',importData);
                });
            }
            else{
                console.log('retrieve failed');
            }
        });
    });
});
