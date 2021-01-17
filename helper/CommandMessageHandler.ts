import { ChatSocket } from "../domain/ChatSocket";

function isMessageACommand(text: string) {
    return text.startsWith("/", 0);
}

export function handlePossibleCommand(text: string, socket: ChatSocket): AvaliableCommand {
    if (isMessageACommand(text)) {
    } if (text === "/exit") {
        return AvaliableCommand.EXIT;

    }
    return AvaliableCommand.NOT_A_COMMAND;
}

export enum AvaliableCommand {
    PRIVATE_MESSAGE, EXIT, NOT_FOUND, NOT_A_COMMAND
}