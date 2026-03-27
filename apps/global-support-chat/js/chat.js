/**
 * Global Support Chat - Mock Frontend Engine
 * Simula a latência natural humana usando setTimeout e DOM Injection
 */

document.addEventListener("DOMContentLoaded", () => {
    
    const uiForm = document.getElementById('chat-form');
    const uiInput = document.getElementById('msg-input');
    const uiBtn = document.getElementById('btn-send');
    const uiCanvas = document.getElementById('chat-canvas');
    const uiTyper = document.getElementById('typing-layer');
    const systemPop = document.getElementById('pop-sound');

    // Mini Base de Respostas Prontas do Robô 
    // Pra dar dinamismo na gravação ou teste do recrutador
    const agentAnswers = [
        "Certo, entendi perfeitamente. Dê-me um segundo para checar o banco de dados principal.",
        "Essa é uma ótima pergunta. Nossos desenvolvedores estão trabalhando nisso nesse exato momento na Sprint.",
        "Perfeito! Verifiquei sua conta e a requisição Socket.io via Node consta como entregue (200 OK). Algo mais?",
        "Tudo bem, abri um chamado interno (#1025) para a equipe de infra do NOC. Mais alguma requisição técnica Mestre?",
        "Entendido. Posso reiniciar o Serviço Secundário do React no seu lugar se desejar. Autoriza?",
        "Não se preocupe, a migração para a V3 do Tailwind deve estabilizar essa quebra de layout relatada. Me mostre outro log se tiver."
    ];

    let msgCount = 0; // Quantos balões o usuário já mandou

    // Auto-Scroll Fino e Avançado (Para manter o Chat no Bottom)
    const scrollToBottom = () => {
        uiCanvas.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };

    // Toque de Realismo: Notificação Sonora (Áudio HTML5 Mute Error-Safe)
    const playPop = () => {
        systemPop.currentTime = 0; // zera pro caso de metralhadora
        systemPop.play().catch(() => { /* Sem erro caso Navegador bloqueie AutoPlay por segurança */ });
    };

    // --- FUNÇÃO CORE: INJETAR BOLHA NA TELA ---
    const injectBubble = (text, isMe) => {
        
        const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' });
        
        let nodeHTML = '';

        if (isMe) {
            // Bolha do USUARIO (Direita Azulao)
            nodeHTML = `
            <div class="flex w-full items-end justify-end space-x-2 pl-12 mb-4">
                <div class="flex flex-col space-y-1 items-end max-w-[85%] sm:max-w-[70%]">
                    <div class="bubble me shadow-sm hover:shadow-md transition-shadow">
                        ${text}
                    </div>
                    <span class="text-[10px] text-chat-textMuted mr-1">${timestamp} <i data-lucide="check-check" class="w-3 h-3 text-blue-500 inline ml-0.5 relative top-[-1px]"></i></span>
                </div>
            </div>`;
        } else {
            // Bolha do ATENDENTE / BOT (Esquerda Cinza)
            nodeHTML = `
            <div class="flex w-full items-end gap-2 pr-12 mb-4">
                <img src="https://ui-avatars.com/api/?name=Emma+Support&background=6366F1&color=fff&size=50" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full mb-4 shadow flex-shrink-0" alt="">
                <div class="flex flex-col space-y-1 items-start max-w-[85%] sm:max-w-[70%]">
                    <span class="text-[10px] text-chat-textMuted font-medium ml-1">Emma S.</span>
                    <div class="bubble them shadow-sm border border-chat-border/60 bg-white">
                        ${text}
                    </div>
                    <span class="text-[10px] text-chat-textMuted ml-1">${timestamp}</span>
                </div>
            </div>`;
        }

        // Criar elemento e jogar no canvas
        const wrap = document.createElement('div');
        wrap.innerHTML = nodeHTML;
        
        // Renderizar Ícones na Mosca pros CheckMarks tickados azuis
        uiCanvas.appendChild(wrap.firstElementChild);
        lucide.createIcons();

        scrollToBottom();
    };

    // -- CONTROLE DO INPUT VAZIO E ENTER KEY --
    uiForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        
        const query = uiInput.value.trim();
        if (!query) return;

        // 1. Apaga do Input
        uiInput.value = '';
        uiBtn.disabled = true; // Impede spam duplo

        // 2. Coloca minha bolha azul (Usuario)
        injectBubble(query, true);

        // -- LOGICA DA INTELIGENCIA DO ROBO --
        // Inicia delay dinamico humano entre 1000ms a 2000ms.
        const thinkDelay = Math.floor(Math.random() * 1000) + 1000;
        
        setTimeout(() => {
            // 3. Mostra Indicator "Digitando..." e Rola Pagina
            uiTyper.classList.remove('opacity-0', 'h-0');
            uiTyper.classList.add('opacity-100', 'h-14');
            scrollToBottom();

            // Sorteia o tempo de digitação (quanto maior o texto pronto q ele vai mandar, mais ele "digita")
            const responseText = agentAnswers[msgCount % agentAnswers.length];
            const typingPace = (responseText.length * 30) + 1000; // Formula nativa de UX (30ms por caractere + 1s freio base)

            setTimeout(() => {
                // 4. Esconde o Digitando
                uiTyper.classList.add('opacity-0', 'h-0');
                uiTyper.classList.remove('opacity-100', 'h-14');
                
                msgCount++;

                // 5. Injeta Resposta da Emma (Atendente) Plaft!
                injectBubble(responseText, false);
                playPop(); // Gira Audio nativo
                uiBtn.disabled = false; // Relibera p User

            }, typingPace);

        }, thinkDelay);

    });

});
