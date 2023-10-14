#include "Keyboard.h"
#include <EEPROM.h>

const int buttonPin = 18;  // input pin for pushbutton
const int delayEepromAddress = 0;
int previousButtonState = HIGH;  // for checking the state of a pushButton
int delayVal = 0;

void writeIntIntoEEPROM(int address, int number) {
  byte byte1 = number >> 8;
  byte byte2 = number & 0xFF;
  EEPROM.write(address, byte1);
  EEPROM.write(address + 1, byte2);
}

int readIntFromEEPROM(int address) {
  byte byte1 = EEPROM.read(address);
  byte byte2 = EEPROM.read(address + 1);
  return (byte1 << 8) + byte2;
}


void setup() {
  Serial.begin(9600);
  // put your setup code here, to run once:
  // make the pushButton pin an input:
  pinMode(buttonPin, INPUT);
  // initialize control over the keyboard:
  Keyboard.begin();
  delayVal = readIntFromEEPROM(delayEepromAddress);
}

void loop() {
  if (Serial.available() > 0) {
    String cmd = Serial.readString();
    int intValue = cmd.toInt();
    if (intValue != 0 || cmd == "0") {
      delayVal = intValue;
      writeIntIntoEEPROM(delayEepromAddress, delayVal);
      Serial.write("Successfully wrote Delay of ");
      Serial.print(String(delayVal));
      Serial.write(" ms into EEPROM\n");
    } else {
      if (cmd == "get") {
        Serial.print(delayVal);
      }
    }
  }
  int buttonState = digitalRead(buttonPin);
  // if the button state has changed,
  if ((buttonState != previousButtonState) && (buttonState == HIGH)) {
    delay(delayVal);
    Keyboard.print(" ");
  }
  previousButtonState = buttonState;
}
