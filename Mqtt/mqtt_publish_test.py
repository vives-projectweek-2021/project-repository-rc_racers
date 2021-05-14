import paho.mqtt.client as mqtt
import time

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    
client = mqtt.Client()
client.on_connect = on_connect
client.connect("mqtt.devbit.be", 1883, 60)
# send a message to the raspb.erry/topic every 1 second, 5 times in a row.
for i in range(5):
    # the four parameters are topic, sending content, QoS and whether retaining the message respectively
    client.publish('projectweek2021', payload=i, qos=0, retain=False)
    print(f"send {i} to aaron")
    time.sleep(1)

client.loop_forever()