import { api } from "./api"

export const GameService = {
    createRoom(socketId: string) {
        return api(
            "/create",
            {socketId},
            "POST"
        )
    },
    joinRoom(socketId: string, room: string) {
        return api(
            "/join",
            {socketId, room},
            "POST"
        )
    },
    leaveRoom(socketId: string, room: string) {
        return api(
            "/leave",
            {socketId, room},
            "POST"
        )
    },
    setName(socketId: string, name: string) {
        return api(
            "/setname",
            {socketId, name},
            "POST"
        )
    },
    startRound(socketId: string) {
        return api(
            "/startround",
            {socketId},
            "POST"
        )
    }
}
