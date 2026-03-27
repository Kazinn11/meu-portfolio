/**
 * NOC Watchtower - Frontend Javascript
 * Simula as conexões de Sockets com Spikes de CPU para Teste do Recrutador.
 */

document.addEventListener("DOMContentLoaded", () => {

    // ===== 1. Gráfico Streaming (Chart.js) =====
    const ctx = document.getElementById('liveStreamingChart').getContext('2d');
    
    // Configs das Cores
    const cyan = 'rgba(0, 242, 254, 1)';
    const cyanBg = 'rgba(0, 242, 254, 0.1)';
    const redAlert = 'rgba(255, 59, 48, 1)';
    const redAlertBg = 'rgba(255, 59, 48, 0.4)';

    // Preenchendo array x(tempo) e y(dados) zerados com 20 posições p/ ficar contínuo
    let xLabels = Array.from({length: 20}, (_, i) => i);
    let yData = Array.from({length: 20}, () => 20); // Comeca nos 20%
    let pointColors = Array.from({length: 20}, () => cyan); // Circulos normais

    const liveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xLabels,
            datasets: [{
                label: 'Carga Sistêmica (%)',
                data: yData,
                borderColor: cyan,
                backgroundColor: cyanBg,
                borderWidth: 2,
                pointBackgroundColor: pointColors,
                pointRadius: 3,
                fill: true,
                tension: 0.4 // Curva macia cardíaca
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 400, // Animação veloz acompanhando o tic-tac
                easing: 'linear'
            },
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    display: false // Esconde os Nros do eixo X pra dar ideia de Infinito
                },
                y: {
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(30, 45, 74, 0.5)' },
                    ticks: { color: '#64748B' }
                }
            }
        }
    });

    // ===== 2. Engine "Mock" do Socket.io do server.js =====
    // Como a página vai rodar local (sem Node), a gente re-cria a emissão
    
    // Constantes Circunferencias Elementar (SVG Dashoffset = C - (P*C))
    const circLength = parseInt(251); 

    const elRadCpu = document.getElementById('radial-cpu');
    const elTxtCpu = document.getElementById('txt-cpu');
    const boxCpu = document.getElementById('card-cpu');

    const elRadRam = document.getElementById('radial-ram');
    const elTxtRam = document.getElementById('txt-ram');
    const elRawRam = document.getElementById('txt-ram-raw');

    const uiToast = document.getElementById('critical-toast');
    const uiTerminal = document.getElementById('log-terminal');

    // Variaveis de Volatilidade
    let isSpiking = false;
    let spikeDuration = 0;

    const generateSocketPayload = () => {
        // Logica Geração Dinamica
        let cpuLoad = Math.floor(Math.random() * 25) + 15; // 15% a 40% (Normal)
        let ramLoad = Math.floor(Math.random() * 10) + 40; // 40% a 50% (Normal)
        
        // Simular um Alarme de "Pânico de Tráfego" as vezes
        if (Math.random() > 0.95 && !isSpiking) {
            isSpiking = true;
            spikeDuration = Math.floor(Math.random() * 6) + 4; // Dura de 4 a 10s
        }

        if (isSpiking) {
            cpuLoad = Math.floor(Math.random() * 15) + 85; // Estoura de 85 a 100%
            ramLoad = Math.floor(Math.random() * 15) + 75; // Estoura de 75 a 90%
            spikeDuration--;
            if (spikeDuration <= 0) isSpiking = false;
        }

        return {
            cpu: cpuLoad,
            ram: ramLoad,
            ramGB: ((ramLoad / 100) * 64).toFixed(1), // Total fake de Gbs RAM
            isCritical: cpuLoad >= 85
        };
    };

    const padZero = (n) => n < 10 ? '0'+n : n;

    // A Mágica Acontece AQUI. Intervalo a Cada 1000ms.
    setInterval(() => {
        const payload = generateSocketPayload();

        // -- Atualiza Radiais UI --
        elTxtCpu.innerText = payload.cpu + '%';
        // Formula SVG: C - (P/100 * C)
        elRadCpu.style.strokeDashoffset = circLength - (payload.cpu / 100 * circLength);

        elTxtRam.innerText = payload.ram + '%';
        elRawRam.innerText = payload.ramGB + 'GB / 64GB';
        elRadRam.style.strokeDashoffset = circLength - (payload.ram / 100 * circLength);

        // -- Atualiza Streaming Chart (Adiciona no final, Corta no começo) --
        yData.shift(); 
        yData.push(payload.cpu);
        
        pointColors.shift();
        if (payload.isCritical) { pointColors.push(redAlert); } else { pointColors.push(cyan); }

        liveChart.data.datasets[0].pointBackgroundColor = pointColors;
        
        // Mudar cor do Gráfico quando Panic mode
        if (payload.isCritical) {
            liveChart.data.datasets[0].borderColor = redAlert;
            liveChart.data.datasets[0].backgroundColor = redAlertBg;
        } else {
            liveChart.data.datasets[0].borderColor = cyan;
            liveChart.data.datasets[0].backgroundColor = cyanBg;
        }
        liveChart.update();

        // -- Logics de Alerta Critico --
        if (payload.isCritical) {
            // Box CPU
            boxCpu.classList.add('critical-glow');
            elRadCpu.classList.add('circle-alert');
            elTxtCpu.classList.add('text-noc-alert');
            
            // Toast
            uiToast.classList.remove('hidden', 'opacity-0', '-translate-y-4');
        } else {
             // Reset Box
             boxCpu.classList.remove('critical-glow');
             elRadCpu.classList.remove('circle-alert');
             elTxtCpu.classList.remove('text-noc-alert');
             
             // Hide Toast
             uiToast.classList.add('opacity-0', '-translate-y-4');
             setTimeout(() => { uiToast.classList.add('hidden'); }, 300); // Wait CSS
        }

        // -- Terminal Matrix Log --
        const d = new Date();
        const timeStr = `${padZero(d.getHours())}:${padZero(d.getMinutes())}:${padZero(d.getSeconds())}`;
        
        let logLine = document.createElement('div');
        logLine.className = 'font-mono text-[10px] break-all';
        
        if (payload.isCritical) {
            logLine.innerHTML = `<span class="text-white bg-noc-alert px-1 mr-1">CRIT</span> <span class="text-noc-alert">[${timeStr}] - SYSTEM PANIC: CPU LOAD ${payload.cpu}% EXCEEDS THRESHOLD.</span>`;
        } else {
            // Logs normóticos rotativos
            const randomEvts = [
                `[${timeStr}] - NetRX: Validando pacotes HTTP (AuthService).`,
                `[${timeStr}] - NetTX: Syncing Redis Cache (+24MB).`,
                `[${timeStr}] - Worker: Limpando fila do OpsGenie.`,
                `[${timeStr}] - SYSTEM_PING: Cluster Health [A-OK].`
            ];
            logLine.innerHTML = `<span class="text-noc-matrix">${randomEvts[Math.floor(Math.random() * randomEvts.length)]}</span>`;
        }

        uiTerminal.appendChild(logLine);
        
        // Auto Scroll Terminal (Força barra embaixo)
        uiTerminal.scrollTop = uiTerminal.scrollHeight;

        // Limpa memoria do log para nao bugar RAM de verdade da maquina do visitante
        if (uiTerminal.children.length > 30) {
            uiTerminal.removeChild(uiTerminal.firstChild);
        }

    }, 1000); // Velocidade de Polling idêntica a de um WebSocket Emit Real

});
