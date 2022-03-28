import { api } from "./api"

export const GameService = {
    async createRoom(socketId: string) {
        return await api(
            "/create",
            {socketId},
            "POST"
        )
    },
    async joinRoom(socketId: string, room: string) {
        return await api(
            "/join",
            {socketId, room},
            "POST"
        )
    },
    async leaveRoom(socketId: string, room: string) {
        return await api(
            "/leave",
            {socketId, room},
            "POST"
        )
    },
    async setName(socketId: string, name: string) {
        return await api(
            "/setName",
            {socketId, name},
            "POST"
        )
    },
    async startRound(socketId: string) {
        return await api(
            "/startRound",
            {socketId},
            "POST"
        )
    },
    async setWord(socketId: string, word: string) {
        return await api(
            "/setWord",
            {socketId, word},
            "POST"
        )
    },
    async setDefinition(socketId: string, definition: string) {
        return await api(
            "/setDefinition",
            {socketId, definition},
            "POST"
        )
    }
}
