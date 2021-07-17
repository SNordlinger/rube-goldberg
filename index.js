const express = require('express');
const axios = require('axios');
const app = express();
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline')

const serial = new SerialPort('COM4', {
  baudRate: 9600
});
const parser = serial.pipe(new Readline({ delimiter: '\n' }))

const port = 8081;

let busy = false;

let messageQueue = [];

app.use(express.json());

app.post('/', (req, res) => {
  if (!req.body.message) {
    return res.statusCode(400)
  }
  messageQueue.push(req.body);
  pushToMicroBit();
  res.sendStatus(200);
})

parser.on('data', () => {
  busy = false
  const messageInfo = messageQueue.shift();
  if (messageInfo.next) {
    axios.post(messageInfo.next, messageInfo.message);
  }
  pushToMicroBit()
})

function pushToMicroBit() {
  if (busy || messageQueue.length === 0) {
    return;
  }
  const message = messageQueue[0].message
  serial.write(message);
  busy = true;
}

app.listen(port, () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`)
})