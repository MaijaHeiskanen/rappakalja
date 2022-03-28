export const isSelectingName = (player = {}) => {
    return player.state === 0;
}

export const isNotReady = (player = {}) => {
    return player.state === 1;
}

export const isReady = (player = {}) => {
    return player.state === 2;
}