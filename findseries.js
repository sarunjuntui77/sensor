var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://127.0.0.1:3001/meteor';
var url = 'mongodb://sensor1:159753pao@ds037205.mongolab.com:37205/sensor1';


MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  var text = "date";
  var date = "12/12/2015";
  var query = {};
  query[text] = date;

  var date = "12/12/2015";
  number = "2";
//  var cursor =db.collection('sensor').find();

//    // cursor.count(function(err, doc) {
    
//    //    console.log(doc);
//    //   db.close();
     
//    // });

// 	console.log(cursor);
// });
var cursor = db.collection('sensor').find({"date" : "21/01/2016" , "number" : "1"}).map(function(u){
   return u.soil;
}) ;


  cursor.each(function(err, doc) {
  
      console.log(doc);
    db.close();

  });

});