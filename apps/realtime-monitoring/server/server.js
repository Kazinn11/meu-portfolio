const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const os = require('os');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// Configuração WebSockets liberando CORS para que o FrontEnd local possa conectar.
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Cache auxiliar para cálculos de CPU precisos.
let lastCpuInfo = os.cpus();

function getCpuUsageBase() {
    let idle = 0;
    let total = 0;
    const currentCpuInfo = os.cpus();

    for(let i = 0, len = currentCpuInfo.length; i < len; i++) {
        let cpu = currentCpuInfo[i];
        for(let type in cpu.times) {
            total += cpu.times[type];
        }
        idle += cpu.times.idle;
    }

    let lastIdle = 0; let lastTotal = 0;
    for(let i = 0, len = lastCpuInfo.length; i < len; i++) {
        let cpu = lastCpuInfo[i];
        for(let type in cpu.times) { lastTotal += cpu.times[type]; }
        lastIdle += cpu.times.idle;
    }

    let idleDiff = idle - lastIdle;
    let totalDiff = total - lastTotal;
    lastCpuInfo = currentCpuInfo;

    return 100 - ~~(100 * idleDiff / totalDiff);
}

// Quando um Front-End (Dashboard) conectar no nosso túnel Socket...
io.on('connection', (socket) => {
    console.log(`🔌 [SOCKET.IO] Novo Client Admin conectado: ${socket.id}`);
    
    // Enviamos a ele um Payload de "Boas Vindas"
    socket.emit('sys_log', {
        level: 'INFO',
        message: 'Conexão Real-Time Estabelecida. Iniciando Monitoramento Cloud.',
        time: new Date().toLocaleTimeString()
    });

    socket.on('disconnect', () => {
        console.log(`❌ [SOCKET.IO] Admin desconectou: ${socket.id}`);
    });
});

// --- Loop Principal do SERVIDOR NOC --- 
// Emite a cada 1000 milissegundos os dados do SO inteiro.
setInterval(() => {
    
    const cpuLoad = getCpuUsageBase() || Math.floor(Math.random() * (45 - 20) + 20); // Fallback caso leitura falhe
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsagePrc = (usedMem / totalMem) * 100;

    // Transmite instantaneamente pela mangueira do WebSocket
    io.emit('metrics_stream', {
        cpu: cpuLoad,
        ram: memUsagePrc.toFixed(1),
        uptime: os.uptime(),
        timestamp: Date.now()
    });

    // Simulador de Log do Servidor
    if (cpuLoad > 85) {
        io.emit('sys_log', { level: 'CRITICAL', message: `Pico de CPU detectado! Carga em ${cpuLoad}%`, time: new Date().toLocaleTimeString() });
    } else if (Math.random() > 0.95) {
        // Evento Aleatório de Rede Ping
        io.emit('sys_log', { level: 'OK', message: 'Auth Service Handshake realizado em 24ms.', time: new Date().toLocaleTimeString() });
    }

}, 1000);

// Inicia Servidor Node Principal
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`🛰️ Servidor NOC Monitor escutando tráfego WebSocket na Porta ${PORT}`);
});
