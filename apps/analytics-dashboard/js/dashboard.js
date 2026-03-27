// GLOBAL CHART CONFIGURATIONS
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#94A3B8'; // cyber-muted
Chart.defaults.scale.grid.color = 'rgba(51, 65, 85, 0.5)'; // cyber-border
Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)'; // cyber-bg
Chart.defaults.plugins.tooltip.titleColor = '#F8FAFC';
Chart.defaults.plugins.tooltip.bodyColor = '#8B5CF6'; // neon accent
Chart.defaults.plugins.tooltip.borderColor = 'rgba(139, 92, 246, 0.5)';
Chart.defaults.plugins.tooltip.borderWidth = 1;

const MOCK_FALLBACK = {
    '7d': {
        kpis: { revenue: 14500, users: 450, conversion: 3.2, growth: 12 },
        revenueChart: { labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'], data: [1200, 1900, 1500, 2100, 2400, 3100, 2300] },
        trafficChart: { labels: ['Orgânico', 'Pago', 'Direto', 'Social'], data: [35, 45, 10, 10] },
        regionChart: { labels: ['América do Norte', 'América do Sul', 'Europa', 'Ásia'], data: [40, 30, 20, 10] },
        sourcesChart: { labels: ['Google', 'Facebook', 'LinkedIn', 'Twitter', 'Outros'], data: [45, 25, 15, 10, 5] }
    },
    '30d': {
        kpis: { revenue: 58400, users: 1850, conversion: 2.8, growth: 5.4 },
        revenueChart: { labels: ['Sema 1', 'Sema 2', 'Sema 3', 'Sema 4'], data: [12400, 15200, 14800, 16000] },
        trafficChart: { labels: ['Orgânico', 'Pago', 'Direto', 'Social'], data: [40, 40, 15, 5] },
        regionChart: { labels: ['América do Norte', 'América do Sul', 'Europa', 'Ásia'], data: [42, 28, 22, 8] },
        sourcesChart: { labels: ['Google', 'Facebook', 'LinkedIn', 'Twitter', 'Outros'], data: [50, 20, 15, 10, 5] }
    },
    '1y': {
        kpis: { revenue: 642000, users: 24500, conversion: 3.4, growth: 124 },
        revenueChart: { labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'], data: [45000, 48000, 51000, 49000, 55000, 58000, 62000, 60000, 65000, 68000, 75000, 81000] },
        trafficChart: { labels: ['Orgânico', 'Pago', 'Direto', 'Social'], data: [55, 30, 10, 5] },
        regionChart: { labels: ['América do Norte', 'América do Sul', 'Europa', 'Ásia'], data: [45, 25, 20, 10] },
        sourcesChart: { labels: ['Google', 'Facebook', 'LinkedIn', 'Twitter', 'Outros'], data: [60, 15, 15, 5, 5] }
    }
};

class DashboardController {
    constructor() {
        this.charts = {};
        this.currentPeriod = '30d';
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.currentData = null; // para usar na exportação

        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadData(this.currentPeriod);
        this.createCharts();
    }

    bindEvents() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                // Atualizar botões visuais
                filterBtns.forEach(b => {
                    b.classList.remove('bg-cyber-border', 'text-white', 'shadow');
                    b.classList.add('text-cyber-muted');
                });
                
                const clickedBtn = e.target;
                clickedBtn.classList.remove('text-cyber-muted');
                clickedBtn.classList.add('bg-cyber-border', 'text-white', 'shadow');

                // Carregar Novos Dados
                this.currentPeriod = clickedBtn.getAttribute('data-period');
                await this.loadData(this.currentPeriod);
                this.updateCharts();
            });
        });

        // Botão Export CSV Falso
        document.getElementById('export-csv').addEventListener('click', () => {
             this.exportCSV();
        });
    }

    async loadData(period) {
        this.loadingOverlay.classList.remove('hidden');
        this.loadingOverlay.classList.remove('opacity-0');
        
        try {
            // Tentativa de Requisição para Backup Real NodeJS Express
            const res = await fetch(`http://localhost:3000/api/dashboard?period=${period}`);
            if(!res.ok) throw new Error("Sem conxão com Node");
            const payload = await res.json();
            this.currentData = payload.metrics;
        } catch(err) {
            // Em Portifolios Estaticos a API falhará (CORS ou off). Usamos o Mock Mágico da Tabela Local!
            console.log("Mocking Local Data (Serverless Portfolio Mode).");
            await new Promise(r => setTimeout(r, 600)); // Simula Delay Assícrono
            this.currentData = MOCK_FALLBACK[period];
        }

        // Preenche Numeros Simples
        this.updateKPIs();
        
        this.loadingOverlay.classList.add('opacity-0');
        setTimeout(() => this.loadingOverlay.classList.add('hidden'), 350);
    }

    updateKPIs() {
        const kpis = this.currentData.kpis;
        document.getElementById('kpi-revenue').textContent = `R$ ${(kpis.revenue).toLocaleString()}`;
        document.getElementById('kpi-users').textContent = kpis.users.toLocaleString();
        document.getElementById('kpi-conversion').textContent = `${kpis.conversion.toFixed(1)}%`;
        
        const growthEl = document.getElementById('kpi-growth');
        growthEl.innerHTML = `<i data-lucide="trending-up" class="w-3 h-3 mr-1"></i>+${kpis.growth}%`;
        lucide.createIcons(); // Reactiva ícones injetados
    }

    createCharts() {
        // --- CHART 1: Receita Evolutiva (Line) ---
        const ctxRev = document.getElementById('revenueChart').getContext('2d');
        const gradientRev = ctxRev.createLinearGradient(0, 0, 0, 300);
        gradientRev.addColorStop(0, 'rgba(59, 130, 246, 0.4)'); // Azul
        gradientRev.addColorStop(1, 'rgba(59, 130, 246, 0.0)'); 

        this.charts.revenue = new Chart(ctxRev, {
            type: 'line',
            data: {
                labels: this.currentData.revenueChart.labels,
                datasets: [{
                    label: 'Receita Bruta (R$)',
                    data: this.currentData.revenueChart.data,
                    borderColor: '#3B82F6', // cyber-primary
                    backgroundColor: gradientRev,
                    borderWidth: 3,
                    pointBackgroundColor: '#0F172A',
                    pointBorderColor: '#3B82F6',
                    pointHoverBackgroundColor: '#8B5CF6',
                    pointHoverBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });

        // --- CHART 2: Doughnut (Região) ---
        const ctxReg = document.getElementById('regionChart').getContext('2d');
        this.charts.region = new Chart(ctxReg, {
            type: 'doughnut',
            data: {
                labels: this.currentData.regionChart.labels,
                datasets: [{
                    data: this.currentData.regionChart.data,
                    backgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F43F5E'],
                    borderColor: '#1E293B',
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                cutout: '70%',
                plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } } }
            }
        });

        // --- CHART 3: Bar (Tipos de Tráfego) ---
        const ctxTraf = document.getElementById('trafficChart').getContext('2d');
        this.charts.traffic = new Chart(ctxTraf, {
            type: 'bar',
            data: {
                labels: this.currentData.trafficChart.labels,
                datasets: [{
                    label: 'Visitantes (%)',
                    data: this.currentData.trafficChart.data,
                    backgroundColor: '#8B5CF6', // neon purple
                    borderRadius: 6,
                    barThickness: 24,
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: {display:false} } }
        });

        // --- CHART 4: Polar Area (Origens) ---
        const ctxSour = document.getElementById('sourcesChart').getContext('2d');
        this.charts.sources = new Chart(ctxSour, {
            type: 'polarArea',
            data: {
                labels: this.currentData.sourcesChart.labels,
                datasets: [{
                    data: this.currentData.sourcesChart.data,
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)',  // Azul
                        'rgba(139, 92, 246, 0.7)',  // Roxo
                        'rgba(16, 185, 129, 0.7)',  // Esmeralda
                        'rgba(244, 63, 94, 0.7)',   // Rosa
                        'rgba(245, 158, 11, 0.7)'   // Laranja
                    ],
                    borderColor: '#1E293B',
                    borderWidth: 2
                }]
            },
            options: { 
                responsive: true, maintainAspectRatio: false,
                scales: { r: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { display: false } } },
                plugins: { legend: { position: 'right', labels: { boxWidth: 10 } } }
            }
        });
    }

    updateCharts() {
        const data = this.currentData;

        // Atualiza Line Chart
        this.charts.revenue.data.labels = data.revenueChart.labels;
        this.charts.revenue.data.datasets[0].data = data.revenueChart.data;
        this.charts.revenue.update();

        // Atualiza Doughnut
        this.charts.region.data.labels = data.regionChart.labels;
        this.charts.region.data.datasets[0].data = data.regionChart.data;
        this.charts.region.update();

        // Atualiza Bar
        this.charts.traffic.data.labels = data.trafficChart.labels;
        this.charts.traffic.data.datasets[0].data = data.trafficChart.data;
        this.charts.traffic.update();

        // Atualiza Polar
        this.charts.sources.data.labels = data.sourcesChart.labels;
        this.charts.sources.data.datasets[0].data = data.sourcesChart.data;
        this.charts.sources.update();
    }

    exportCSV() {
        const d = this.currentData.kpis;
        const csvContent = `Metrica,Valor
Receita Bruta (R$),${d.revenue}
Adocoes (Usuarios),${d.users}
Conversao (%),${d.conversion}
Crescimento Relativo (%),${d.growth}
Periodo Base,${this.currentPeriod}
Data Exportação,${new Date().toISOString()}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `nexus_report_${this.currentPeriod}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Inicializa o Painel quando DOM estiver montando
document.addEventListener('DOMContentLoaded', () => {
    window.appController = new DashboardController();
});
