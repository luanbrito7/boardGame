import gameFactory from './public/gameFactory.js'

const {
    state,
    setState,
    addPlayer,
    movePlayer,
    removePlayer,
    removeCard,
    subscribe,
    notifyAll
} = gameFactory()

export default function serverGame() {

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

    function inputPlayerServer(command) {
        const acceptedInputs = {
            rollDice(player) {
                if (!isPlayerTurn({...player})) return null
                let diceValue = getRandomInt(1,6)
                if (isVictorious(player, diceValue)) {
                    alert(`player ${player.playerName} won.`)
                } else {
                    movePlayer({
                        playerName: player.playerName,
                        value: diceValue
                    })
                }
                checkCard(player)
                return null
            },
            attack(command) {

            }
        }
        console.log(command.playerName, command.input)
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
            // if (player.x - selectedCard.value < 0) {
            //     player.y = Math.max(0, player.y - 1)
            //     if (player.y == 0) {
            //         player.x = 0
            //     } else {
            //         player.x = 11 - (selectedCard.value - player.x)
            //     }
            // } else {
            //     player.x = Math.min(player.x - selectedCard.value, 0)
            // }
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

    function isPlayerTurn(command) {
        return (state.playerOrder[state.turnPlayerIndex] == command.playerName)
    }

    return {
        state,
        inputPlayerServer,
        setState,
        generateCards,
        addPlayer,
        removePlayer,
        movePlayer,
        subscribe,
        notifyAll,
        generateCards,
        setState,
        inputPlayerServer
    }
}