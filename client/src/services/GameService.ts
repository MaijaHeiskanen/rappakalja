import { api } from "./api"

export const GameService = {
    setName(socketId: string, name: string) {
        return api(
            "/setname"
        )
    },
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
    }
}