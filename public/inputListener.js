export default function inputListenerFactory() {
    let observers = []
    let playerName;

    function setPlayer(playerName) {
        playerName = playerName
    }

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        observers.forEach((observerFunction) => {
            observerFunction(command)
        })
    }

    document.addEventListener("keydown", (event) => {
        let keyPressed = event.key
        let command = {
            playerName: playerName,
            input: keyPressed
        }
        notifyAll(command)
    })

    function rollDice() {
        let command = {
            playerName: playerName,
            input: 'rollDice'
        }
        notifyAll(command)
    }

    function selectCard() {
        let command = {
            playerId: 'p1',
            input: 'selectCard'
        }
    }

    return {
        subscribe,
        rollDice,
        setPlayer
    }
}