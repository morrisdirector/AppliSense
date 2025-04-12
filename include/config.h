
#ifndef CONFIG_H
#define CONFIG_H

#include <Arduino.h>
#include <ArduinoJson.h>

#include "constants.h"
#include "eeprom-service.h"

#define STRING_SIZE 45
#define STRING_SIZE_SMALL 25

enum class Conf
{
  // Device
  DEVICE_CONFIG_VERSION = 1,
  DEVICE_NAME,
  // Network
  NETWORK_IP1,
  NETWORK_IP2,
  NETWORK_IP3,
  NETWORK_IP4,
  NETWORK_GATEWAY1,
  NETWORK_GATEWAY2,
  NETWORK_GATEWAY3,
  NETWORK_GATEWAY4,
  NETWORK_SUBNET1,
  NETWORK_SUBNET2,
  NETWORK_SUBNET3,
  NETWORK_SUBNET4,
  NETWORK_SSID,
  NETWORK_PASS,
  NETWORK_DHCP,
  // Access Point
  ACCESS_POINT_PASS,
  // MQTT
  MQTT_ENABLED,
  MQTT_CLIENT_ID,
  MQTT_USER,
  MQTT_PASSWORD,
  MQTT_IP1,
  MQTT_IP2,
  MQTT_IP3,
  MQTT_IP4,
  MQTT_PORT,
  MQTT_DEVICE_TOPIC,
  MQTT_AUTO_DISCOVERY,
  // SAVED STATE
  STATE_ON_THRESHOLD,
  STATE_OFF_THRESHOLD,
  STATE_INTERVAL
};

struct IPv4
{
  uint8_t a = 0;
  uint8_t b = 0;
  uint8_t c = 0;
  uint8_t d = 0;
};

struct IPGateway
{
  uint8_t a = 192;
  uint8_t b = 168;
  uint8_t c = 1;
  uint8_t d = 1;
};

struct IPSubnet
{
  uint8_t a = 255;
  uint8_t b = 255;
  uint8_t c = 255;
  uint8_t d = 0;
};
struct DeviceConfig
{
  float configVersion = 0.0; // Major version = incompatable config; Minor version = backwards compatable
  char name[STRING_SIZE] = "Lumenator";
};

struct NetworkConfig
{
  char ssid[STRING_SIZE];
  char pass[STRING_SIZE_SMALL];
  bool dhcp = true;
  IPv4 ip;
  IPGateway gateway;
  IPSubnet subnet;
};

struct AccessPointConfig
{
  char pass[STRING_SIZE_SMALL];
};

struct SavedState
{
  uint16_t onThreshold = 255;
  uint16_t offThreshold = 0;
  uint16_t interval = 10000;
};

struct MqttConfig
{
  bool enabled = false;
  IPv4 ip;
  uint16_t port;
  char clientId[STRING_SIZE_SMALL];
  char user[STRING_SIZE];
  char pass[STRING_SIZE_SMALL];
  bool autoDiscovery = false;
  // Base Topic
  char topic[STRING_SIZE] = "applisense";
  // Generated Topics
  char configTopic[50];
  char availTopic[50];
  char stateTopic[50];
  char commandTopic[50];
};

DeviceConfig deviceConfig;
NetworkConfig networkConfig;
AccessPointConfig accessPointConfig;
MqttConfig mqttConfig;
SavedState savedState;

const int configJsonTotalCapacity = EEPROM_SIZE;

bool hasCharValue(char *val)
{
  return strlen(val) && strncmp(val, "null", 4) != 0;
}

char dtoBuffer[CONFIG_DTO_SIZE];

void serializeAll()
{
  DynamicJsonDocument doc(2048);
  JsonArray arr = doc.to<JsonArray>();

  arr.add(nullptr); // First item is null to align enums with indexes

  arr.add((float)deviceConfig.configVersion);
  arr.add(deviceConfig.name);

  arr.add((uint8_t)networkConfig.ip.a);
  arr.add((uint8_t)networkConfig.ip.b);
  arr.add((uint8_t)networkConfig.ip.c);
  arr.add((uint8_t)networkConfig.ip.d);

  arr.add((uint8_t)networkConfig.gateway.a);
  arr.add((uint8_t)networkConfig.gateway.b);
  arr.add((uint8_t)networkConfig.gateway.c);
  arr.add((uint8_t)networkConfig.gateway.d);

  arr.add((uint8_t)networkConfig.subnet.a);
  arr.add((uint8_t)networkConfig.subnet.b);
  arr.add((uint8_t)networkConfig.subnet.c);
  arr.add((uint8_t)networkConfig.subnet.d);

  arr.add(hasCharValue(networkConfig.ssid) ? networkConfig.ssid : nullptr);
  arr.add(hasCharValue(networkConfig.pass) ? networkConfig.pass : nullptr);
  arr.add((bool)networkConfig.dhcp);

  arr.add(hasCharValue(accessPointConfig.pass) ? accessPointConfig.pass : nullptr);

  arr.add((bool)mqttConfig.enabled);
  arr.add(hasCharValue(mqttConfig.clientId) ? mqttConfig.clientId : nullptr);
  arr.add(hasCharValue(mqttConfig.user) ? mqttConfig.user : nullptr);
  arr.add(hasCharValue(mqttConfig.pass) ? mqttConfig.pass : nullptr);

  arr.add((uint8_t)mqttConfig.ip.a);
  arr.add((uint8_t)mqttConfig.ip.b);
  arr.add((uint8_t)mqttConfig.ip.c);
  arr.add((uint8_t)mqttConfig.ip.d);

  arr.add((uint16_t)mqttConfig.port);
  arr.add(hasCharValue(mqttConfig.topic) ? mqttConfig.topic : nullptr);
  arr.add((bool)mqttConfig.autoDiscovery);

  arr.add((uint16_t)savedState.onThreshold);
  arr.add((uint16_t)savedState.offThreshold);
  arr.add((uint16_t)savedState.interval);

  serializeJson(arr, dtoBuffer);
}

bool configCompatabilityCheck()
{
  return ((int)deviceConfig.configVersion == CONFIG_MAJOR_VERSION_COMPATABILITY);
}

void deserializeAll(DynamicJsonDocument json)
{

  JsonArray arr = json.as<JsonArray>();

  deviceConfig.configVersion = (float)arr[(int)Conf::DEVICE_CONFIG_VERSION];

  if (!configCompatabilityCheck())
  {
    Serial.println("***** Detected incompatable configuration version *****");
    clearEEPROM();
    return;
  }

  strlcpy(deviceConfig.name, arr[(int)Conf::DEVICE_NAME] | deviceConfig.name, STRING_SIZE);

  networkConfig.ip.a = (uint8_t)arr[(int)Conf::NETWORK_IP1];
  networkConfig.ip.b = (uint8_t)arr[(int)Conf::NETWORK_IP2];
  networkConfig.ip.c = (uint8_t)arr[(int)Conf::NETWORK_IP3];
  networkConfig.ip.d = (uint8_t)arr[(int)Conf::NETWORK_IP4];

  networkConfig.gateway.a = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY1];
  networkConfig.gateway.b = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY2];
  networkConfig.gateway.c = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY3];
  networkConfig.gateway.d = (uint8_t)arr[(int)Conf::NETWORK_GATEWAY4];

  networkConfig.subnet.a = (uint8_t)arr[(int)Conf::NETWORK_SUBNET1];
  networkConfig.subnet.b = (uint8_t)arr[(int)Conf::NETWORK_SUBNET2];
  networkConfig.subnet.c = (uint8_t)arr[(int)Conf::NETWORK_SUBNET3];
  networkConfig.subnet.d = (uint8_t)arr[(int)Conf::NETWORK_SUBNET4];

  strlcpy(networkConfig.ssid, arr[(int)Conf::NETWORK_SSID] | networkConfig.ssid, STRING_SIZE);
  strlcpy(networkConfig.pass, arr[(int)Conf::NETWORK_PASS] | networkConfig.pass, STRING_SIZE_SMALL);
  networkConfig.dhcp = (bool)arr[(int)Conf::NETWORK_DHCP];

  strlcpy(accessPointConfig.pass, arr[(int)Conf::ACCESS_POINT_PASS] | accessPointConfig.pass, STRING_SIZE_SMALL);

  mqttConfig.enabled = (bool)arr[(int)Conf::MQTT_ENABLED];
  strlcpy(mqttConfig.clientId, arr[(int)Conf::MQTT_CLIENT_ID] | mqttConfig.clientId, STRING_SIZE_SMALL);
  strlcpy(mqttConfig.user, arr[(int)Conf::MQTT_USER] | mqttConfig.user, STRING_SIZE);
  strlcpy(mqttConfig.pass, arr[(int)Conf::MQTT_PASSWORD] | mqttConfig.pass, STRING_SIZE_SMALL);

  mqttConfig.ip.a = (uint8_t)arr[(int)Conf::MQTT_IP1];
  mqttConfig.ip.b = (uint8_t)arr[(int)Conf::MQTT_IP2];
  mqttConfig.ip.c = (uint8_t)arr[(int)Conf::MQTT_IP3];
  mqttConfig.ip.d = (uint8_t)arr[(int)Conf::MQTT_IP4];

  mqttConfig.port = (uint16_t)arr[(int)Conf::MQTT_PORT];

  strlcpy(mqttConfig.topic, arr[(int)Conf::MQTT_DEVICE_TOPIC] | mqttConfig.topic, STRING_SIZE);
  mqttConfig.autoDiscovery = (bool)arr[(int)Conf::MQTT_AUTO_DISCOVERY];

  savedState.onThreshold = (uint16_t)arr[(int)Conf::STATE_ON_THRESHOLD];
  savedState.offThreshold = (uint16_t)arr[(int)Conf::STATE_OFF_THRESHOLD];
  savedState.interval = (uint16_t)arr[(int)Conf::STATE_INTERVAL];

  Serial.println();
  Serial.println("[DS]: * Loaded device configuration");
}

void commitConfiguration(char dto[CONFIG_DTO_SIZE])
{
  clearEEPROM();
  writeEEPROM(dto);
}

bool saveConfiguration(char dto[CONFIG_DTO_SIZE])
{
  const char *dBuffer = dto; // Needs to hold char[] in a const for deserializJson to work properly
  Serial.println("Config to save: ");
  Serial.println(dBuffer);
  PL(___);
  DynamicJsonDocument json(2048);
  DeserializationError error = deserializeJson(json, dBuffer);
  if (error)
  {
    Serial.println("");
    Serial.println("------- Save Configuration Parse Error -------");
    return false;
  }

  deserializeAll(json);

  commitConfiguration(dto);

  return true;
}

#endif