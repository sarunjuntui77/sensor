// /dev/ttyACM0
var mongojs = require("mongojs");
var uri = "mongodb://localhost/rfid",
    db = mongojs(uri, ["logrfids"]);

var statemastercard;
var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 115200
}, false); 

var pushbots = require('pushbots');
var Pushbots = new pushbots.api({
    id:'5567378f177959453f8b4567',
    secret:'53a0cae0cabc774f7633ab303ea83a16'
});

var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost/rfid');
var Schema = mongoose.Schema;
var rfidSchema = new Schema({
    rfidtag : String,
    rfidroom : String
});
var rfiddb = mongoose.model('addrfid', rfidSchema);

var logdoor = mongoose.logdoor;
var logSchema = new Schema({
    rfidtag : String,
    logdate : String,
    rfidroom : String
});
var logdb = mongoose.model('logrfid', logSchema);

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    nodemailer = require('nodemailer');
var webRTC = require('webrtc.io').listen(server);
var port = process.env.PORT || 3000; 
    server.listen(port);
var bodyParser = require("body-parser");

    app.use(bodyParser.urlencoded({ extended: false }));

    
    
    app.get('/',function(req,res){
        res.sendfile("/home/pi/node/builing/index.html");
    });


    app.get('/rtc_index',function(req,res){
        res.sendfile("/home/pi/node/builing/rtc_index.html");
    });

    app.get('/addroom',function(req,res){
        res.sendfile("/home/pi/node/builing/addroom.html");
    });

    app.get('/Head.png',function(req,res){
        res.sendfile("/home/pi/node/builing/Head.png");
    });

    app.get('/bg.jpg',function(req,res){
        res.sendfile("/home/pi/node/builing/bg.jpg");
    });
   

     app.get('/style.css',function(req,res){
        res.sendfile("/home/pi/node/builing/style.css");
    });

    app.get('/ionic.css',function(req,res){
        res.sendfile("/home/pi/node/builing/ionic.css");
    });

    app.get('/manifest.json',function(req,res){
        res.sendfile("/home/pi/node/builing/manifest.json");
    });

    app.get('/pushbots-chrome.js',function(req,res){
        res.sendfile("/home/pi/node/builing/pushbots-chrome.js");
    });

    app.get('/service-worker.js',function(req,res){
        res.sendfile("/home/pi/node/builing/service-worker.js");
    });

    app.get('/script.js', function(req, res) {
      res.sendfile('/home/pi/node/builing/script.js');
    });

    app.get('/webrtc.io.js', function(req, res) {
       res.sendfile('/home/pi/node/builing/webrtc.io.js');
    });

    app.get('/socket.io.js', function(req, res) {
       res.sendfile('/home/pi/node/builing/socket.io.js');
    });


    io.on('connection', function(socket){
        // console.log('browser connected');
    });
  
    var transporter = nodemailer.createTransport('smtps://fertigation.aclab%40gmail.com:fertigation54@smtp.gmail.com');
 

    app.post('/addroomPost',function(req,res){
        var rfid=req.body.txtrfid;
        var room=req.body.txtroom;
        console.log(rfid+' - '+room);
            rfiddb.findOneAndUpdate({ rfidtag: rfid }, { rfidroom: room }, function(err, res) {
              if (err) throw err;
              console.log('update room complate');
            });
            res.end("yes");
    });

    app.get('/log', function(req, res){
    res.writeHead(200, {"Content-Type": "text/html"});
    db.logrfids.find({}, function(err, records) {
        if(err) {
            console.log("There was an error executing the database query.");
            res.end();
            return;
        }
        var html = '<meta name="viewport" content="width=device-width,height=device-height,initial-scale=1.0"/><h1>LOG</h1>',
        i = records.length;
        while(i--) {
            html += ''
            // +'<style> @font-face {font-family: myFirstFont;src: url(https://www.dropbox.com/s/jax3p5m7e6kkz6f/Nemesia-light.ttf);} body {font-family: myFirstFont;}</style>'
            +'<li><p>' 
            + records[i].logdate
            + ' <b>|</b> ' 
            + records[i].rfidtag
            + '<b> Room : </b>' 
            + records[i].rfidroom
            + '</p></li>' ;
        }
        res.write(html);
        res.end();
    });
});

serialPort.open(function (error) {
    // app.get('/btnopendoor', function(req, res){
    //     // res.writeHead(200, {'Content-Type': 'text/plain'});
        
    //     serialPort.write("1\r");
    //     res.end("<script >function goBack() {javascript: history.go(-1);}function timer() {setTimeout('goBack()', 1000);}window.onload=timer;</script> PLEASE WAIT!!");
    // });// app.get /btnopendoor' 

    io.sockets.on('connection', function(socket) {
        socket.on('opendoor', function(data) {
            serialPort.write("1\r");
            opdr();
            console.log('Door open by Smartphone');

            // setup e-mail data with unicode symbols 

        }); 
    });  
    function opdr(){
           io.sockets.emit('openSmartphone', 'opddoor'); 
    }   
    if ( error ) {
        console.log('failed to open: '+error);
    } else {
        serialPort.on('data', function(data) {
            var getdata = data.toString().trim();
          console.log(getdata);
          if(getdata.length == 8 || getdata == "noti" || getdata == "dooropen" || getdata == "btn5" || getdata == "btn4"){
                if(getdata == "btn5"){
                    console.log('openlewnaaa');
                    console.log("button direct door is OPEN");
                }else if(getdata == "btn4"){
                    opdr();
                    console.log("door open");
                }else if(getdata == "noti"){

                    var mailOptions = {
                        from: 'building', // sender address 
                        to: 'gamegohhop04@gmail.com', // list of receivers 
                        subject: 'มีคนอยู่หน้าประตู', // Subject line 
                        text: 'มีแขกอยู่หน้าประตูบ้าน', // plaintext body 
                        html: '' // html body 
                    };
                     
                    // send mail with defined transport object 
                    transporter.sendMail(mailOptions, function(error, info){
                        if(error){
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    });
                }else if(getdata == "dooropen"){
                    Pushbots.setMessage("🚩🚩ประตูถูกเปิดทิ้งไว้" ,1);
                    Pushbots.customNotificationTitle("🆕SMART BUPA ALERT!!");

                    Pushbots.push(function(response){
                        console.log("Send notification to all Device");
                    });

                    var token = "AIzaSyAt6_JCw2hk5nrFy0PGMaD_8vDELdvznDU";
                    Pushbots.pushOne(token, function(response){
                        console.log("Send notification to all Device");
                    });
                }else{
                    if (statemastercard == true) {
                        var addrfid = new rfiddb({
                            rfidtag: getdata
                        });
                        addrfid.save(function(err, data) {
                            if (err) return console.error(err);
                            console.dir(data);
                            statemastercard = false;
                        });
                    }
                    if(getdata == 'b3a98700'){
                        serialPort.write("3\r");
                        console.log('This is MasterKey');
                        statemastercard = true;
                    }else{
                        rfiddb.find({rfidtag: getdata},function(err, record) {
                            if (err) return console.error(err);
                            if (record.length == 0){ 
                              console.log('CLOSE :' + record.rfidtag);
                              serialPort.write("2\r");
                            }else {
                                record.forEach(function(record){
                                    opdr();
                                    console.log('OPEN :' + record.rfidtag);
                                    var room = record.rfidroom;
                                    // console.log(room);
                                    serialPort.write("1\r");

                                    var date = new Date();
                                    var year = date.getFullYear();
                                    var month = date.getMonth() + 1;      // "+ 1" becouse the 1st month is 0
                                    var day = date.getDate();
                                    var hour = date.getHours();
                                    var minutes = date.getMinutes();
                                    var secconds = date.getSeconds()
                                    var ptrinttime = day+ '/'+ month+ '/'+ year+ ' '+ hour+ ':'+ minutes+ ':'+ secconds;

                                    var logrfid = new logdb({
                                        rfidtag: getdata,
                                        logdate: ptrinttime,
                                        rfidroom : room
                                    });
                                    logrfid.save(function(err, data) {
                                        if (err) return console.error(err);
                                        console.dir(data);
                                        statemastercard = false;
                                    });

                                });
                            }
                        });   
                        // rfiddb.remove(function(err) {
                        //     if (err) return console.error(err);
                        //     console.log('REMOVE ALL');
                        // });    
                    }// else masterkey
                } // noti
            } // if check 8
        });
        serialPort.write("ls\n", function(err, results) {
            console.log('ready!! ');
        });
    } // else all
}); // serialPort