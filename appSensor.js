var dgram = require("dgram");
var udpServer = dgram.createSocket("udp4");
udpServer.bind(1711);
var Forecast = require('forecast');
var forecast = new Forecast({
  service: 'forecast.io',
  key: 'e3b2eb99261ca529d1772b9970e6c89d',
  units: 'celcius', // Only the first letter is parsed 
  cache: true
});
var dataForecast;
/////////////////////////////////


				
udpServer.on("error", function (err) {
	console.log("udpServer error:\n" + err.stack);
	udpServer.close();
});
udpServer.on('listening', function () {
	var address = udpServer.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});


udpServer.on("message", function (msg, rinfo) {
	msg = msg.toString('utf8', 0, msg.size); 
	console.log('****************************************************************');
	console.log('----------Device number '+msg);
			var MongoClient = require('mongodb').MongoClient;
			var assert = require('assert')
			var ObjectId = require('mongodb').ObjectID;
			var url = 'mongodb://127.0.0.1:3001/meteor';
			////////////////////////////////////   MongoDb
		   var url = 'mongodb://sensor1:159753pao@ds037205.mongolab.com:37205/sensor1';
			var deviceNumber = msg[0] ;
			var d = new Date();
   			var n = d.getTime();
   			//console.log(n);
   			n = n - (d.getMilliseconds() + (d.getSeconds()*1000));
   			//console.log(n);
			var day = d.getDate();
			var hour = d.getHours();
			var minute = d.getMinutes();
			var count = 0;
			var valueSize = 0;
			var month = d.getMonth();
			if(day < 10 ){
				day = "0"+day
			}
			month++
			if(month < 10 ){
				month = "0"+month
			}
			/////////////////////////////////// Date Time
			var soil = parseInt(msg.substring(14, 18)) ;
			var temp = parseFloat(msg.substring(2, 7));
			var humi = parseInt(msg.substring(8, 13));

			console.log('number is '+msg[0]);


   			var date = day+"/"+month+"/"+(d.getYear()+1900);
			console.log(date);
   			///////////////////////////////////////// Value Status
   			var addValue = function(db,callback){

								forecast.get([18.8914895, 99.0179257], function(err, weather) {
								  if(err) return console.dir(err);
								 dataForecast = weather.hourly.data;
								 var forecastSet = [];
								 for(var i = 0 ; i < 24 ; i++){
								 	if( i == hour ){
								 	forecastSet.push(dataForecast[i].icon);
								 	}else{
								 	forecastSet.push('none');	
								 	}
								 }
									////////////////////////////////

									 db.collection('sensor_2').insertOne( 
								 {
								 	"date" : date,
								 	"number" : msg[0],
								 	"soil" : [[n,soil]],
								 	"temp" : [[n,temp]],
								 	"humi" : [[n,humi]],
								 	"forecast" : forecastSet
								 	"lastTime" : hour+":"+minute

							}, function (err, result){
								 assert.equal(err, null); // if err == null
				   				 callback(result);
									});	
						

						});
							

			};
			//////////////////////////////////////////////
			var pushValue = function(db,callback){
						
						 db.collection('sensor_2').updateOne( 
						 
						   { "number" : deviceNumber ,"date" : date},
				    { $set : {"lastTime" : hour+":"+minute}
				    ,$push: { 
				    	"soil": [n,soil] 
				    	,"humi" : [n,humi]
				    	,"temp": [n,temp] } 

					}, function (err, result){
						 assert.equal(err, null); // if err == null
		   				 callback(result);
							});		

			};
			var realtime = function(db,callback){
						
						 db.collection('realtime').updateOne( 
						 
						   { "number" : deviceNumber },
				    { $set : {"soil" : soil,"temp" : temp ,"humi" : humi}
					

					}, function (err, result){
						 assert.equal(err, null); // if err == null
		   				 callback(result);
							});		

			};
			///////////////////////////////////////////////// Working
			MongoClient.connect(url, function(err, db) {

				assert.equal(null, err);
			
				deviceNumber = msg[0];
			
				var cursor =db.collection('sensor_2').find({"date" : date,"number" : deviceNumber});
				realtime(db,function(){
					console.log("real time update.");
					cursor.count(function(error, result) {
					count = result ;
					
						if(count==0){
						

								addValue(db, function() {
									console.log('++++++++++++++++Device '+msg[0]+' Insert Finish.++++++++++++++++');
									db.close();
								});
							
						}else{
		
							if( minute % 10 ==  0) {
									var cursor2 = db.collection('sensor_2').find({"date" : date , "number" : msg[0]}).map(function(u){
										   return u.lastTime;
										}) ;
										cursor2.each(function(err, doc) {
											assert.equal(err, null);
										if (doc != null) {
											var	lastMunite = doc ;

											var targetSize = d.getHours() +":"+ d.getMinutes();
											console.log('lastMunite is '+lastMunite);
											console.log('nowMinute  is '+hour+":"+minute);
											var now = hour+":"+minute;
											if(now != lastMunite  ){
												pushValue(db, function() {
													console.log('++++++++++++++++'+msg[0]+'Push Finish.++++++++++++++++');
													db.close();
													console.log('****************************************************************');
												});
									
										 }else{
												console.log('++++++++++++++++ Time is Not ++++++++++++++++');
												db.close()
												console.log('****************************************************************');
											}

       
     									} 
											
											
										});
							}
							else{
								console.log('Munite not target.');
												db.close()
												console.log('****************************************************************');
							}
						}


				});
				});
			
			});


					
					

				
			
	
	//io.sockets.emit('database insert', box1, dateTime1, temp1, humid1, carbon1, light1, dust1, sound1, room1, latitude1, longitude1, sealevel1, ip1);
});
