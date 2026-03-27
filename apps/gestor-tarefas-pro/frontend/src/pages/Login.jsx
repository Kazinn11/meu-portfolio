import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Github } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            padding: '2rem'
        }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-morphism"
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    padding: '3rem',
                    borderRadius: '24px',
                    textAlign: 'center',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                }}
            >
                <header style={{ marginBottom: '2.5rem' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>TaskPro</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {isLogin ? 'Bem-vindo de volta! Faça login para continuar.' : 'Crie sua conta e comece a se organizar hoje!'}
                    </p>
                </header>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <input 
                                type="text" 
                                placeholder="Nome Completo" 
                                style={{
                                    width: '100%',
                                    padding: '1rem 3rem',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <LogIn size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <input 
                            type="email" 
                            placeholder="Seu E-mail" 
                            style={{
                                width: '100%',
                                padding: '1rem 3rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input 
                            type="password" 
                            placeholder="Sua Senha" 
                            style={{
                                width: '100%',
                                padding: '1rem 3rem',
                                borderRadius: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    </div>

                    <button className="bg-gradient pulse" style={{
                        padding: '1rem',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        marginTop: '1rem',
                        transition: 'var(--transition)'
                    }}>
                        {isLogin ? 'Entrar Agora' : 'Criar Conta'}
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ou continue com</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                    </div>

                    <button style={{
                        padding: '0.8rem',
                        borderRadius: '12px',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}>
                        <Github size={20} /> Github
                    </button>
                </form>

                <p style={{ marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {isLogin ? 'Não tem uma conta?' : 'Já possui uma conta?'}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, marginLeft: '0.5rem' }}
                    >
                        {isLogin ? 'Cadastre-se' : 'Faça Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
