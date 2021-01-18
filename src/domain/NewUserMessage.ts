import { Message } from "./Message";
/**
 * Classe responsável por enviar uma mensagem para um novo client.
 */
export class NewUserMessage implements Message {

    username: string;

    constructor(username: string) {
        this.username = username;
    }

    send(): string {
        return `${this.username} joined the chat!`
    }

}