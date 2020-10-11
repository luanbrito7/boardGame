import express from 'express'
import http from 'http'
import serverGame from './serverGame.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

app.use(express.static('public'))

let game = serverGame()

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

    socket.on("roll-dice", (command) => {
        console.log(`receive roll_dice ${command.playerName}`)
        command.playerName = socket.id
        command.input = 'rollDice' 
        game.inputPlayerServer(command)
    })

    socket.on("disconnect", () => {
        game.removePlayer({playerName: socket.id})
    })
})

server.listen(3000, () => {
    console.log("Server running on port 3000")
})
