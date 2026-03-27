import tkinter as tk
from tkinter import ttk, filedialog, messagebox

# ==========================================================
# DATA ANALYZER TOOL - PANDAS DATA SCIENCE SUITE
# Projetado para Big Data (CSVs pesados) e Analytics.
# ==========================================================

# 1. Tratamento Pró-Nível de Bibliotecas Faltantes (O RH te contrata aqui)
try:
    import pandas as pd
    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
    REQUIREMENTS_MET = True
except ImportError:
    REQUIREMENTS_MET = False

# Tema Sci-Fi Dark Analytics
BG_MAIN = "#0f172a"
BG_PANEL = "#1e293b"
TXT_WHITE = "#f8fafc"
ACCENT_BLUE = "#38bdf8"
ACCENT_CYAN = "#22d3ee"

class DataAnalyzerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        
        self.title("📊 Data Analyzer Tool (Pandas Engine)")
        self.geometry("1024x640")
        self.configure(bg=BG_MAIN)
        self.eval('tk::PlaceWindow . center')
        
        self.df = None # DataFrame Global em Memória
        
        # Testador de Instalação PIP
        if not REQUIREMENTS_MET:
            self._show_missing_deps_screen()
        else:
            self._build_ui()

    def _show_missing_deps_screen(self):
        # Tela protetora para não estourar Erro Terminal no Computador do Recrutador
        frm = tk.Frame(self, bg=BG_MAIN)
        frm.pack(expand=True, fill=tk.BOTH)
        
        tk.Label(frm, text="⚠️ MOTORES DE DATA SCIENCE AUSENTES", bg=BG_MAIN, fg="#f43f5e", font=("Segoe UI", 24, "bold")).pack(pady=(120, 20))
        tk.Label(frm, text="Este software exige as Bibliotecas de Big Data 'Pandas' e 'Matplotlib'.", bg=BG_MAIN, fg=TXT_WHITE, font=("Segoe UI", 12)).pack(pady=5)
        tk.Label(frm, text="Por favor, abra o Terminal (CMD) e instale rodando o comando abaixo:", bg=BG_MAIN, fg="#94a3b8", font=("Segoe UI", 12)).pack(pady=5)
        
        tk.Entry(frm, bg="#1e293b", fg=ACCENT_CYAN, font=("Consolas", 14), width=45, justify="center", bd=0, insertbackground=TXT_WHITE, readonlybackground="#1e293b").pack(pady=20)
        # Hackzinho pra simular readonly copiável:
        e = frm.winfo_children()[-1]
        e.insert(0, "pip install pandas matplotlib")
        e.config(state="readonly")
        
    def _build_ui(self):
        # ESTILO DOS COMPONENTES (Modernização Tkinter Dark)
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Treeview", background=BG_PANEL, foreground=TXT_WHITE, fieldbackground=BG_PANEL, borderwidth=0, font=("Segoe UI", 9))
        style.map("Treeview", background=[("selected", ACCENT_BLUE)])
        style.configure("Treeview.Heading", background="#334155", foreground=TXT_WHITE, font=("Segoe UI", 9, "bold"), borderwidth=0)
        
        # ==== SIDEBAR (Ações) ====
        self.sidebar = tk.Frame(self, bg=BG_PANEL, width=250)
        self.sidebar.pack(side=tk.LEFT, fill=tk.Y)
        self.sidebar.pack_propagate(False)
        
        tk.Label(self.sidebar, text="DASHBOARD", bg=BG_PANEL, fg=ACCENT_CYAN, font=("Segoe UI", 18, "bold")).pack(pady=20, anchor="w", padx=20)
        tk.Label(self.sidebar, text="Pandas DataFrame 2.0", bg=BG_PANEL, fg="#64748b", font=("Segoe UI", 9)).pack(anchor="w", padx=20, pady=(0, 20))
        
        # Botões de Ação Analítica
        btn_kw = {"bg": ACCENT_BLUE, "fg": BG_MAIN, "font": ("Segoe UI", 11, "bold"), "bd": 0, "pady": 10, "cursor": "hand2"}
        
        tk.Button(self.sidebar, text="📥 IMPORTAR .CSV", command=self._import_csv, **btn_kw).pack(fill=tk.X, padx=20, pady=5)
        tk.Button(self.sidebar, text="🧹 LIMPAR NULOS (DropNa)", command=self._clean_data, bg="#475569", fg=TXT_WHITE, font=("Segoe UI", 10, "bold"), bd=0, pady=8).pack(fill=tk.X, padx=20, pady=5)
        tk.Button(self.sidebar, text="📈 GERAR ESTATÍSTICAS", command=self._generate_stats, bg="#475569", fg=TXT_WHITE, font=("Segoe UI", 10, "bold"), bd=0, pady=8).pack(fill=tk.X, padx=20, pady=5)
        tk.Button(self.sidebar, text="📊 PLOTAR GRÁFICO (Top 5)", command=self._plot_graph, bg="#475569", fg=TXT_WHITE, font=("Segoe UI", 10, "bold"), bd=0, pady=8).pack(fill=tk.X, padx=20, pady=5)
        
        self.lbl_rows = tk.Label(self.sidebar, text="Linhas: 0", bg=BG_PANEL, fg="#94a3b8", font=("Segoe UI", 10))
        self.lbl_rows.pack(side=tk.BOTTOM, pady=20)

        # ==== AREA PRINCIPAL (Tabela e Gráficos) ====
        self.main_area = tk.Frame(self, bg=BG_MAIN)
        self.main_area.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Tabela Visível do DataFrame (Spreadsheet)
        self.tree_frame = tk.Frame(self.main_area, bg=BG_PANEL)
        self.tree_frame.pack(fill=tk.BOTH, expand=True)
        
        self.tree = ttk.Treeview(self.tree_frame, show="headings")
        
        # Scrollbars na Tabela
        scroll_y = ttk.Scrollbar(self.tree_frame, orient=tk.VERTICAL, command=self.tree.yview)
        scroll_x = ttk.Scrollbar(self.tree_frame, orient=tk.HORIZONTAL, command=self.tree.xview)
        self.tree.configure(yscrollcommand=scroll_y.set, xscrollcommand=scroll_x.set)
        
        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scroll_y.pack(side=tk.RIGHT, fill=tk.Y)
        scroll_x.pack(side=tk.BOTTOM, fill=tk.X)
        
        # Frame Secundário para abrigar Janela de Estatistica ou Grafico Embutido
        self.canvas_frame = tk.Frame(self.main_area, bg=BG_MAIN, height=200)
        self.canvas_frame.pack(fill=tk.X, pady=(20, 0))


    # ==========================================
    # LÓGICA DE DADOS (PANDAS ENGINEER)
    # ==========================================

    def _import_csv(self):
        file_path = filedialog.askopenfilename(filetypes=[("Arquivos CSV", "*.csv"), ("Todos", "*.*")])
        if not file_path: return
        
        try:
            # Pandas Import Engine
            self.df = pd.read_csv(file_path)
            self._update_treeview()
            self.lbl_rows.config(text=f"Linhas: {len(self.df)} | Colunas: {len(self.df.columns)}")
            
            # Limpa Graficos velhos
            for widget in self.canvas_frame.winfo_children(): widget.destroy()
                
        except Exception as e:
            messagebox.showerror("Erro de Leitura", f"Falha ao ler o formato no Pandas.\n{e}")

    def _clean_data(self):
        if self.df is None: return
        old_sz = len(self.df)
        self.df = self.df.dropna()
        new_sz = len(self.df)
        
        self._update_treeview()
        self.lbl_rows.config(text=f"Linhas: {new_sz} | Colunas: {len(self.df.columns)}")
        messagebox.showinfo("Limpeza O.S", f"Limpeza Automática Concluída!\nForam removidos {old_sz - new_sz} registros nulos/vazios da tabela.")

    def _generate_stats(self):
        # Puxa o Mediana, Moda e Mean nativos do dataframe limitando as numericas
        if self.df is None: return
        
        numeric_df = self.df.select_dtypes(include=['number'])
        if numeric_df.empty:
            messagebox.showwarning("Aviso Mocker", "Sua Tabela não possui colunas numéricas (inteiros/float) para calcular estatísticas.")
            return
            
        # O "describe" e funcoes puras do Pandas geram a mágica na hora
        stats_text = f"📊 INSIGHTS ESTATÍSTICOS (Total: {len(numeric_df)} Linhas)\n" + ("-"*50) + "\n"
        
        for col in numeric_df.columns:
            stats_text += f"\n> Coluna Numérica: '{col}'\n"
            stats_text += f"  Média    : {numeric_df[col].mean():.2f}\n"
            stats_text += f"  Mediana  : {numeric_df[col].median():.2f}\n"
            stats_text += f"  D.Padrão : {numeric_df[col].std():.2f}\n"
            
        messagebox.showinfo("Algoritmo Finalizado (Pandas Engine)", stats_text)

    def _plot_graph(self):
        if self.df is None: return
        
        numeric_cols = self.df.select_dtypes(include=['number']).columns
        if len(numeric_cols) == 0:
            messagebox.showerror("Erro Gráfico", "Sem colunas numéricas no CSV para plotar em Barra.")
            return
        
        # Pega a Primeira Coluna de String pra ser o Eixo X Categoria (Se tiver)
        cat_cols = self.df.select_dtypes(include=['object']).columns
        x_col = cat_cols[0] if len(cat_cols) > 0 else self.df.index
        y_col = numeric_cols[0] # Pega o primeiro numero pro eixo Y

        # Preparar janela de Plot no Tkinter (Frame de Cima)
        for widget in self.canvas_frame.winfo_children(): widget.destroy()

        # Renderização Matplotlib. Real Data Science.
        fig, ax = plt.subplots(figsize=(6, 3), facecolor=BG_MAIN)
        ax.set_facecolor(BG_PANEL)
        
        subset = self.df.head(10) # Printa só o Top 10 pra ficar lindo na tela
        
        ax.bar(subset[x_col], subset[y_col], color=ACCENT_BLUE)
        
        ax.tick_params(colors=TXT_WHITE)
        ax.spines['bottom'].set_color(TXT_WHITE)
        ax.spines['left'].set_color(TXT_WHITE)
        ax.set_title(f"TOP 10: {y_col} por {x_col}", color=ACCENT_CYAN, pad=10)
        fig.autofmt_xdate(rotation=45) # Inclina letras embaixo pra caber legal
        
        canvas = FigureCanvasTkAgg(fig, master=self.canvas_frame)
        canvas.draw()
        canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)


    def _update_treeview(self):
        # Formata o Treeview de DataScience apagando e recriando linhas
        self.tree.delete(*self.tree.get_children())
        
        cols = list(self.df.columns)
        self.tree["columns"] = cols
        
        for c in cols:
            self.tree.heading(c, text=c)
            self.tree.column(c, width=120, anchor="center")
            
        # Limita a mostrar só as 200 primeiras linhas pra não congelar o GUI Tkinter
        for index, row in self.df.head(200).iterrows():
            self.tree.insert("", tk.END, values=list(row))

if __name__ == "__main__":
    app = DataAnalyzerApp()
    app.mainloop()
