var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:3001/meteor';
//var url = 'mongodb://localhost:27017/sarun';
var findRestaurants = function(db, callback) {
   var cursor =db.collection('sensor').find();
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  findRestaurants(db, function() {
      db.close();
      console.log('DB close');
  });
});