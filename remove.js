var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:3001/meteor';
//var url = 'mongodb://client-dceeb70b:771b632b-735a-d450-61e0-a25239c39664@production-db-c3.meteor.io:27017/pao_meteor_com';
var url = 'mongodb://sensor1:159753pao@ds037205.mongolab.com:37205/sensor1';
var remove= function(db, callback) {
   db.collection('sensor').deleteOne({},
      function(err, results) {
         console.log(results);
         callback();
      }
   );
};


	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	    remove(db, function() {
	  db.close();
	  });
	});