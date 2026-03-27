/**
 * ==========================================================
 * AUTO-BOT WHATSAPP - NODE.JS BACKEND ENGINE
 * Oficial Baileys Implementation (WebHooks & Sockets)
 * Desenvolvido para Portfólio de Alta Performance (Demonstração de Backend SaaS)
 * ==========================================================
 * 
 * Instalação Requerida (Se for rodar em Servidor AWS/Heroku no Futuro):
 * npm install @whiskeysockets/baileys qrcode-terminal
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');

// ==== MOTOR DE RESPOSTAS (CHATBOT REGEX / MENU ROUTING) ====
const MENUS_TEXTO = {
    M_BOASVINDAS: `🤖 *Olá! Eu sou o AutoBot de Atendimento.*
Como posso te ajudar hoje? Digite o NÚMERO da opção desejada:

*1.* 🛠️ Suporte Técnico
*2.* 💳 Financeiro / 2ª Via de Boleto
*3.* 📦 Rastrear Meu Pedido
*4.* 👤 Falar com Humano`,
    
    M_SUPORTE: `*Suporte Técnico (AutoBot)* 🛠️
Qual é o seu sistema operacional?
- *Win* (Windows 10/11)
- *Mac* (macOS)
- *Linux*
(Digite para recebermos no chamado)`
};

// ==========================================
// ====== CONEXÃO WEB-SOCKET BAILEYS ========
// ==========================================

async function connectToWhatsApp() {
    // 1. Gerenciamento de Sessão (Para não ler QR Code 2x se a internet cair)
    const { state, saveCreds } = await useMultiFileAuthState('./banco_qrcode_auth');

    // 2. Instância Principal do WhatsApp Core
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false, // Desligamos o nativo para injetarmos o log colorido nosso abaixo.
    });

    // 3. Ouvinte de Conexão Crítica (Onde o QR Code Nasce)
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if(qr) {
            console.log("\n[!] 📱 Escaneie o QR Code abaixo no seu WhatsApp para Ligar o Robô:\n");
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'close') {
            // Se cair ou Desligar
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(' Conexão Fechada due to:', lastDisconnect.error, ', Reconnecting?', shouldReconnect);
            
            // Loop Infinito de Quedas (Resiliência Sysadmin)
            if (shouldReconnect) { connectToWhatsApp(); }
        } else if (connection === 'open') {
            console.log('\n==== [✅] AutoBot Conectado ao WhatsApp Web com Sucesso! ====\n');
        }
    });

    // 4. Autosalvamento Físico de Banco de Dados Local do Auth
    sock.ev.on('creds.update', saveCreds);

    // ===========================================
    // ====== O MAILING SYSTEM (WebHook) =========
    // ===========================================
    sock.ev.on('messages.upsert', async (m) => {
        // Ignora status aleatórios do Whatsapp e Atualizações Vazias
        const messagePayload = m.messages[0];
        if (!messagePayload.message || messagePayload.key.fromMe) return;

        // Limpeza Segura do Telefone do Cliente @s.whatsapp.net
        const senderNumber = messagePayload.key.remoteJid;
        
        // Extração Inteligente do Texto (Ignorando Audios/Fotos Pela Simplicidade do Case)
        let incomingText = messagePayload.message.conversation || messagePayload.message.extendedTextMessage?.text || "";
        incomingText = incomingText.toLowerCase().trim();

        // 🧠 LOGICA CEREBRAL DO ROBÔ (A Árvore de Decisão) 🧠
        
        console.log(`[+] Mensagem Nova de [${senderNumber.split('@')[0]}]: ${incomingText}`);

        // Roteamento Padrão Inicial
        if (['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'menu'].includes(incomingText)) {
            // Simulando "Digitando..." Humano...
            await sock.presenceSubscribe(senderNumber);
            await sock.sendPresenceUpdate('composing', senderNumber);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Delay de 1.5s
            await sock.sendPresenceUpdate('paused', senderNumber);

            await sock.sendMessage(senderNumber, { text: MENUS_TEXTO.M_BOASVINDAS });
        }
        
        // Tratamento da Árvore de Switch (Respostas aos Números)
        else {
            switch (incomingText) {
                case '1':
                    await sock.sendMessage(senderNumber, { text: MENUS_TEXTO.M_SUPORTE });
                    break;
                case '2':
                    await sock.sendMessage(senderNumber, { text: "Link para o Financeiro: https://meusboletos.corp/123" });
                    break;
                case '3':
                    await sock.sendMessage(senderNumber, { text: "Sua encomenda [BR-8812A] está na transportadora. Previsão: 3 dias úteis." });
                    break;
                case '4':
                     await sock.sendMessage(senderNumber, { text: "Transferindo você para um dos nossos Humanos especialistas. Aguarde na linha... ⏳" });
                     console.log(`[ATENDE] -> Cliente ${senderNumber} transferido p/ Mesa Humana!`);
                     break;
                default: 
                     // O Robo ignora baboseiras, ou poderia responder: "Não entendi."
                     break; 
            }
        }
    });
}

// Inicializa a Nuvem
// connectToWhatsApp();
