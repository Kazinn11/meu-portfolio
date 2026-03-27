const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

// A base do Chat Real-Time 
const server = http.createServer(app);

// Abrindo a "Mangueira" dos Sockets
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// "Banco de dados" em memória para Múltiplos Usuários
const activedSessions = {};

// Evento Global de Conexão: Visitante acessou a Página
io.on('connection', (socket) => {
    
    // Cria protocolo pro usuário recem-chegado (Sessão Anonima Temporaria)
    activedSessions[socket.id] = { id: socket.id, username: `Visitante_${socket.id.substring(0,4)}`, logged: Date.now() };
    
    console.log(`[+] Conexão Estabelecida: ${activedSessions[socket.id].username}`);

    // --- Boas vindas apenas para esse Soquete Específico ---
    socket.emit('support_system_message', {
        author: 'Sistema',
        message: `Bem-vindo à Central de Atendimento! Um instante, um Especialista falará com você.`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true
    });

    // --- Quando o Cliente envia uma frase ao Servidor ---
    socket.on('client_send_msg', (payload) => {
        const u = activedSessions[socket.id];
        
        console.log(`[CHAT IN] De ${u.username}: ${payload.text}`);
        
        const preparedMessage = {
            authorId: u.id,
            authorName: u.username,
            message: payload.text,
            timestamp: new Date().toISOString()
        };

        // Opção 1: 'broadcast.emit' -> Envia a fala pra TODO MUNDO do site, MENOS para quem mandou.
        // Opção 2: 'io.emit' -> Envia a mensagem do rapaz a ABSOLUTAMENTE todo o Grupo, construindo um CHAT GLOBAL.
        io.emit('chat_global_room', preparedMessage); 
    });


    // --- Sistema Especializado 'Salas de Espera' ---
    socket.on('join_department', (deptName) => {
        socket.join(deptName); // Instancia Socket IO de Salas privadas (ex: "Suporte-Avançado")
        console.log(`${activedSessions[socket.id].username} moveu-se para Sala: [${deptName}]`);
        
        // Puxa o Agente que atende o Quarto e força o envio de aviso.
        socket.to(deptName).emit('support_system_message', {
           message: `Usuário ${activedSessions[socket.id].username} juntou-se a sessão.`,
           isSystemMessage: true 
        });
    });

    // --- Quando ele fechar a aba do navegador ---
    socket.on('disconnect', () => {
        console.log(`[-] Conexão Encerrada: ${activedSessions[socket.id].username}`);
        delete activedSessions[socket.id];
    });

});

// Start Real-Time Listener
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🤖 GLOBAL SUPPORT CHAT :: Motor WebSockets Escutando TCP na Porta ${PORT}`);
});
