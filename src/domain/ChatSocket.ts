import { Socket } from "net";
import { nanoid } from 'nanoid';
import { ClientConnectionState } from "./ClientConnectionState";

/**
 * Classe responsável por abstrair um socket padrao do node e adicionar atributos necessários.
 */
export class ChatSocket {
    socket: Socket;
    id: string;
    username?: string;
    state: ClientConnectionState = ClientConnectionState.TO_BE_LOGGED;

    constructor(socket: Socket) {
        this.id = nanoid();
        this.socket = socket;
    }
}