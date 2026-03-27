import React from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
    >
      <header>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Bem-vindo de volta, <span className="text-gradient">Marino</span>!</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Aqui está o resumo da sua produtividade hoje.</p>
      </header>

      {/* Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        <StatCard icon={<CheckCircle2 color="#00ffcc" />} title="Concluídas" value="12" color="#00ffcc" />
        <StatCard icon={<Clock color="#00d2ff" />} title="Pendentes" value="05" color="#00d2ff" />
        <StatCard icon={<AlertCircle color="#ff4d4d" />} title="Atrasadas" value="02" color="#ff4d4d" />
        <StatCard icon={<TrendingUp color="#9d50bb" />} title="Produtividade" value="85%" color="#9d50bb" />
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: '2rem'
      }}>
        {/* Recent Tasks */}
        <section className="glass-morphism" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Tarefas Recentes
            <button style={{ fontSize: '0.85rem', color: 'var(--primary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Ver todas</button>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TaskItem title="Finalizar Backend API" category="Trabalho" priority="Alta" date="Hoje, 18:00" />
            <TaskItem title="Reunião de Alinhamento" category="Trabalho" priority="Média" date="Amanhã, 10:00" />
            <TaskItem title="Academia - Treino A" category="Pessoal" priority="Baixa" date="Hoje, 20:00" />
          </div>
        </section>

        {/* Quick Actions / Chart Placeholder */}
        <section className="glass-morphism" style={{ padding: '2rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3>Ações Rápidas</h3>
          <button className="bg-gradient pulse" style={{
            padding: '1rem',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            + Nova Tarefa
          </button>
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Sua Meta Diária</h4>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '70%', height: '100%', background: 'var(--primary)' }}></div>
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', textAlign: 'right' }}>70% Concluído</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className="glass-morphism" style={{ 
    padding: '1.5rem', 
    borderRadius: '16px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1.2rem',
    borderLeft: `4px solid ${color}`
  }}>
    <div style={{ padding: '0.8rem', background: `${color}15`, borderRadius: '12px' }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</h3>
    </div>
  </div>
);

const TaskItem = ({ title, category, priority, date }) => {
  const priorityColor = priority === 'Alta' ? 'var(--priority-high)' : priority === 'Média' ? 'var(--priority-medium)' : 'var(--priority-low)';
  
  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(255,255,255,0.02)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: '1px solid var(--glass-border)'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
        <div>
          <h4 style={{ fontSize: '0.95rem' }}>{title}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{category} • {date}</span>
        </div>
      </div>
      <span style={{ 
        fontSize: '0.7rem', 
        padding: '0.2rem 0.6rem', 
        borderRadius: '4px', 
        background: `${priorityColor}15`, 
        color: priorityColor,
        fontWeight: 600
      }}>
        {priority}
      </span>
    </div>
  );
};

export default Dashboard;
