# Add your Python code here. E.g.
from microbit import *

uart.init(9600)

while True:
    while not uart.any():
        pass
    sleep(500)
    message = uart.read()
    display.scroll(message)
    uart.write('DONE\n')
