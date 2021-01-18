import { Message } from "./Message";

/**
 * Classe responsável por registrar uma mensagem em caso de logout do usuário
 */
export class UserLogoutMessage implements Message {
    username: string;

    constructor(username: string) {
        this.username = username;
    }

    send(): string {
        return `${this.username} has disconnected`;
    }

}