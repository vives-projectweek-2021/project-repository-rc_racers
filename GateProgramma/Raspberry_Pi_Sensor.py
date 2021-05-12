import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)
GPIO.setup(11,GPIO.IN)


try:
  while True:
    if (GPIO.input(11) == True):
      print ("closed")
    else:
      print ("open")

except KeyboardInterrupt:
    GPIO.cleanup()