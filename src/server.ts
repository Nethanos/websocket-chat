import * as net from 'net';
import 'dotenv/config';
import { Socket } from 'net';
import { ChatSocket } from './domain/ChatSocket';
import { ClientConnectionState } from './domain/ClientConnectionState';
import { Message } from './domain/Message';
import { SystemMessage } from './domain/SystemMessage';
import { handlePossibleCommand } from './helpers/CommandMessageHandler';
import { handleCommandMessage } from './services/Command.service';
import { logInNewUser } from './services/NewUser.service';

export const userSessionList = new Array<ChatSocket>();

const PORT = process.env.PORT || 9898;

/**
 * Método responsável por criar o socket servidor.
 */
const server = net.createServer().on('error', (err) => {
    console.error(err);
});

/**
 * Método responsável por dar o bind do servidor criado com a porta especificada.
 */
server.listen(PORT, () => {
    console.log(`Server opened at ${PORT}`);
})

/**
 * Event listener responsável por realizar o callback quando um novo client se conecta
 * ao Server socket
 */
server.on('connection', (socket: Socket) => {

    socket.setDefaultEncoding("utf-8");

    userSessionList.push(new ChatSocket(socket));

    socket.write(SystemMessage.WELCOME);

    socket.setMaxListeners(1);

    socket.on('data', (receivedText: any) => {
        handleDataFromSocket(receivedText.toString("utf-8").trim(), socket);
    })

})

/**
 * Método responsável por iniciar o tratamento do dado recebido pelo cliente
 * @param receivedText Mensagem recebida em UTF-8, retirando tab.
 * @param socket Referência ao socket client que enviou a mensagem.
 */
function handleDataFromSocket(receivedText: any, socket: Socket) {
    const referencedSocket = userSessionList
        .filter(userSession => userSession.socket.ref() === socket.ref())[0];

    if (referencedSocket.state === ClientConnectionState.TO_BE_LOGGED) {
        logInNewUser(receivedText, referencedSocket, broadcastMessage)
        return;
    }
    if (referencedSocket.state === ClientConnectionState.LOGGED) {
        const command = handlePossibleCommand(receivedText);
        handleCommandMessage(command, socket, receivedText, referencedSocket, broadcastMessage);
    }
}

/**
 * Método responsável por enviar uma mensagem para todos os possíveis clients conectados, exceto o emissor.
 * @param message Texto a ser enviado
 * @param chatSocket socket do emissor
 */
function broadcastMessage(message: Message, chatSocket: ChatSocket): void {

    userSessionList.forEach(userSession => {
        if (chatSocket.socket.ref() !== userSession.socket.ref() && userSession.state === ClientConnectionState.LOGGED) {
            userSession.socket.write(message.send());
        }

    })

}