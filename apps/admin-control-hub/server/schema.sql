-- ========================================================
-- ADMIN CONTROL HUB - POSTGRESQL SCHEMA ERP/CRM SYSTEM  
-- Arquitetura de Tabelas Corporativas Rigorosas          
-- ========================================================

-- Define o Formato de Enums de Sistema (Trava a entrada de dados incorreta no SQL)
CREATE TYPE client_status AS ENUM ('Lead', 'Contato Feito', 'Em Negociação', 'Fechado', 'Perdido');
CREATE TYPE priority_level AS ENUM ('Baixa', 'Media', 'Alta', 'Urgente');

-- TABELA 1: VENDEDORES / USUARIOS ADMINISTRADORES (Acesso ao Painel)
CREATE TABLE crm_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'Sales_Rep',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- TABELA 2: CLIENTES / LEADS (Base Principal)
CREATE TABLE crm_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(150),
    contact_email VARCHAR(150),
    phone_number VARCHAR(50),
    status client_status DEFAULT 'Lead',
    deal_value NUMERIC(15, 2) DEFAULT 0.00,
    
    -- O Relacionamento: Vinculando o Cliente a qual Vendedor lhe atende (FOREIGN KEY)
    assigned_to UUID REFERENCES crm_users(id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- TABELA 3: ATIVIDADES CROSS-TABLE (Ligações, Reuniões marcadas sobre o Cliente)
CREATE TABLE crm_activities (
    id SERIAL PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES crm_clients(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES crm_users(id) ON DELETE CASCADE,
    
    activity_type VARCHAR(100) NOT NULL, -- Ex: "Call", "Email", "Reunião Presencial"
    description TEXT,
    priority priority_level DEFAULT 'Media',
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXAÇÃO PARA PERFORMANCE OTIMIZADA DO DASHBOARD EM RELATÓRIOS (PostgreSQL Tunings)
CREATE INDEX idx_clients_status ON crm_clients(status);
CREATE INDEX idx_activities_duedate ON crm_activities(due_date);

-- ========================================================
-- ROTINA DE INSERÇÃO FAKE DE EXEMPLO (SEEDING) 
-- ========================================================
-- INSERT INTO crm_users (id, full_name, email, password_hash) VALUES 
-- ('9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c', 'Administrador Chefe', 'admin@crmhub.corp', 'bcrypt_hash_here');

-- INSERT INTO crm_clients (company_name, status, deal_value, assigned_to) VALUES 
-- ('Tech Solutions SA', 'Fechado', 45000.00, '9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c'),
-- ('Padaria Santo Pão', 'Lead', 1200.00, '9f8e7d6c-5b4a-3f2e-1d0c-9b8a7f6e5d4c');
