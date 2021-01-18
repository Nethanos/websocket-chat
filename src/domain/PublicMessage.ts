import { runInThisContext } from "vm";
import { Message } from "./Message";

/**
 * Classe responsável por enviar uma mensagem pública
 */
export class PublicMessage implements Message {

    content: string;
    user?: string;

    constructor(content: string, user?: string) {
        this.content = content;
        if (user) {
            this.user = user;
        }
    }

    send(): string {
        return `${this.user} says: ${this.content}`;
    }

}