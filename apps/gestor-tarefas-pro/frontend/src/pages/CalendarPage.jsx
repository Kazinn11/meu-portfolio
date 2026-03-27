import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarPage = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    // Simulação de dias do mês de Março 2026
    const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
    const startDay = 0; // Março de 2026 começa no Domingo
    
    const tasksInCalendar = {
        15: [{ title: 'Reunião Squad', color: 'var(--primary)' }],
        18: [{ title: 'Entrega Projeto', color: 'var(--secondary)' }],
        25: [{ title: 'Workshop React', color: 'var(--accent)' }],
        27: [{ title: 'Deploy API', color: 'var(--priority-high)' }]
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Calendário Interativo</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Visualize seu cronograma e prazos importantes.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="glass-morphism" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '1.5rem', 
                        padding: '0.6rem 1.2rem', 
                        borderRadius: '12px' 
                    }}>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}><ChevronLeft size={20} /></button>
                        <h4 style={{ minWidth: '150px', textAlign: 'center', fontWeight: 600 }}>Março 2026</h4>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}><ChevronRight size={20} /></button>
                    </div>
                    <button className="bg-gradient" style={{ 
                        padding: '0.6rem 1rem', 
                        border: 'none', 
                        borderRadius: '10px', 
                        color: 'white', 
                        cursor: 'pointer' 
                    }}>
                        <Plus size={20} />
                    </button>
                </div>
            </header>

            <div className="glass-morphism" style={{ 
                borderRadius: '24px', 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                flex: 1
            }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(7, 1fr)', 
                    textAlign: 'center', 
                    borderBottom: '1px solid var(--glass-border)', 
                    paddingBottom: '1rem' 
                }}>
                    {days.map(day => (
                        <span key={day} style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>{day}</span>
                    ))}
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(7, 1fr)', 
                    gridAutoRows: 'minmax(120px, 1fr)', 
                    gap: '1px', 
                    background: 'var(--glass-border)' 
                }}>
                    {calendarDays.map((day, idx) => (
                        <div key={idx} style={{ 
                            background: 'var(--bg-dark)', 
                            padding: '0.8rem', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: '0.5rem',
                            position: 'relative'
                        }}>
                            <span style={{ 
                                fontWeight: 700, 
                                fontSize: '1rem', 
                                color: day === 26 ? 'var(--primary)' : 'inherit',
                                display: 'inline-block',
                                width: '28px',
                                height: '28px',
                                textAlign: 'center',
                                lineHeight: '28px',
                                background: day === 26 ? 'rgba(0, 210, 255, 0.1)' : 'transparent',
                                borderRadius: '50%'
                            }}>
                                {day}
                            </span>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {tasksInCalendar[day]?.map((task, tIdx) => (
                                    <div key={tIdx} style={{ 
                                        fontSize: '0.7rem', 
                                        padding: '4px 8px', 
                                        background: `${task.color}15`, 
                                        color: task.color, 
                                        borderLeft: `3px solid ${task.color}`,
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default CalendarPage;
