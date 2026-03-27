import tkinter as tk
from tkinter import ttk
import time
import threading

# ==========================================================
# AUTO POST-FORMAT (SYSADMIN EDITION) - PYTHON NATIVO
# Orquestrador de Infraestrutura e Instalação em Massa WinGet
# ==========================================================

# Paleta Corporativa Limpa (White/Blue IT)
BG_WHITE = "#ffffff"
BG_PANEL = "#f1f5f9"  # Slate 50
TEXT_MAIN = "#0f172a"
BLUE_CORP = "#2563eb"
RED_ERROR = "#ef4444"

# ==========================================================
# CATÁLOGOS DE SOFTWARES REAIS (Packages ID do WinGet Oficial Microsoft)
# ==========================================================
SOFTWARE_DB = {
    "Navegadores & Mídia": [
        {"name": "Google Chrome", "id": "Google.Chrome", "sel": True},
        {"name": "Mozilla Firefox", "id": "Mozilla.Firefox", "sel": False},
        {"name": "VLC Media Player", "id": "VideoLAN.VLC", "sel": True},
        {"name": "Spotify", "id": "Spotify.Spotify", "sel": False}
    ],
    "Utilidades Sistema": [
        {"name": "WinRAR", "id": "WinRAR", "sel": True},
        {"name": "7-Zip", "id": "7zip.7zip", "sel": False},
        {"name": "AnyDesk", "id": "AnyDeskSoftwareGmbH.AnyDesk", "sel": False},
        {"name": "Adobe Acrobat Reader", "id": "Adobe.Acrobat.Reader.64-bit", "sel": True}
    ],
    "Desenvolvimento (Dev)": [
        {"name": "Visual Studio Code", "id": "Microsoft.VisualStudioCode", "sel": False},
        {"name": "Git", "id": "Git.Git", "sel": False},
        {"name": "Node.js (LTS)", "id": "OpenJS.NodeJS.LTS", "sel": False},
        {"name": "Docker Desktop", "id": "Docker.DockerDesktop", "sel": False}
    ]
}

class AutoPostFormatApp(tk.Tk):
    def __init__(self):
        super().__init__()
        
        # 1. Configuração Janela Clássico Windows App
        self.title("⚡ Auto Post-Format | IT Infrastructure Manager")
        self.geometry("800x600")
        self.configure(bg=BG_WHITE)
        self.minsize(800, 600)
        self.eval('tk::PlaceWindow . center')
        
        self.is_running = False
        self.checkbox_vars = {} # Dict para guardar o Estado das Checkboxes {"Google.Chrome": BooleanVar()}
        
        self._build_ui()

    def _build_ui(self):
        # ---- HEADER CORPORATIVO ----
        header_frame = tk.Frame(self, bg=BLUE_CORP, height=70)
        header_frame.pack(fill=tk.X, side=tk.TOP)
        header_frame.pack_propagate(False) # Mantém tamanho fixo

        lbl_title = tk.Label(header_frame, text="SysAdmin: Auto Post-Format", bg=BLUE_CORP, fg=BG_WHITE, font=("Segoe UI", 16, "bold"))
        lbl_title.pack(side=tk.LEFT, padx=20, pady=20)
        
        lbl_sub = tk.Label(header_frame, text="Instalação Silenciosa em Massa (WinGet Wrapper)", bg=BLUE_CORP, fg="#93c5fd", font=("Segoe UI", 10))
        lbl_sub.pack(side=tk.LEFT, pady=25)

        # ---- CONTEUDO PRINCIPAL (2 COLUNAS) ----
        main_content = tk.Frame(self, bg=BG_WHITE)
        main_content.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Coluna 1: Categorias e Checkboxes (Esquerda)
        left_col = tk.Frame(main_content, bg=BG_WHITE)
        left_col.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        for category, packages in SOFTWARE_DB.items():
            # Caixa de Categoria
            cat_frame = tk.LabelFrame(left_col, text=f" {category} ", bg=BG_WHITE, fg=BLUE_CORP, font=("Segoe UI", 10, "bold"), padx=10, pady=5)
            cat_frame.pack(fill=tk.X, pady=8, padx=5)
            
            # Grid das opções dentro da categoria
            for i, pkg in enumerate(packages):
                var = tk.BooleanVar(value=pkg["sel"])
                self.checkbox_vars[pkg["id"]] = {"var": var, "name": pkg["name"]}
                
                chk = tk.Checkbutton(cat_frame, text=f"{pkg['name']} ({pkg['id']})", variable=var, bg=BG_WHITE, fg=TEXT_MAIN, activebackground=BG_WHITE, selectcolor=BG_PANEL, font=("Segoe UI", 9))
                # Distribuir em colunas para gastar menos espaço vertical (2 checks por linha)
                row, col = divmod(i, 2)
                chk.grid(row=row, column=col, sticky="w", padx=10, pady=2)


        # Coluna 2: Informações, Perfis e Log (Direita/Bottom)
        right_col = tk.Frame(main_content, bg=BG_WHITE)
        right_col.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(10, 0))

        # Perfis Automáticos (Combobox / Botões rápidos)
        ctrl_frame = tk.LabelFrame(right_col, text=" Ações e Perfis ", bg=BG_WHITE, fg=BLUE_CORP, font=("Segoe UI", 10, "bold"), padx=10, pady=5)
        ctrl_frame.pack(fill=tk.X, pady=8)

        lbl_warn = tk.Label(ctrl_frame, text="⚠️ Dry-Run Ativo: Este script simulará a janela CMD do\nWinGet. Sua máquina atual NÃO será alterada.", bg=BG_WHITE, fg="#d97706", font=("Segoe UI", 8, "bold"), justify=tk.LEFT)
        lbl_warn.pack(anchor="w", pady=5)

        self.btn_run = tk.Button(ctrl_frame, text="▶ INICIAR INSTALAÇÃO SILENCIOSA", bg=BLUE_CORP, fg="white", font=("Segoe UI", 11, "bold"), bd=0, padx=10, pady=10, command=self._start_automation)
        self.btn_run.pack(fill=tk.X, pady=10)

        # ---- ÁREA DE LOG DO TERMINAL (BOTTOM) ----
        log_frame = tk.Frame(self, bg=TEXT_MAIN)
        log_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 20))
        
        lbl_log_title = tk.Label(log_frame, text="Terminal Output (StdOut) / WinGet", bg=TEXT_MAIN, fg="#4ade80", font=("Consolas", 9, "bold"))
        lbl_log_title.pack(anchor="w", padx=10, pady=(5, 0))
        
        self.txt_log = tk.Text(log_frame, bg=TEXT_MAIN, fg="#f8fafc", font=("Consolas", 10), bd=0, state=tk.DISABLED, wrap=tk.WORD)
        self.txt_log.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Progress bar
        style = ttk.Style()
        style.theme_use('default')
        style.configure("Blue.TProgressbar", background=BLUE_CORP)
        self.progress = ttk.Progressbar(self, orient=tk.HORIZONTAL, style="Blue.TProgressbar", mode='determinate')
        self.progress.pack(fill=tk.X, side=tk.BOTTOM)


    # ---- MOTOR DE LOG REATIVO ----
    def _print_log(self, text, color="#f8fafc"):
        self.txt_log.config(state=tk.NORMAL)
        self.txt_log.insert(tk.END, text + "\n", color)
        self.txt_log.tag_config(color, foreground=color)
        self.txt_log.see(tk.END) # Auto-scroll pro fim
        self.txt_log.config(state=tk.DISABLED)

    # ---- LOOP DE INSTALAÇÃO MULTITHREAD ----
    def _start_automation(self):
        if self.is_running: return
        self.is_running = True
        self.btn_run.config(state=tk.DISABLED, bg="#94a3b8")
        
        # Filtrar o que o usuario clicou
        to_install = []
        for pkg_id, info in self.checkbox_vars.items():
            if info["var"].get() == True:
                to_install.append({"id": pkg_id, "name": info["name"]})

        if not to_install:
            self._print_log("ERRO: Nenhuma ferramenta selecionada para Instalação.", RED_ERROR)
            self.is_running = False
            self.btn_run.config(state=tk.NORMAL, bg=BLUE_CORP)
            return

        self._print_log("==== INCIANDO SCRIPT PÓS-FORMATAÇÃO (DRY RUN) ====", "#38bdf8")
        self._print_log(f"Processando lista com {len(to_install)} pacotes...\n", "#94a3b8")
        
        self.progress['value'] = 0
        self.progress['maximum'] = len(to_install)

        # Roda o processamento numa Thead paralela pra o Tkinter nao congelar
        threading.Thread(target=self._bash_executor, args=(to_install,)).start()


    def _bash_executor(self, package_list):
        for index, pkg in enumerate(package_list):
            
            # String real do Windows (Esse é o valor do sysadmin)
            raw_command = f"winget install --id {pkg['id']} --exact --silent --accept-package-agreements --accept-source-agreements"
            
            self._print_log(f"[{index+1}/{len(package_list)}] Preparando Instalação de: {pkg['name']}")
            self._print_log(f"PS> {raw_command}", "#fcd34d") # Amarelo power shell style
            
            time.sleep(1.2) # Fingindo download de metadados do WINGET
            self._print_log("  -> Encontrado pacote no Repositório (msstore/winget). Baixando Instalador (27MB)...")
            
            # Simulando os estagios de progresso da ferramenta
            for p in range(1, 4):
                time.sleep(0.8)
                self._print_log(f"  -> Download: {p * 33}% concluído", "#94a3b8")
                
            time.sleep(1.0)
            self._print_log(f"  -> Extraindo arquivos MSIX/EXE... Executando instalador em Background (Silent Mode)")
            time.sleep(1.5)
            self._print_log(f"✅ {pkg['name']} instalado com SUCESSO. Registro de Máquina (Registry) aprovado.\n", "#4ade80")
            
            self.progress['value'] = index + 1

        # Acabou tudo
        self.is_running = False
        self.btn_run.config(state=tk.NORMAL, bg=BLUE_CORP)
        self._print_log("==== DEPLOY DA MÁQUINA FINALIZADO! REINICIE O PC. ====", "#38bdf8")


if __name__ == "__main__":
    app = AutoPostFormatApp()
    app.mainloop()
