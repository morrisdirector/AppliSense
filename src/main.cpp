#include <Arduino.h>

#include <DNSServer.h>
#include <EEPROM.h>
#include <ESP8266WiFi.h>

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

bool apMode = false; // True when in "setup" access point mode is on
IPAddress apIP(192, 168, 4, 1);
IPAddress apSubnet(255, 255, 255, 0);

// DNS server
const byte DNS_PORT = 53;
DNSServer dnsServer;

WiFiClient espClient;

#include "constants.h"
#include "config.h"
#include "state.h"

void setupWriteSettings()
{
  analogWriteRange(255);
  analogWriteFreq(880);
}

void initialStartup()
{
  // Serial port for debugging purposes
  Serial.begin(115200);
  PL();
  P("Starting AppliSense...");
  PL();
}

void printWiFiStatus()
{
  PL();
  PL(___);
  PL("Connected to wifi");
  P("Status: ");
  PL(WiFi.status());
  P("IP: ");
  PL(WiFi.localIP());
  P("Subnet: ");
  PL(WiFi.subnetMask());
  P("Gateway: ");
  PL(WiFi.gatewayIP());
  P("SSID: ");
  PL(WiFi.SSID());
  P("Signal: ");
  PL(WiFi.RSSI());
  P("Networks: ");
  PL(WiFi.scanNetworks());
  PL(___);
}

void startAccessPoint()
{

  PL("Starting access point");

  apMode = true;
  WiFi.disconnect();
  delay(100);

  char nameBuff[50];
  int randomId = random(1000, 9999);
  sprintf(nameBuff, "Lumenator Setup - %d", randomId);
  WiFi.softAPConfig(apIP, apIP, apSubnet);
  WiFi.softAP(nameBuff);
  delay(500); // Without delay I've seen the IP address blank

  P("AP IP address: ");
  PL(WiFi.softAPIP());

  /* Setup the DNS server redirecting all the domains to the apIP */
  dnsServer.setErrorReplyCode(DNSReplyCode::NoError);
  dnsServer.start(DNS_PORT, "*", apIP);
}

void startWiFi()
{

  PL();
  PL("Connecting to WiFi:");

  if (networkConfig.dhcp == false)
  {
    PL("Static IP: ");
    P(networkConfig.ip.a);
    P(".");
    P(networkConfig.ip.b);
    P(".");
    P(networkConfig.ip.c);
    P(".");
    PL(networkConfig.ip.d);

    IPAddress local_IP(networkConfig.ip.a, networkConfig.ip.b, networkConfig.ip.c, networkConfig.ip.d);
    IPAddress gateway(192, 168, 1, 1);
    IPAddress subnet(255, 255, 0, 0);
    WiFi.config(local_IP, gateway, subnet);
  }

  WiFi.begin(networkConfig.ssid, networkConfig.pass);

  int i = 0;
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);

    P(".");

    if (i >= 30)
      break;
    i = ++i;
  }
  if (WiFi.status() == WL_CONNECTED)
  {

    P("Status: ");
    PL(WiFi.status());
    printWiFiStatus();
  }
  else
  {

    PL("Failed");

    startAccessPoint();
  }
}

void resetPreviousConnections()
{
  WiFi.disconnect();
  WiFi.softAPdisconnect(true);
}

void setupWirelessConnection()
{
  if (strlen(networkConfig.ssid) && strlen(networkConfig.pass))
  {
    startWiFi();
  }
  else
  {
    startAccessPoint();
  }
}

void setupEEPROM()
{
  EEPROM.begin(EEPROM_SIZE); // Initialising EEPROM
  delay(10);
}

void readConfigJson(String configuration)
{
  if (configuration.length())
  {
    DynamicJsonDocument json(2048);
    DeserializationError error = deserializeJson(json, configuration);
    if (error)
    {

      P(error.c_str());

      PL();
      PL("----- Cannot Parse Configuration -----");
      PL();

      if (configuration[0] != 0)
        clearEEPROM();
      return;
    }
    deserializeAll(json);
  }
}

void setup()
{
  setupWriteSettings();         // Setup analog write settings
  initialStartup();             // Setup environment
  resetPreviousConnections();   // Reset previous connections
  setupEEPROM();                // Setup EEPROM
  readConfigJson(readEEPROM()); // Read config from EEPROM
  setStateFromSaved();          // Load saved state from EEPROM
  // updateLumenatorLevels(true);  // Turn light on immediately on boot up
  // setupWirelessConnection();    // Connect to WiFi or start access point
  // setupWebServer();             // Start web server and assign callback
  // setupWebSockets();            // Start web socket server and assign callback
  // setupMqtt();                  // Setup MQTT
  // setupE131();                  // Setup E131
}

void loop()
{
  // webSocket.loop();               // Handle web socket events
  // handleE131Loop();               // Handle E131 events
  // handleMQTTLoop();               // Handle MQTT events
  // server.handleClient();          // Handle webserver requests
  dnsServer.processNextRequest(); // Handle dns requests
  // saveLevelsQueue();              // Save levels to eeprom if marked for save
}