#include <Arduino.h>

//  D1 Mini Pin Number Reference:
//  D0  16
//  D1  5
//  D2  4
//  D3  0
//  D4  2  (also this is the built in LED)
//  D5  14
//  D6  12
//  D7  13
//  D8  15
//  TX  1
//  RX  3

// LED pin definition
const int LED_PIN = 2;

void setup()
{
  // Initialize LED pin as output
  pinMode(LED_PIN, OUTPUT);
}

void loop()
{
  // Turn LED on
  digitalWrite(LED_PIN, HIGH);
  // Wait for 1 second
  delay(1000);
  // Turn LED off
  digitalWrite(LED_PIN, LOW);
  // Wait for 1 second
  delay(1000);
}