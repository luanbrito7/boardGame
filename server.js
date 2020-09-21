import express from 'express'
import http from 'http'
import gameFactory from './public/gameFactory'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

let game = gameFactory()

sockets.on("connection", (socket) => {
    console.log(socket)
})

server.listen(3000, () => {
    console.log("Server running on port 3000")
})
