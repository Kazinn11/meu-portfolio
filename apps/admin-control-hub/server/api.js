const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// Inicialização ERP Backend App
const app = express();
app.use(express.json());
app.use(cors());

// CONEXÃO OFICIAL COM O POSTGRESQL (Pool Management Pattern)
// Em produção, isso lê strings de .env (ex: postgres://admin:passwd@aws-rds:5432/crmdb)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    max: 20 // Otimização para Multi-Vendedores acessando juntos
});

// Middleware Teste Conexao Database (Somente para checagem rápida)
app.get('/api/health', async (req, res) => {
    try {
        const testRes = await pool.query('SELECT NOW()');
        res.status(200).json({ status: "Operacional", time: testRes.rows[0].now });
    } catch(err) {
        res.status(500).json({ status: "Falha Conexão DB", err: err.message });
    }
});


// -----------------------------------------------------
// --- ROTA: DASHBOARD ANALYTICS (Complex SQL Joints) --
// -----------------------------------------------------

app.get('/api/dashboard/metrics', async (req, res) => {
    try {
        // Agregação Matemática pura feita pelo motor forte do PostgreSQL (Acelera Front-End)
        const metricsQ = await pool.query(`
            SELECT 
                COUNT(*) AS total_clients,
                SUM(deal_value) FILTER (WHERE status = 'Fechado') AS total_revenue,
                COUNT(id) FILTER (WHERE status = 'Lead') AS pending_leads
            FROM crm_clients
        `);
        
        const recentActivities = await pool.query(`
            SELECT a.activity_type, a.description, c.company_name 
            FROM crm_activities a
            JOIN crm_clients c ON a.client_id = c.id
            ORDER BY a.created_at DESC LIMIT 5
        `);

        res.json({
            kpi: metricsQ.rows[0],
            activities: recentActivities.rows
        });
        
    } catch (e) {
        res.status(500).json({ code: 'DB_ERROR' });
    }
});

// -----------------------------------------------------
// --- ROTA: CLIENTES (CRUD Básico do Funil de Vendas)-
// -----------------------------------------------------

/** [GET] Listar Todos Clientes do Vendedor Logado */
app.get('/api/clients', async (req, res) => {
    // Exemplo Simulado de Pegar ID do JWT req.user.id
    const repId = '9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c'; 

    try {
        const query = await pool.query(`
            SELECT id, company_name, contact_email, status, deal_value 
            FROM crm_clients 
            WHERE assigned_to = $1 
            ORDER BY created_at DESC
        `, [repId]);

        res.status(200).json(query.rows);
    } catch(e) { res.status(500).send("Query Fails") }
});

/** [POST] Adicionar Lead no Banco */
app.post('/api/clients', async (req, res) => {
    const { companyName, email, status, dealAmount } = req.body;
    const repId = '9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c';

    try {
         // PREPARED STATEMENTS contra Injeção SQL
         const { rows } = await pool.query(`
            INSERT INTO crm_clients (company_name, contact_email, status, deal_value, assigned_to)
            VALUES ($1, $2, $3, $4, $5) RETURNING id, company_name
         `, [companyName, email, status, dealAmount, repId]);

         res.status(201).json(rows[0]);
    } catch(e) { res.status(500).json({ error: e.message }) }
});


// Initializing the REST Controller Layer Server
// app.listen(7500, () => console.log('✅ Admin CRM Database Middleware Online.')); 
module.exports = app;
