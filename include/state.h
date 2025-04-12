#ifndef STATE_H
#define STATE_H

#include <ArduinoJson.h>
#include "constants.h"
#include "config.h"

struct AppliSenseState
{
  uint16_t onThreshold = 255;
  uint16_t offThreshold = 0;
  uint16_t interval = 10000;
};

AppliSenseState appliSenseState;

void printCurrentState()
{
  PL(___);
  PL("*** Current AppliSenseState ***");
  P("onThreshold: ");
  PL(appliSenseState.onThreshold);
  P("offThreshold: ");
  PL(appliSenseState.offThreshold);
  P("interval: ");
  PL(appliSenseState.interval);
  PL(___);
}

void updateAppliSenseState(uint16_t onThreshold, uint16_t offThreshold, uint16_t interval)
{
  appliSenseState.onThreshold = onThreshold;
  appliSenseState.offThreshold = offThreshold;
  appliSenseState.interval = interval;
}

void saveLevels()
{
  // Update Saved State
  savedState.onThreshold = (uint16_t)appliSenseState.onThreshold;
  savedState.offThreshold = (uint16_t)appliSenseState.offThreshold;
  savedState.interval = (uint16_t)appliSenseState.interval;

  serializeAll();
  commitConfiguration(dtoBuffer);
  PL("Data Saved:");
  PL(dtoBuffer);
  PL(___);
}

unsigned long lastSaveAttemptTime = 0;
unsigned long saveDelay = 3000;
bool markedForSave = false;

void markForSave()
{
  lastSaveAttemptTime = millis();
  markedForSave = true;
}

void saveLevelsQueue()
{
  if (markedForSave == true && (millis() - lastSaveAttemptTime) > saveDelay)
  {
    lastSaveAttemptTime = millis();
    markedForSave = false;
    saveLevels();
  }
}

void setStateFromSaved()
{
  appliSenseState.onThreshold = savedState.onThreshold;
  appliSenseState.offThreshold = savedState.offThreshold;
  appliSenseState.interval = savedState.interval;
}

#endif