export const isLobby = (game) => {
    return game.gameState === 0;
}

export const isBluffWritingWord = (game) => {
    return game.gameState === 1;
}

export const isWritingDefinition = (game) => {
    return game.gameState === 2;
}

export const isValidatingDefinitions = (game) => {
    return game.gameState === 3;
}
