const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// --- DATABASE SIMULADO (MOCK PARA O BACKEND REAL) ---
// Métricas SaaS: 7 Dias, 30 Dias, 1 Ano
const DATABASE = {
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

// --- ROTAS DA API ---

// Endpoint de Saúde
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint Principal do Dashboard
// Query Parmas aceitos: ?period=7d | 30d | 1y
app.get('/api/dashboard', (req, res) => {
    const period = req.query.period || '30d';
    
    // Fallback de Segurança
    if (!DATABASE[period]) {
        return res.status(400).json({ error: 'Período inválido. Use 7d, 30d ou 1y.' });
    }

    const data = DATABASE[period];

    // Simular delay na rede
    setTimeout(() => {
        res.json({
            success: true,
            period: period,
            metrics: data,
            generatedAt: new Date().toISOString()
        });
    }, 500); 
});

// Exportador CSV Falso via API
app.get('/api/export', (req, res) => {
    const period = req.query.period || '30d';
    const data = DATABASE[period];
    
    let csv = `Metrica,Valor\nReceita,${data.kpis.revenue}\nUsuarios,${data.kpis.users}\nConversao,${data.kpis.conversion}%\nCrescimento,${data.kpis.growth}%`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"analytics_report.csv\"');
    
    res.send(csv);
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 [Analytics Dashboard] Servidor backend rodando na porta ${PORT}`);
});
