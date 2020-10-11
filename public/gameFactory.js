export default function gameFactory() {
    let state = {
        players: {},
        cards: [],
        playerOrder: [],
        turnPlayerIndex: 0
    }

    let observers = []

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function setState(incomingState) {
        Object.assign(state, incomingState)
    }

    function removeCard(command) {
        state.cards.splice(command.index, 1)
        notifyAll({
            type: 'remove-card',
            index: command.index
        })
    }

    function addPlayer(command) {
        state.players[command.playerName] = {
            x: command.playerX,
            y: command.playerY,
            playerName: command.playerName
        }
        const lastPosition = state.turnPlayerIndex
        state.turnPlayerIndex += 1
        state.playerOrder.splice(lastPosition, 0, command.playerName)
        if (state.playerOrder.length == 1) state.turnPlayerIndex = 0
        notifyAll({
            ...command,
            type: 'add-player'
        })
    }

    function removePlayer(command) {
        delete state.players[command.playerName]
        console.log("deleting", command.playerName)
        notifyAll({
            type: 'remove-player',
            playerName: command.playerName
        })
    }

    function movePlayer(command) {
        let player = state.players[command.playerName]
        let diceValue = command.value
        if (player.x + diceValue > 11) {
            player.x = (diceValue + player.x) % 11
            player.y += 1
        } else {
            player.x += diceValue
        }
        notifyAll({
            type: "move-player",
            playerName: player.playerName,
            value: diceValue
        })
        nextRound()
    }

    function nextRound() {
        if (state.turnPlayerIndex >= state.playerOrder.length - 1) {
            state.turnPlayerIndex = 0
        } else {
            state.turnPlayerIndex += 1
        }
    }

    // function inputPlayerClient(command) {
    // }
    
    return {
        state,
        setState,
        addPlayer,
        removePlayer,
        movePlayer,
        removeCard,
        subscribe,
        notifyAll
    }
}  