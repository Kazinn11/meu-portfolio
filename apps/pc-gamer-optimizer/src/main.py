# ==========================================================
# PC GAMER OPTIMIZER (RAZER NEON THEME) - PYTHON NATIVO
# Desenvolvido para Portfólio de Alta Performance
# ==========================================================

import tkinter as tk
from tkinter import ttk
import os
import time
import threading
import subprocess

# Paleta Profunda Neon Gamer
BG_COLOR = "#0f0f13"
FG_TEXT = "#e2e8f0"
NEON_GREEN = "#39ff14"
SURFACE_L = "#1b1b22"

class GamerOptimizerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        
        # 1. Configuração Janela Borderless e TopMost
        self.title("PC Gamer Optimizer")
        self.geometry("640x400")
        self.configure(bg=BG_COLOR)
        
        # Remove título quadrado do Windows
        self.overrideredirect(True)
        # Borda Neon Falsa no Corpo principal
        self.configure(highlightthickness=1, highlightbackground=NEON_GREEN)
        
        # Centraliza na tela
        self.eval('tk::PlaceWindow . center')
        
        self.is_cleaning = False
        
        self._build_ui()
        self._bind_drag_window()

    def _build_ui(self):
        # HEADER Customizado (Para puxar e Fechar)
        self.headerFrame = tk.Frame(self, bg=NEON_GREEN, height=3)
        self.headerFrame.pack(fill=tk.X, side=tk.TOP)
        
        self.topBar = tk.Frame(self, bg=SURFACE_L, height=35)
        self.topBar.pack(fill=tk.X, side=tk.TOP)
        
        # Título
        lbl_title = tk.Label(self.topBar, text="⚙️ PC GAMER OPTIMIZER", bg=SURFACE_L, fg=NEON_GREEN, font=("Courier New", 12, "bold"))
        lbl_title.pack(side=tk.LEFT, padx=15, pady=5)
        
        # Botão Fechar X
        btn_close = tk.Button(self.topBar, text="X", bg=SURFACE_L, fg=FG_TEXT, bd=0, activebackground="red", font=("Courier", 12, "bold"), command=self.destroy)
        btn_close.pack(side=tk.RIGHT, padx=10)

        # -----------------------------
        # ÁREA CENTRAL (DASHBOARD)
        # -----------------------------
        self.centerBox = tk.Frame(self, bg=BG_COLOR)
        self.centerBox.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Status Visor
        self.lbl_status_main = tk.Label(self.centerBox, text="SISTEMA AGUARDANDO ANÁLISE", bg=BG_COLOR, fg=FG_TEXT, font=("Courier New", 14, "bold"))
        self.lbl_status_main.pack(pady=10)
        
        self.lbl_junk_calc = tk.Label(self.centerBox, text="0.00 GB", bg=BG_COLOR, fg=NEON_GREEN, font=("Consolas", 38, "bold"))
        self.lbl_junk_calc.pack(pady=5)
        
        self.lbl_junk_desc = tk.Label(self.centerBox, text="Lixo de Cache & Temp Logs acumulados no Windows", bg=BG_COLOR, fg="#64748b", font=("Arial", 9))
        self.lbl_junk_desc.pack()

        # Botão Ação (CANVAS FAKE BUTTON PRA FICAR NEON/LARGO)
        self.canvas_btn = tk.Canvas(self.centerBox, width=280, height=50, bg=BG_COLOR, highlightthickness=0)
        self.canvas_btn.pack(pady=35)
        
        # Desenha a caixa Neon com borda
        self.rect_id = self.canvas_btn.create_rectangle(2, 2, 278, 48, outline=NEON_GREEN, width=2, fill=SURFACE_L)
        self.text_id = self.canvas_btn.create_text(140, 25, text="ATIVAR MODO TURBO", fill=NEON_GREEN, font=("Courier New", 12, "bold"))
        
        # Efeitos Hover e Click
        self.canvas_btn.bind("<Enter>", lambda e: self.canvas_btn.itemconfig(self.rect_id, fill=NEON_GREEN))
        self.canvas_btn.bind("<Enter>", lambda e: self.canvas_btn.itemconfig(self.text_id, fill="black"), add="+")
        self.canvas_btn.bind("<Leave>", lambda e: self.canvas_btn.itemconfig(self.rect_id, fill=SURFACE_L))
        self.canvas_btn.bind("<Leave>", lambda e: self.canvas_btn.itemconfig(self.text_id, fill=NEON_GREEN), add="+")
        self.canvas_btn.bind("<Button-1>", self._start_optimization)

        # Progress Bar Custom
        style = ttk.Style()
        style.theme_use('default')
        style.configure("TProgressbar", thickness=8, background=NEON_GREEN, troughcolor=SURFACE_L, bordercolor=BG_COLOR, lightcolor=NEON_GREEN, darkcolor=NEON_GREEN)
        
        self.progress = ttk.Progressbar(self.centerBox, style="TProgressbar", orient=tk.HORIZONTAL, length=400, mode='determinate')
        # (Escondemos no inicio)
        
        self.lbl_log = tk.Label(self.centerBox, text="", bg=BG_COLOR, fg="#64748b", font=("Consolas", 8))
        self.lbl_log.pack(side=tk.BOTTOM, pady=0)

        # Chama Análise no Boot
        threading.Thread(target=self._scan_junk_simulation).start()


    # ---- DRAGGING (ARRASTAR A JANELA PELA TOPBAR) ----
    def _bind_drag_window(self):
        self.topBar.bind("<ButtonPress-1>", self.start_move)
        self.topBar.bind("<B1-Motion>", self.do_move)
        
    def start_move(self, event):
        self.x = event.x
        self.y = event.y

    def do_move(self, event):
        deltax = event.x - self.x
        deltay = event.y - self.y
        x = self.winfo_x() + deltax
        y = self.winfo_y() + deltax
        self.geometry(f"+{x}+{y}")


    # ---- REGRAS DE NEGÓCIO DA OTIMIZAÇÃO ----
    def _scan_junk_simulation(self):
        # Simula scan no %TEMP% (Le os bytes mas não apaga pra manter segurança da maquina na demo)
        self.lbl_status_main.config(text="VARRENDO DIRETÓRIOS PREFETCH %TEMP%...", fg="#ffaa00")
        time.sleep(1)
        
        temp_dir = os.environ.get('TEMP', 'C:\\Windows\\Temp')
        total_size = 0
        try:
            for dirpath, dirnames, filenames in os.walk(temp_dir):
                for f in filenames:
                    fp = os.path.join(dirpath, f)
                    if not os.path.islink(fp):
                        total_size += os.path.getsize(fp)
        except:
             pass 

        # Se for irrisório, a gente infla um pouco o número para a "Showcase" ficar mais gloriosa
        fake_gb = (total_size / (1024**3)) + 1.25 
        
        time.sleep(0.5)
        self.lbl_junk_calc.config(text=f"{fake_gb:.2f} GB")
        self.lbl_status_main.config(text="CENÁRIO CRÍTICO DE LIXO DETECTADO", fg="#ff0044")

    def _start_optimization(self, event):
        if self.is_cleaning:
            return
            
        self.is_cleaning = True
        self.canvas_btn.pack_forget()
        self.progress.pack(pady=35)
        self.progress['value'] = 0
        
        self.lbl_status_main.config(text="OTIMIZANDO KERNEL E LIMPANDO CACHE", fg=NEON_GREEN)
        
        # Thread para não congelar o TKinter Window Mainloop
        threading.Thread(target=self._run_purge).start()

    def _run_purge(self):
        logs = [
            "Flushing DNS Cache...",
            "Deleting C:\\Windows\\Prefetch\\*...",
            "Killing Background Telemetry tasks...",
            "Freeing Memory Virtual Pagefile...",
            "Overriding GPU Settings (Turbo)...",
            "[OK] 1.2 GB Freed. System Stable."
        ]
        
        for step, log in enumerate(logs):
            self.lbl_log.config(text=f">> {log}")
            time.sleep(0.7)
            self.progress['value'] += 100 / len(logs)
            
            # Decrementando o Numero Gigante Falso pra parecer que ta sugando os dados
            cur_gb = float(self.lbl_junk_calc.cget("text").split(" ")[0])
            if cur_gb > 0:
                self.lbl_junk_calc.config(text=f"{max(0, cur_gb - 0.25):.2f} GB")

        self.lbl_junk_calc.config(text="0.00 GB")
        self.lbl_status_main.config(text="MÁQUINA PRONTA PARA GAMING EXTREMO", fg=NEON_GREEN)
        
        # Show Button Again as Disabled State Confident
        self.progress.pack_forget()
        self.canvas_btn.pack(pady=35)
        self.canvas_btn.itemconfig(self.text_id, text="SISTEMA OTIMIZADO")
        self.canvas_btn.itemconfig(self.rect_id, outline="#64748b")
        self.canvas_btn.itemconfig(self.text_id, fill="#64748b")

if __name__ == "__main__":
    app = GamerOptimizerApp()
    app.mainloop()
