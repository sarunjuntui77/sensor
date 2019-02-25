#include "DHT.h";
#define DHTPIN 2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const int analogInPin = A0;
int sensorValue = 0;

int ledB =  12;
int ledR =  9;
int ledG =  11;

#include<TEE_ESP_WIFI.h>
#include <SoftwareSerial.h>
#define pinEN  10
#define ESP_Rx 7
#define ESP_Tx 8

String ssid = "AC@WiFi";
String pass = "admin1201";
String serverip = "104.236.186.15";
String port = "1711";
long previousMillis = 0;
long interval = 1000;

ESP wifi(ESP_Rx, ESP_Tx, pinEN);

void print_debug(String data)
{
  Serial.print(data);
}

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(ledR, OUTPUT);
  pinMode(ledG, OUTPUT);
  pinMode(ledB, OUTPUT);

  wifi.begin(9600);
  Serial.println("ESP8226");
  Serial.println(serverip);
  wifi.Event_debug = print_debug;
  wifi.reset();
  wifi.setmode(STATION);
  wifi.disconnectAP();
  wifi.connectAP(ssid, pass);
  wifi.multipleconnect(SINGLE);
  String ip = wifi.myip();
  wifi.startclient("UDP", serverip, port);
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  sensorValue = analogRead(analogInPin);
  sensorValue = 1024 - sensorValue ;
  if (sensorValue < 0) {
    sensorValue *= -1 ;
  }
  digitalWrite(ledG, HIGH);
  delay(300);
  digitalWrite(ledB, HIGH);
  delay(100);
  digitalWrite(ledG, LOW);
  digitalWrite(ledB, LOW);
  delay(1);
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.println(" %");
  Serial.print("Temperature: ");
  Serial.print(t);
  Serial.println(" *C");
  Serial.print("Soil moiture : " );
  Serial.println(sensorValue);
  Serial.println("==========================" );
  String temp = String(t);
  String humi = String(h);
  String soil = String(sensorValue);
  Serial.println("2," + temp + "," + humi + "," + soil);
  if (!wifi.print("2," + temp + "," + humi + "," + soil))
  {
    wifi.stop();
    wifi.startclient("UDP", serverip, port);
  }

  delay(10000);
}
