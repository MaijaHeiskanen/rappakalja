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
            "/setname",
            {socketId, name},
            "POST"
        )
    },
    async startRound(socketId: string) {
        return await api(
            "/startround",
            {socketId},
            "POST"
        )
    }
}
