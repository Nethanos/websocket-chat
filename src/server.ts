import * as net from 'net';
import { Socket } from 'net';
import { ChatSocket } from './domain/ChatSocket';
import { ClientConnectionState } from './domain/ClientConnectionState';
import { Message } from './domain/Message';
import { NewUserMessage } from './domain/NewUserMessage';
import { PrivateMessage } from './domain/PrivateMessage';
import { PublicMessage } from './domain/PublicMessage';
import { SystemMessage } from './domain/SystemMessage';
import { UserLogoutMessage } from './domain/UserLogoutMessage';
import { AvaliableCommand, getUsernameFromText, handlePossibleCommand } from './helpers/CommandMessageHandler';

var userSessionList = new Array<ChatSocket>();

const PORT = 9898;

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
        loginNewUser(receivedText, referencedSocket);
        return;
    }
    if (referencedSocket.state === ClientConnectionState.LOGGED) {
        const command = handlePossibleCommand(receivedText);

        handleCommandMessage(command, socket, receivedText, referencedSocket);

    }
}


/**
 * Método responsável por direcionar a mensagem em caso de ser um comando para o chat.
 * @param command Comando executado
 * @param socket socket emissor da mensagem
 * @param receivedText mensagem recebida
 * @param referencedSocket Classe socket de domínio responsável pela emissão da mensagem
 */
function handleCommandMessage(command: AvaliableCommand, socket: Socket, receivedText: string, referencedSocket: ChatSocket) {
    if (command === AvaliableCommand.EXIT) {
        socket.emit("close")
        socket.destroy();
        broadcastMessage(new UserLogoutMessage(referencedSocket.username!), referencedSocket);
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
    broadcastMessage(new PublicMessage(receivedText, referencedSocket.username), referencedSocket);
}

/**
 * Método responsável por realizar o login de o registro de um novo usuário
 * @param receivedText Texto recebido - idealmente o username
 * @param chatSocket Classe de domínio que representa o Socket emissor
 */
function loginNewUser(receivedText: any, chatSocket: ChatSocket): void {
    if (isUsernameAvaliable(receivedText)) {
        chatSocket.username = receivedText;
        chatSocket.state = ClientConnectionState.LOGGED;
        broadcastMessage(new NewUserMessage(chatSocket.username!), chatSocket);
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

/**
 * Método responsável por recuperar o socket receptor de uma mensagem privada
 * @param text Mensagem com nome do possível receptor.
 */
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