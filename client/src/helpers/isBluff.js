export const isBluff = (socket, game) => {
    return game.bluff && socket.id === game.bluff.socketId;
}