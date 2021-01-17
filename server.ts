import net, { Socket } from 'net';
import { ChatSocket } from './domain/ChatSocket';
import { ChatState } from './domain/ChatState';
import { Message } from './domain/Message';
import { NewUserMessage } from './domain/NewUserMessage';
import { PublicMessage } from './domain/PublicMessage';
import { UserLogoutMessage } from './domain/UserLogoutMessage';
import { AvaliableCommand, handlePossibleCommand } from './helper/CommandMessageHandler';

var userSessionList = new Array<ChatSocket>();

const server = net.createServer().on('error', (err) => {
    console.error(err);
});

server.on('connection', (socket: Socket) => {

    socket.setDefaultEncoding("utf-8");

    userSessionList.push(new ChatSocket(socket));

    socket.write("Welcome to our Chat! Please choose a username!");

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

        broadcastMessage(new PublicMessage(receivedText, referencedSocket.username), referencedSocket);
    }
}


function isUsernameAvaliable(receivedText: any) {
    return !userSessionList.some(userSession => userSession.username === receivedText.toString("utf-8"));

}


function loginNewUser(receivedText: any, chatSocket: ChatSocket): void {
    console.log(receivedText);
    if (isUsernameAvaliable(receivedText)) {
        chatSocket.username = receivedText;
        chatSocket.state = ChatState.LOGGED;
        broadcastMessage(new NewUserMessage(chatSocket.username!), chatSocket);
        return;
    }
    chatSocket.socket.write("User already taken! Please chooser another username!");
}

function broadcastMessage(message: Message, chatSocket: ChatSocket): void {

    userSessionList.forEach(userSession => {
        if (chatSocket.socket.ref() !== userSession.socket.ref() && userSession.state === ChatState.LOGGED) {
            userSession.socket.write(message.send());
        }

    })

}