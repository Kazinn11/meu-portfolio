import tkinter as tk
from tkinter import ttk
import subprocess
import threading
import time
import hashlib
import os

# ==========================================================
# THREAT MONITOR - CYBER SECURITY SCANNER ENGINES (PYTHON)
# Leitor de Anéis do Kernel Windows "Sem Instalação PIP"
# ==========================================================

# Design de Interface Militar/Hacker
BG_DARK = "#0a0a0c"
BG_BASE = "#131316"
NEON_GREEN = "#00ff41" # Tudo Seguro
NEON_RED = "#ff003c"   # Ameaça Letal
NEON_AMBER = "#ffb300" # Verificando
TXT_GRAY = "#828291"

class ThreatMonitorApp(tk.Tk):
    def __init__(self):
        super().__init__()
        
        self.title("🛡️ Threat Monitor | Advanced Cyber Security Panel")
        self.geometry("860x540")
        self.configure(bg=BG_DARK)
        self.eval('tk::PlaceWindow . center')
        
        # Estado de Alarme do Sistema Multi-Thread
        self.system_status = "SAFE" # SAFE, SCANNING, THREAT
        self.active_threads = True
        
        # Contadores Reais da Placa de Rede (Socket Python)
        self.tcp_count = 0
        self.sys_hash = "VERIFICANDO..."
        
        self._build_ui()
        
        # 1. Inicia o Loop Subprocess de Leitura Infinita em Thread Sepadara (pra n congelar Tkinter)
        threading.Thread(target=self._kernel_scanner_loop, daemon=True).start()
        
        # 2. Inicia o Timer de "Acao Scriptada" (O Falso Ataque Trojan para Demo)
        threading.Thread(target=self._simulate_cyber_attack, daemon=True).start()

    
    def _build_ui(self):
        # ---- HEADER (PAINEL RADAR INDICADOR) ----
        self.header_frame = tk.Frame(self, bg=BG_BASE, height=80, highlightthickness=0)
        self.header_frame.pack(fill=tk.X, side=tk.TOP, pady=0)
        self.header_frame.pack_propagate(False)

        self.lbl_title = tk.Label(self.header_frame, text="THREAT MONITOR: ACTIVE", bg=BG_BASE, fg=NEON_GREEN, font=("Consolas", 18, "bold"))
        self.lbl_title.pack(side=tk.LEFT, padx=20, pady=20)
        
        self.lbl_pulse = tk.Label(self.header_frame, text="● Sistema Protegido (Normal Mode)", bg=BG_BASE, fg=NEON_GREEN, font=("Consolas", 10))
        self.lbl_pulse.pack(side=tk.RIGHT, padx=20, pady=25)
        
        # Barra Divisória de Luz Neon
        self.neon_bar = tk.Frame(self, bg=NEON_GREEN, height=2)
        self.neon_bar.pack(fill=tk.X)

        # ---- PAINEIS DE METRIFICACAO (3 CARDS LADO A LADO) ----
        cards_frame = tk.Frame(self, bg=BG_DARK)
        cards_frame.pack(fill=tk.X, padx=15, pady=20)
        
        # Card 1: Portas TCP Abertas Netstat
        self.c1 = tk.Frame(cards_frame, bg=BG_BASE, padx=15, pady=15, highlightbackground="#222", highlightthickness=1)
        self.c1.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        self.l1_ttl = tk.Label(self.c1, text="PORTAS UDP/TCP ACTIVAS", bg=BG_BASE, fg=TXT_GRAY, font=("Courier", 8, "bold"))
        self.l1_ttl.pack(anchor="w")
        self.l1_val = tk.Label(self.c1, text="0", bg=BG_BASE, fg=NEON_GREEN, font=("Consolas", 24, "bold"))
        self.l1_val.pack(anchor="w", pady=5)

        # Card 2: Kernel Processes Counter
        self.c2 = tk.Frame(cards_frame, bg=BG_BASE, padx=15, pady=15, highlightbackground="#222", highlightthickness=1)
        self.c2.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        self.l2_ttl = tk.Label(self.c2, text="PROCESSOS O.S. (TASKLIST)", bg=BG_BASE, fg=TXT_GRAY, font=("Courier", 8, "bold"))
        self.l2_ttl.pack(anchor="w")
        self.l2_val = tk.Label(self.c2, text="214", bg=BG_BASE, fg=NEON_GREEN, font=("Consolas", 24, "bold"))
        self.l2_val.pack(anchor="w", pady=5)

        # Card 3: System File Hash Map (MD5)
        self.c3 = tk.Frame(cards_frame, bg=BG_BASE, padx=15, pady=15, highlightbackground="#222", highlightthickness=1)
        self.c3.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=5)
        self.l3_ttl = tk.Label(self.c3, text="KERNEL INTEGRITY HASH (SHA-256)", bg=BG_BASE, fg=TXT_GRAY, font=("Courier", 8, "bold"))
        self.l3_ttl.pack(anchor="w")
        self.l3_val = tk.Label(self.c3, text="CALCULATING...", bg=BG_BASE, fg=NEON_AMBER, font=("Consolas", 10, "bold"), justify=tk.LEFT, wraplength=200)
        self.l3_val.pack(anchor="w", pady=10)


        # ---- ÁREA DE LOG DE SEGURANÇA (O CORAÇÃO DO FIREWALL VISUAL) ----
        log_frame = tk.Frame(self, bg=BG_DARK)
        log_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 20))
        
        lbl_log_title = tk.Label(log_frame, text="> ACTIVE FIREWALL SYSLOG_ EVENTS", bg=BG_DARK, fg=TXT_GRAY, font=("Consolas", 9, "bold"))
        lbl_log_title.pack(anchor="w", pady=(0, 5))
        
        # Caixa Pretona Matrix Hacker
        self.syslog = tk.Text(log_frame, bg="#050505", fg=TXT_GRAY, font=("Consolas", 9), bd=0, highlightthickness=1, highlightbackground="#222")
        self.syslog.pack(fill=tk.BOTH, expand=True)
        self.syslog.config(state=tk.DISABLED)


    # ========================================================
    # LOGICA VISUAL GUI
    # ========================================================
    def _log(self, text, color=TXT_GRAY):
        # Pra Atualizar a Tela precisa destrancar, printar a linha com cor, e trancar denovo
        self.syslog.config(state=tk.NORMAL)
        t_stamp = time.strftime("%H:%M:%S")
        self.syslog.insert(tk.END, f"[{t_stamp}] ", TXT_GRAY)
        self.syslog.insert(tk.END, text + "\n", color)
        
        self.syslog.tag_config(color, foreground=color)
        self.syslog.tag_config(TXT_GRAY, foreground=TXT_GRAY)
        
        self.syslog.see(tk.END)
        self.syslog.config(state=tk.DISABLED)

    def _trigger_red_alert(self):
        # A magia de trocar TODA A TELA pra Vermelho Ameaça!
        self.lbl_title.config(text="CRITICAL THREAT DETECTED!", fg=NEON_RED)
        self.lbl_pulse.config(text="● ROTEAMENTO COMPROMETIDO (Bloqueando...)", fg=NEON_RED)
        self.neon_bar.config(bg=NEON_RED)
        
        self.l1_val.config(fg=NEON_RED)
        self.c1.config(highlightbackground=NEON_RED, highlightthickness=2)
        
        self.system_status = "THREAT"


    # ========================================================
    # MOTORES ASSÍNCRONOS DE SCAN MESTRE (OS & NETSTAT)
    # ========================================================
    def _kernel_scanner_loop(self):
        # Cria um Hash MD5 inicial (Ficticio/Hospedeiro do Python atual)
        time.sleep(1)
        seed_file = __file__ # Ele mesmo
        try:
           with open(seed_file, "rb") as f:
               md5 = hashlib.md5(f.read()).hexdigest()
               # Traz de volta para o Tkinter Main Thread de forma segura
               self.after(0, lambda: self.l3_val.config(text=f"Aprovado: {md5[:15]}...", fg=NEON_GREEN))
               self.after(0, lambda: self._log(f"Integridade SHA-256 Base do Kernel Registrada -> {md5[:10]}", NEON_GREEN))
        except:
             pass

        while self.active_threads:
            if self.system_status == "SAFE":
                try:
                    # Roda o Scanner Nativo de Internet Aberta (Cmd do Windows) Sem Telinha Preta popando
                    # "netstat -ano" mostra portas em Listening e conexões Establed pelo Router
                    net_output = subprocess.check_output("netstat -ano", shell=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
                    q_sockets = len(net_output.splitlines()) - 4 # Tira os cabecalhos
                    
                    # Roda Scanner de Processos da Memória RAM e CPU (.exe rodandos)
                    task_output = subprocess.check_output("tasklist", shell=True, text=True, creationflags=subprocess.CREATE_NO_WINDOW)
                    q_tasks = len(task_output.splitlines()) - 3

                    # Injeta na UI
                    self.after(0, lambda qtcp=q_sockets, qtsk=q_tasks: [
                        self.l1_val.config(text=str(qtcp)),
                        self.l2_val.config(text=str(qtsk))
                    ])
                    self.after(0, lambda: self._log(f"Varredura Sistema... Total Portas Ouvindo: {q_sockets} | Seguros.", TXT_GRAY))

                except Exception as e:
                    pass
            
            time.sleep(2) # Pausa pra n explodir a CPU do cara usando Python
            
            
    # ========================================================
    # EVENTO DEMO: Ataque Hacker Scriptado para Portfolio Show
    # ========================================================
    def _simulate_cyber_attack(self):
        # Espera o recrutador olhar os gráficos normais uns 6 segundos
        time.sleep(8)
        
        if self.active_threads:
            # 1. Alarme Laranja de Anomalia
            self.after(0, lambda: self._log("WARNING: Anomaly detected Memory Heap PID 0x48FA...", NEON_AMBER))
            time.sleep(1.5)
            self.after(0, lambda: self._log("WARNING: Unknown UDP connection opening Port 4444! (Reverse Shell?)", NEON_AMBER))
            self.after(0, lambda: self.l3_val.config(text="CORRUPTED HASH!", fg=NEON_RED))
            
            # 2. ATAQUE MASSIVO! Dispara o Alerta Vermelho Total da Interface
            time.sleep(1)
            self.after(0, self._trigger_red_alert)
            self.after(0, lambda: self._log("CRITICAL: Remote Access Trojan (RAT) Injection Blocked!", NEON_RED))
            self.after(0, lambda: self._log("FIREWALL ACTION: Isolating Local Port 4444... Terminating PID.", NEON_RED))
            
            # Subindo as metricas de rede na mascara vermelha asustustando o User
            for _ in range(5):
                 time.sleep(0.5)
                 self.after(0, lambda: self._log("Killing process threads... [FAILED_BUT_RETRYING]", NEON_RED))
                 
            # 3. Limpeza Final Restaura a estabilidade
            time.sleep(2)
            self.after(0, lambda: self._log("SUCCESS: Threat Eradicated. Firewall rules reinforced. Port blocked.", NEON_GREEN))
            
            # Restaura a janela pra luz verde suave do Modo Seguro
            self.after(0, lambda: self.lbl_title.config(text="THREAT MONITOR: ACTIVE", fg=NEON_GREEN))
            self.after(0, lambda: self.lbl_pulse.config(text="● Sistema Protegido (Normal Mode)", fg=NEON_GREEN))
            self.after(0, lambda: self.neon_bar.config(bg=NEON_GREEN))
            self.after(0, lambda: self.c1.config(highlightbackground="#222", highlightthickness=1))
            self.after(0, lambda: self.l1_val.config(fg=NEON_GREEN))
            self.after(0, lambda: self.l3_val.config(text="Aprovado: 2b9a7f...", fg=NEON_GREEN))
            
            self.system_status = "SAFE"

if __name__ == "__main__":
    app = ThreatMonitorApp()
    app.mainloop()
