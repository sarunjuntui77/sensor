var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
// var url = 'mongodb://localhost:27017/test';
var url = 'mongodb://sensor1:159753pao@ds037205.mongolab.com:37205/sensor1';
 var d = new Date();
                 
var n = d.getTime();
var updateRestaurants = function(db, callback) {
   db.collection('sensor_2').updateMany(
      {},
      {
        $set: { "forecast": ["rain","rain","rain","rain","rain"
        ,"rain","rain","rain","rain"
        ,"rain","rain","rain","rain"
        ,"rain","rain","rain","rain"
         ,"rain","rain","rain","rain"
        ,"rain","rain","rain",] },
        
      }, function(err, results) {
      console.log(results);
      callback();
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  updateRestaurants(db, function() {
      db.close();
  });
});