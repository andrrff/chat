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
- [ ] Implementação de WebRTC(🚧Em progresso🚧);
    - [ ] Chamada de Video;
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
