export default function gameFactory() {
    let state = {
        players: {
            "p1": {x: 0, y: 0, name: "luan"},
            "p2": {x: 1, y: 0, name: "oto"}
        },
        cards: fillCards()
    }

    function fillCards() {
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
    }

    function addPlayer(command) {
        state.players[command.playerName] = {
            x: command.playerX,
            y: command.playerY
        }
    }

    function removePlayer(command) {
        delete state.players[command.playerName]
    }

    function inputPlayer(command) {
        console.log(command)
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
                openedCard(player)
                return null
                function isVictorious(player, diceValue) {
                    if (player.x + diceValue >= 11) {
                        if (player.y + 1 > 11) {
                            return true
                        }
                    }
                    return false
                }
            },
            attack(command) {

            },
            openedCard(player) {
                let selectedCard = cards.filter((card) => (card.x == player.x && card.y == player.y))
                if (selectedCard) {
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
                    }
                }
            }
        }

        let player = state.players[command.playerId]
        let input = command.input
        let inputFuction = acceptedInputs[input]
        if (inputFuction && player) {
            inputFuction(player)
        }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    return {
        state,
        inputPlayer
    }
}  