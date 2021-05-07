// const net = require('net');
import net from 'net'
import express, { Application, Request, Response } from 'express'
import dotenv from 'dotenv'

var cors = require('cors');


dotenv.config()

var app = express()
 
app.use(cors())

app.use(express.json());

let value: number = 0.0;

  
  app.get('/api', async (request: Request, response: Response) => {
    response.json(value)
  })

  app.post('/api', async (request: Request, response: Response) => {
      value = request.body.value
    response.json({ result: 'OK '})
    
  })

const server = net.createServer( (client) => {
    console.log('client connected')
    // if get data from rasp pi send client write
    client.write('http/1.1 200 OK\r\n\r\n<h4>Passed checkpoint 1</h4>')
    //client.write('http/1.1 200 OK\r\n\r\n<h4>Passed checkpoint 2</h4>')
    client.end()
})

server.listen(3000, () => {
    console.log('welcome to port 3000')
})

console.log('*** HTTP Server started ***')
