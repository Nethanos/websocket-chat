import net, { Socket } from 'net';
import { ChatSocket } from './domain/ChatSocket';
import { ChatState } from './domain/ChatState';
import { Message } from './domain/Message';
import { NewUserMessage } from './domain/NewUserMessage';
import { PrivateMessage } from './domain/PrivateMessage';
import { PublicMessage } from './domain/PublicMessage';
import { UserLogoutMessage } from './domain/UserLogoutMessage';
import { AvaliableCommand, getUsernameFromText, handlePossibleCommand } from './helper/CommandMessageHandler';

var userSessionList = new Array<ChatSocket>();

const server = net.createServer().on('error', (err) => {
    console.error(err);
});

server.on('connection', (socket: Socket) => {

    socket.setDefaultEncoding("utf-8");

    userSessionList.push(new ChatSocket(socket));

    socket.write("Welcome to our Chat! Please choose a username!");

    socket.setMaxListeners(1);

    socket.on('data', (receivedText: any) => {
        handleDataFromSocket(receivedText.toString("utf-8").trim(), socket);
    })

})

server.listen(9898, () => {
    console.log('Server opened');
});


function handleDataFromSocket(receivedText: any, socket: Socket) {
    const referencedSocket = userSessionList
        .filter(userSession => userSession.socket.ref() === socket.ref())[0];

    if (referencedSocket.state === ChatState.TO_BE_LOGGED) {
        loginNewUser(receivedText, referencedSocket);
        return;
    }
    if (referencedSocket.state === ChatState.LOGGED) {
        const command = handlePossibleCommand(receivedText, referencedSocket);
        if (command === AvaliableCommand.EXIT) {
            socket.emit("close")
            socket.destroy();
            broadcastMessage(new UserLogoutMessage(referencedSocket.username!), referencedSocket);
            return;
        }
        if (command === AvaliableCommand.PRIVATE_MESSAGE) {
            const receiverSocket = getValidReceiver(receivedText);

            if (!!receiverSocket.username) {
                receiverSocket.socket.write(new PrivateMessage(referencedSocket.username!, receivedText).send());
                return;
            }
        }
        broadcastMessage(new PublicMessage(receivedText, referencedSocket.username), referencedSocket);
    }
}

function loginNewUser(receivedText: any, chatSocket: ChatSocket): void {
    if (isUsernameAvaliable(receivedText)) {
        chatSocket.username = receivedText;
        chatSocket.state = ChatState.LOGGED;
        broadcastMessage(new NewUserMessage(chatSocket.username!), chatSocket);
        return;
    }
    chatSocket.socket.write("Username invalid or already taken! Please chooser another username!");
}

function isUsernameAvaliable(receivedText: any) {
    return !userSessionList.some(userSession => userSession.username === receivedText.toString("utf-8")) && !!receivedText;

}

function getValidReceiver(text: string): ChatSocket {

    const username = getUsernameFromText(text);

    const receiverSocket = getSocketFromUsername(username);

    return receiverSocket;

}


function getSocketFromUsername(username: string): ChatSocket {
    return userSessionList.filter(userSession => userSession.username === username)[0];
}


function broadcastMessage(message: Message, chatSocket: ChatSocket): void {

    userSessionList.forEach(userSession => {
        if (chatSocket.socket.ref() !== userSession.socket.ref() && userSession.state === ChatState.LOGGED) {
            userSession.socket.write(message.send());
        }

    })

}