import express from 'express'
import http from 'http'
import gameFactory from './public/gameFactory.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

let game = gameFactory()

game.state.cards = game.generateCards()

game.subscribe((command) => {
    console.log(`> Emitting ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on("connection", (socket) => {
    game.addPlayer({
        playerName: socket.id,
        playerX: 0,
        playerY: 0
    })

    socket.emit('gameState', game.state)

    socket.on("move-player", (command) => {
        command.playerName = socket.id
        command.type = 'move-player' 
        game.inputPlayer(command)
    })

    socket.on("disconnect", () => {
        game.removePlayer({playerName: socket.id})
    })
})

server.listen(3000, () => {
    console.log("Server running on port 3000")
})
