import { ChatSocket } from "../domain/ChatSocket";

function isMessageACommand(text: string) {
    return text.startsWith("/", 0);
}

export function handlePossibleCommand(text: string, socket: ChatSocket): AvaliableCommand {
    if (isMessageACommand(text)) {
    } if (text === "/exit") {
        return AvaliableCommand.EXIT;

    } if (text.includes("/p ") && hasUsernameInText(text)) {
        return AvaliableCommand.PRIVATE_MESSAGE;
    }
    return AvaliableCommand.NOT_A_COMMAND;
}

export enum AvaliableCommand {
    PRIVATE_MESSAGE, EXIT, NOT_FOUND, NOT_A_COMMAND
}


function hasUsernameInText(text: string): boolean {
    return !!getUsernameFromText(text);
}

export function getUsernameFromText(text: string): string {
    const textArray = text.split(' ');

    return textArray[1];
}