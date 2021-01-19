import { Socket } from "net";
import { ChatSocket } from "../domain/ChatSocket";
import { PrivateMessage } from "../domain/PrivateMessage";
import { PublicMessage } from "../domain/PublicMessage";
import { SystemMessage } from "../domain/SystemMessage";
import { UserLogoutMessage } from "../domain/UserLogoutMessage";
import { AvaliableCommand, getUsernameFromText } from "../helpers/CommandMessageHandler";
import { userSessionList } from "../Server";

/**
 * Método responsável por direcionar a mensagem em caso de ser um comando para o chat.
 * @param command Comando executado
 * @param socket socket emissor da mensagem
 * @param receivedText mensagem recebida
 * @param referencedSocket Classe socket de domínio responsável pela emissão da mensagem
 */
export function handleCommandMessage(command: AvaliableCommand, socket: Socket, receivedText: string, referencedSocket: ChatSocket, broadcasFunction: Function) {
    if (command === AvaliableCommand.EXIT) {
        socket.emit("close")
        socket.destroy();
        broadcasFunction(new UserLogoutMessage(referencedSocket.username!), referencedSocket);
        return;
    }

    if (command === AvaliableCommand.PRIVATE_MESSAGE) {
        const receiverSocket = getValidReceiver(receivedText);

        if (receiverSocket) {
            receiverSocket.socket.write(new PrivateMessage(referencedSocket.username!, receivedText).send());
            return;
        }
        referencedSocket.socket.write(SystemMessage.USER_NOT_FOUND);
        return;
    }
    broadcasFunction(new PublicMessage(receivedText, referencedSocket.username), referencedSocket);
}

function getValidReceiver(text: string): ChatSocket {

    const username = getUsernameFromText(text);

    const receiverSocket = getSocketFromUsername(username);

    return receiverSocket;

}

/**
 * Return the socket referenced by the username.
 * It has to always return only one chatSocket.
 * @param username username receiver
 */
function getSocketFromUsername(username: string): ChatSocket {
    return userSessionList.filter(userSession => userSession.username === username)[0];
}
