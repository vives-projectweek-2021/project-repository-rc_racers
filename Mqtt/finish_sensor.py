import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import time



def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    
client = mqtt.Client()
client.on_connect = on_connect
client.connect("mqtt.devbit.be", 1883, 60) #The program will connecto to the specified address and port number.(mqtt broker from vives)

GPIO.setmode(GPIO.BOARD)
GPIO.setup(11,GPIO.IN)
GPIO.setup(13,GPIO.IN)

test = True
try:
    while True:
        if (GPIO.input(11) == False):            
            client.publish('projectweek2021', payload="Checkpoint1 passed" , qos=0, retain=False)
            print(f"send checkpoint 1 to projectweek2021")
            test = False          
        elif (GPIO.input(13) == False):
            client.publish('projectweek2021', payload="Checkpoint2 passed" , qos=0, retain=False)
            print(f"send checkpoint 2 to projectweek2021")
        else:
            print("no checkpoint passed")
        time.sleep(0.4)
except KeyboardInterrupt:
    GPIO.cleanup()


client.loop_forever()
