export default function renderElements(context, game, requestAnimationFrame) {
    context.fillStyle = "#ffffff";
    context.clearRect(0,0,11,11)
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 12; j++) {
            context.fillStyle = context.fillStyle == "#000000" ? "#ffffff" : "#000000"
            context.fillRect(i, j, 1, 1);
        }
        context.fillStyle = context.fillStyle == "#000000" ? "#ffffff" : "#000000"
        context.fillRect(i, j, 1, 1);
    }
    for (let playerKey in game.state.players) {
            let player = game.state.players[playerKey]
            context.fillStyle = 'green'
            context.fillRect(player.x, player.y, 1, 1)
    }
    game.state.cards.forEach(card => {
        context.fillStyle = 'pink'
        context.fillRect(card.x, card.y, 1, 1)
    })
    requestAnimationFrame(() => {
        renderElements(context, game, requestAnimationFrame)
    })
}