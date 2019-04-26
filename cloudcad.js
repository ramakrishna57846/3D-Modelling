var express = require('express');
var path    = require('path');
var cloudcad = express();
cloudcad.use(express.static(__dirname + '/app'));

cloudcad.get('/',function(req,res){
    res.sendfile(path.join(__dirname,'/index.html'));
});

var dataBase;

var server = cloudcad.listen(1337, function() {
    console.log('Listening on port %d', server.address().port);

    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb://localhost:27017/passport_local_mongoose', function(err, db) {
        dataBase = db;
        if (err) {
            throw err;
        }
    });
});

var io = require('socket.io').listen(server);

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
