 var d = new Date();
 var n = d.getTime();
 var n2 = d.getDate()+"";

var day = d.getDate();
 if(day < 10 ){
 	day = "0"+day;
 }

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var n2 = day+"/"+(d.getMonth()+1)+"/"+(d.getYear()+1900);	
 console.log(n2);
				var ObjectId = require('mongodb').ObjectID;
				//var url = 'mongodb://127.0.0.1:3001/meteor';
				var url = 'mongodb://sensor1:159753pao@ds037205.mongolab.com:37205/sensor1';
					var addValue = function(i,db,callback){
						var minute = (d.getMinutes()*1000) + d.getMilliseconds();
                        n = n - minute;
						 db.collection('sensor').insertOne( 
						{
    
                            "date" : "24/12/2015",
                            "number" : i+"",
                            "soil" : [[1450026029000,670]],
                            "temp" : [[1450026029000,25]],
                            "humi" : [[1450026029000,48]]
                        }, function (err, result){
						 assert.equal(err, null); // if err == null
						
		   				 callback(result);
							});		

						};
						///////////////////////////
					
					MongoClient.connect(url, function(err, db) {
				  assert.equal(null, err);
				  addValue("1",db, function() {
				  console.log('finish');
				  db.close();
				  });
			
				 });
					// MongoClient.connect(url, function(err, db) {
				 //  assert.equal(null, err);
				 //  addValue("2",db, function() {
				 //  console.log('finish');
				 //  db.close();
				 //  });
			
				 // });

					// MongoClient.connect(url, function(err, db) {
				 //  assert.equal(null, err);
				 //  addValue("3",db, function() {
				 //  console.log('finish');
				 //  db.close();
				 //  });
			
				 // });


