import { Message } from "./Message";

export class NewUserMessage implements Message {

    username: string;

    constructor(username: string) {
        this.username = username;
    }

    send(): string {
        return `${this.username} joined the chat!`
    }

}