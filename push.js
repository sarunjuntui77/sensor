
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://127.0.0.1:3001/meteor';
var url = 'mongodb://sensor1:159753pao@ds037205.mongolab.com:37205/sensor1';


var n = 1450026029000;
var date = "24/12/2015";
setInterval(function(){
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);

		n = n + (10*60*1000);
		var d = new Date();
		

		var random1 = Math.floor((Math.random() * (1024 - 100 +1)) + 100);
		var random2 = Math.floor((Math.random() * (45 - 20 +1)) + 20);
		var random3 = Math.floor((Math.random() * (100 - 40 + 1)) + 40);
		

		var day =  d.getDate()+"";
		if(day < 10 ){
			day = "0"+day;
		}

		var n2 = day+"/"+(d.getMonth()+1)+"/"+(d.getYear()+1900);	
		console.log(n2);
		db.collection('sensor').updateOne(
			{ "number" : "1"+"", "date" : date},
			{ $push: { soil: [n,random1] ,humi : [n,random3],temp: [n,random2]} }
			, function(err, results) {
				db.close();
				console.log('gen success');
			});

		
		
	} );
	

},1000	);
