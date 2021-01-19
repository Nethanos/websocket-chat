import { ChatSocket } from "../domain/ChatSocket";
import { ClientConnectionState } from "../domain/ClientConnectionState";
import { NewUserMessage } from "../domain/NewUserMessage";
import { SystemMessage } from "../domain/SystemMessage";
import { userSessionList } from "../Server";

export function logInNewUser(receivedText: any, chatSocket: ChatSocket, broadcasFunction: Function): void {
    if (isUsernameAvaliable(receivedText)) {
        chatSocket.username = receivedText;
        chatSocket.state = ClientConnectionState.LOGGED;
        broadcasFunction(new NewUserMessage(chatSocket.username!), chatSocket);
        return;
    }
    chatSocket.socket.write(SystemMessage.USERNAME_INVALID);
}

/**
 * Método responsável por validar o username registrado, é válido se não for vazio e se não estiver em uso.
 * @param receivedText 
 */
function isUsernameAvaliable(receivedText: string) {
    return !userSessionList.some(userSession => userSession.username === receivedText) && !!receivedText;

}
