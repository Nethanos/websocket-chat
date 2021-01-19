# websocket-chat
Um chat simples usando websocket e NODE JS.

# Tech:
- NodeJS
- Typescript(dev only)
- ts-node-dev(dev only)

----
# Implementação:

Ao não utilizar bibliotecas terceiras, como o socket.io, utilizei para implementar o chat a api https://nodejs.org/api/net.html 
do próprio NodeJS. A estrutura de pastas segue o paradigma de package-by-feature, ainda que embrionário por existir apenas uma feature.
Por escassez de documentação e literatura sobre exemplos de implementação sem utilizar o Socket.IO, a documentação citada acima foi a
maior fonte de conhecimento para realizar o desafio.

O entrypoint do projeto é o arquivo Server.ts que é responsável pela inicialização do servidor e bind de eventos pertinentes. 
Separei as responsabilidades de negócio em services, onde cada uma tem seu próprio papel, de acordo com o tipo de mensagem recebida.
As classes utilizadas que tem construtor obedecem o conceito de "Classe coerente", que nada mais é o princípio de OO em que classes
não devem ser burras, ou seja, ter apenas getters e setters.

# Como rodar(servidor):

*Todos os comandos devem ser rodados sem as aspas.

- Baixe o projeto e na pasta raíz use o comando "npm install". Este comando instalará as dependências do projeto.
- O projeto está configurado para rodar na porta 9898, mas se desejar rodar em qualquer outra, basta criar um arquivo .env na raíz do projeto e 
criar a variável PORT, com o valor da porta desejado, em caso de dúvidas, seguir o arquivo .ENV_EXAMPLE
- Após isso, para rodar o servidor, use o comando "npm build-and-start". Este comando transpilará o código feito em Typescript para Javascript
e rodará o código buildado. O output no seu console deverá ser "Server opened at ${PORT}".

#Como rodar(client):
- Na pasta raíz do projeto, há um arquivo chamado client.js, para utilizá-lo, basta rodar o comando "node client.js" em qualquer terminal desejado
que suporte o NodeJS.
- Selecione o seu nome de usuário quando requisitado no terminal e basta começar a usar.
- Você poderá enviar uma mensagem para qualquer um conectado ao servidor(qualquer outro client que você tenha rodado).
- Poderá enviar uma mensagem privado, usando a sintaxe /p {username} mensagem, sendo username o nome do usuário desejado, em camel-case. Ex: /p Neto E aí! Tudo bem?
- Para deslogar do chat, basta usar o comando /exit

  
