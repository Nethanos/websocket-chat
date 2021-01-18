import { Message } from "./Message";

export class PrivateMessage implements Message {

    fromUser: string;
    content: string;

    constructor(fromUser: string, content: string) {
        this.fromUser = fromUser;
        let partialContentArray = content.split(' ');
        let formattedPartialContent = partialContentArray
            .slice(2, partialContentArray.length);
        this.content = formattedPartialContent.join(' ');
    }

    send(): string {
        return `${this.fromUser} says privately to you: ${this.content}`
    }

}