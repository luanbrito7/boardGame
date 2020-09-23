export default function gameFactory() {
    let state = {
        players: {},
        cards: []
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

    function generateCards() {
        let numberOfCards = 44;
        let cards = []
        for (let i = 1; i < numberOfCards; i++) {
            let card = {
                x: getRandomInt(0,11),
                y: getRandomInt(0,11),
                value: getRandomInt(0,6)
            }
            while (!allowedPosition(card)) {
                card.x = getRandomInt(0,11)
                card.y = getRandomInt(0,11)
            }
            cards.push(card)
        }
        return cards

        function allowedPosition(card) {
            if ((card.x == 0 && card.y == 0) || (card.x == 11 && card.y == 11)) {
                return false
            } else {
                return true
            }
        }
    }

    function removeCard(command) {
        state.cards.splice(command.index, 1)
        notifyAll({
            type: 'remove-card',
            playerName: command.index
        })
    }

    function addPlayer(command) {
        console.log(command)
        state.players[command.playerName] = {
            x: command.playerX,
            y: command.playerY
        }
        notifyAll({
            type: 'add-player',
            playerName: command.playerName
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

    function inputPlayer(command) {
        console.log(command)
        notifyAll(command)
        const acceptedInputs = {
            rollDice(player) {
                let diceValue = getRandomInt(1,6)
                console.log(player, diceValue)
                if (isVictorious(player, diceValue)) {
                    alert(`player ${player.name} won.`)
                } else {
                    if (player.x + diceValue > 11) {
                        player.x = (diceValue + player.x) % 11
                        player.y += 1
                    } else {
                        player.x += diceValue
                    }
                }
                checkCard(player)
                return null
            },
            attack(command) {

            }
        }

        let player = state.players[command.playerName]
        let input = command.input
        let inputFuction = acceptedInputs[input]
        if (inputFuction && player) {
            inputFuction(player)
        }
    }

    function isVictorious(player, diceValue) {
        if (player.x + diceValue >= 11) {
            if (player.y + 1 > 11) {
                return true
            }
        }
        return false
    }

    function checkCard(player) {
        let selectedCard, cardIndex;
        state.cards.forEach((card, index) => {
            if (card.x == player.x && card.y == player.y) {
                selectedCard = card
                cardIndex = index
            }
        })
        if (selectedCard) {
            if (player.x - selectedCard.value < 0) {
                player.y = Math.max(0, player.y - 1)
                if (player.y == 0) {
                    player.x = 0
                } else {
                    player.x = 11 - (selectedCard.value - player.x)
                }
            } else {
                player.x = Math.min(player.x - selectedCard.value, 0)
            }
            removeCard({
                index: cardIndex
            })
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    return {
        state,
        inputPlayer,
        setState,
        generateCards,
        addPlayer,
        removePlayer,
        subscribe,
        notifyAll
    }
}  