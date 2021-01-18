import { Socket } from "net";
import { nanoid } from 'nanoid';
import { ChatState } from "./ChatState";

export class ChatSocket {
    socket: Socket;
    id: string;
    username?: string;
    state: ChatState = ChatState.TO_BE_LOGGED;

    constructor(socket: Socket) {
        this.id = nanoid();
        this.socket = socket;
    }
}