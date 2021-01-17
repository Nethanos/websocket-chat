import { Message } from "./Message";

export class UserLogoutMessage implements Message {
    username: string;

    constructor(username: string) {
        this.username = username;
    }

    send(): string {
        return `${this.username} has disconnected`;
    }

}