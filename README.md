# Chat Messager
___

## Resumo

Aplicação de envio de mensagens com WebSockets `socket.io` e `WebRTC`, ele possue algumas ferramentas auxiliares em que fazem uso de `WebAssembly`, como o `ffmpeg.wasm`(*compressor de videos*) e também `Sharp`(*Compressor de Imagens*), utiliza o `express.js`, porém futuramente pretendo mudar para o `polka`, `fastify` ou `foxify`(Mas não dispensarei a possibilidade de usar uma alternativa em `Wasm🚀`)

___

## Objetivos

- [x] Sidebar com update em tempo real de usuários ativos;
- [x] Chat privado com envio de mensagens via `SocketId`;
- [x] Chat público;
- [ ] Barra de pesquisa;
- [ ] Notificações;
- [ ] Resumo de mensagens de todos os usuários;
- [ ] Configurações para cada usuário;
- [ ] Transferência de arquivos(🚧Em progresso🚧);
- [ ] Right-Click do mouse personalizado;
- [ ] Foto de usuário(🚧Em progresso🚧)
- [ ] Status de usuário(🚧Em progresso🚧)
- [ ] Criação de salas;
- [x] Implementação de WebRTC;
    - [x] Chamada de Video;
    - [ ] Chamada de Audio;
- [ ] Implementação do Redis;

___

## Sockets

### Server Side
- #### New User
Ele vem do client no momento em que é dado o username no `SweerAlert2`, dentro dele temos três emições em que trasmitem para todos os usuários junto com quem mandou a emição, desta forma atualizando a lista de usuário de acordo com o server.
```javascript
socket.on("new user", (username, address))
```
Ele carrega consigo dois paramentros `username` e `address`
> **username**: formValues[0] - valor trazido do `Swal.fire()`
**address**: `socket.id` - valor gerado no momento da conexão com o site

Estes valores serão armazenados em metadatas, e emitidos para outros sockets, futuramente irei implementar no `Redis`.

- #### Login
Ele pega os valores vindo do `new user`, e em seguida envia para todos os client sem excessão para que não tenha nenhum client desatualizado conforme novos users chegam e registram seus `username`.
```javascript
io.emit("login", user, id)
```
> **user**: É um vetor com todos os username logados
**id**: É um vetor com todos os `socket.id` dos clients conectados

- #### Users
Ele pega os valores vindo do `new user`, e em seguida envia para todos os client valores para interações especialmente na sidebar
```javascript
io.emit("users", id, user)
```
> **user**: É um vetor com todos os username logados
**id**: É um vetor com todos os `socket.id` dos clients conectados

- #### Send Element
Ele pega os valores vindo do client `users`, em que envia os `addressers`, o `recipient` e o `index` requerido, ele tem uma função mais pra intermediador no server side, servindo como uma ponte para a `send message private`
```javascript
socket.on("send element", (addressers, recipient, index))
```
> **addressers**: É um vetor com todos os `socket.id` dos clients conectados
**recipient**: É o `username` do destinatário
**index**: É o índice do objeto interagido na sidebar

- #### Chat Message Group
Envia mensagem para todos os clients conectados
```javascript
socket.on("chat message group", (msg, user, className))
```
> **msg**: Valor dentro do `input#input.write-message`
**user**: Valor dentro do `formsValue[0]`
**className**: Valor para atribuir no style da box message

- #### Send Message Private
Envia mensagem de um client para outro atraves do `socket.id`
```javascript
socket.on("send message private", (message, address))
```
> **message**: Valor dentro do `input#input.write-message`
**address**: Valor do `socket.id` do client conectado

- #### Disconnect
Emite a todos os usuários o client que saiu
```javascript
socket.on("disconnect", ())
```

### Client Side
- #### New User
Pega os valores que é dado no username em `SweerAlert2`, em que faz a emição para o server, sinalizando o `username` e o `socket.id` da nova conexão.
```javascript
socket.emit("new user", formValues[0], socket.id)
```

- #### Login
Estrutura os dados na sidebar, responsável por sinalizar graficamente os candidatos para envio de mensagens
```javascript
socket.on("login", (user, id))
```
> **user**: É um vetor com todos os username logados
**id**: É um vetor com todos os `socket.id` dos clients conectados

Todos os dados são tratos usando `jQuery`

- #### Send Element
Intermediador do do delivery das mensagem privadas, onde guardará os valores recebidos em `json` em uma variável chamada `req` desta forma enviando para o server atraves da emição `socket.emit("send message private", req, addressers[index])`:
```js
{
    "addresser": String,
    "recipient": String,
    "type": String,
    "body": String,
    "time": Date
}
```
```javascript
socket.on("send element", (addressers, recipient, index)
```
> **addressers**: É um vetor com todos os `socket.id` logados
**recipient**: É o username do destinatário
**index**: Índice na lista de users

- #### Load Messages
🚧 em progesso 🚧

- #### Chat Message Group
Recebe o broadcast do server e grava a mensagem no `.chat-wrapper` usando `jQuery`
```javascript
socket.on("chat message group", (msg, user, className))
```
> **msg**: Valor dentro do `input#input.write-message`
**user**: Valor dentro do `formsValue[0]`
**className**: Valor para atribuir no style da box message

- #### Receive Private Message
Recebe do server a mensagem envia para o client, sinalizando o recebimento de uma mensagem através do seu `socket.id`
```javascript
socket.on("receive private message", (data))
```
> **data**: O valor registrado anteriormente na `req` aqui ele é lido no client destinatário e tratado

- #### Users
O coração das `callbacks`, ele faz o uso de toda a lógica presente na visualização e interação do usuário, tomando de conta inteiramente das ações.
```javascript
socket.on("users", (users, username))
```

> **users**: É um vetor com todos os `socket.id` logados
**username**: É um vetor com todos os username logados

- #### User Left
Pega a lista atualizado de usuários ativos no server, e faz remoção de um elemento no html quando um client faz o logout
```javascript
socket.on("user left", (data))
```
> **data**: É o username

___

## Comandos
```
npm start
```
porta:
```
localhost:3000
```

___



🚧Em breve a documentação🚧
