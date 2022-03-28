export const getPlayer = (socketId, players = []) => {
    const player = players.find(player => player.socketId === socketId);

    console.log({socketId, players, player});
    return player;
}