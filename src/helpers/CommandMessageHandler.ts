/**
 * Função responsável por indicar se a mensagem é um comando
 * @param text mensagem enviada
 */
function isMessageACommand(text: string): boolean {
    return text.startsWith("/", 0);
}

/**
 * Função responsável por gerenciar uma mensagem com possibilidade de ser um comando
 * @param text 
 */
export function handlePossibleCommand(text: string): AvaliableCommand {
    if (isMessageACommand(text)) {
    } if (text === "/exit") {
        return AvaliableCommand.EXIT;

    } if (text.includes("/p ") && hasUsernameInText(text)) {
        return AvaliableCommand.PRIVATE_MESSAGE;
    }
    return AvaliableCommand.NOT_A_COMMAND;
}

/**
 * Enumerator responsável por registrar os tipos de comandos disponíveis.
 */
export enum AvaliableCommand {
    PRIVATE_MESSAGE, EXIT, NOT_FOUND, NOT_A_COMMAND
}

/**
 * Funcão privada responsável por verificar se o texto contém o formato de um possível usuário
 * @param text 
 */
function hasUsernameInText(text: string): boolean {
    return !!getUsernameFromText(text);
}

/**
 * Função responsável por retornar o trecho da mensagem que contém um possível usuário
 * @param text 
 */
export function getUsernameFromText(text: string): string {
    const textArray = text.split(' ');

    return textArray[1];
}

