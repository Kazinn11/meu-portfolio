import React, { useState } from 'react';
import { Filter, Search, Plus, MoreVertical, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const [filter, setFilter] = useState('Todas');
  const [search, setSearch] = useState('');

  const tasks = [
    { title: 'Refatorar Middlewares', category: 'Trabalho', priority: 'Alta', status: 'Pendente', date: '27 Mar' },
    { title: 'Estudar Docker Desktop', category: 'Estudos', priority: 'Média', status: 'Pendente', date: '28 Mar' },
    { title: 'Pagar conta de Internet', category: 'Pessoal', priority: 'Alta', status: 'Concluída', date: '26 Mar' },
    { title: 'Criar Documentação API', category: 'Trabalho', priority: 'Baixa', status: 'Pendente', date: '30 Mar' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Minhas Tarefas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gerencie e acompanhe seus objetivos diários.</p>
        </div>
        <button className="bg-gradient pulse" style={{
          padding: '0.8rem 1.5rem',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Plus size={20} /> Nova Tarefa
        </button>
      </header>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Todas', 'Trabalho', 'Pessoal', 'Estudos'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="glass-morphism"
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '8px',
                color: filter === cat ? 'var(--primary)' : 'var(--text-secondary)',
                borderColor: filter === cat ? 'var(--primary)' : 'var(--glass-border)',
                background: filter === cat ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem',
          background: 'rgba(255,255,255,0.05)',
          padding: '0.5rem 1rem',
          borderRadius: '10px',
          border: '1px solid var(--glass-border)',
          width: '300px'
        }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Buscar tarefa..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              outline: 'none',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Tasks Table/List */}
      <div className="glass-morphism" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tarefa</th>
              <th style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Categoria</th>
              <th style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Prioridade</th>
              <th style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Data Limite</th>
              <th style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ borderBottom: '1px solid var(--glass-border)', transition: 'var(--transition)' }}
                  className="task-row"
                >
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <CheckCircle size={20} color={task.status === 'Concluída' ? 'var(--accent)' : 'var(--text-secondary)'} style={{ cursor: 'pointer' }} />
                      <span style={{ textDecoration: task.status === 'Concluída' ? 'line-through' : 'none', opacity: task.status === 'Concluída' ? 0.6 : 1 }}>
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)' }}>{task.category}</td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <span style={{
                      padding: '0.3rem 0.8rem',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      background: task.priority === 'Alta' ? 'rgba(255, 77, 77, 0.15)' : task.priority === 'Média' ? 'rgba(255, 174, 66, 0.15)' : 'rgba(0, 255, 204, 0.15)',
                      color: task.priority === 'Alta' ? 'var(--priority-high)' : task.priority === 'Média' ? 'var(--priority-medium)' : 'var(--priority-low)'
                    }}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)' }}>{task.date}</td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <span style={{ color: task.status === 'Concluída' ? 'var(--accent)' : 'var(--primary)', fontWeight: 600 }}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Trash2 size={18} /></button>
                      <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><MoreVertical size={18} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
