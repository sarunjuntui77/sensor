// Require the module 
var Forecast = require('forecast');
 
// Initialize 
var time = new Date().setHours(12);
var forecast = new Forecast({
  service: 'forecast.io',
  key: 'e3b2eb99261ca529d1772b9970e6c89d',
  units: 'celcius', // Only the first letter is parsed 
  cache: true
});
 var data = [] ;
// Retrieve weather information from coordinates (Sydney, Australia) 
forecast.get([18.8914895, 99.0179257], function(err, weather) {
  if(err) return console.dir(err);
 data = weather.hourly.data;


  				var forecastSet = [];
						 for(var i = 0 ; i < 50   ; i++){
		 console.log(data[i].dewPoint + ","+data[i].humidity);
				
				 }
				
});
 
 