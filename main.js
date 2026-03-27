document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // 2. Typed.js for Hero Phrase
    new Typed('#typed-text', {
        strings: [
            'Desenvolvedor Web criando Sistemas Inteligentes.',
            'Soluções Modernas de Alto Desempenho.',
            'Automação de Processos com Tecnologia de Ponta.',
            'Transformando seu Código em Performance Brutal.'
        ],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 2000,
        loop: true
    });

    // 3. TSParticles Background
    tsParticles.load("tsparticles", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00d2ff" },
            shape: { type: "circle" },
            opacity: { value: 0.2, random: false },
            size: { value: 3, random: true },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#9d50bb",
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });

    // 4. Cursor Glow Effect
    const cursor = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 5. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 6. Inject Skills
    const skills = [
        { name: 'JavaScript (ES6+)', level: 95, desc: 'Lógica avançada e manipulação de DOM.', icon: 'code' },
        { name: 'TypeScript', level: 90, desc: 'Tipagem forte para escalabilidade.', icon: 'shield' },
        { name: 'React.js', level: 85, desc: 'Interfaces reativas e componentização.', icon: 'layers' },
        { name: 'Node.js', level: 88, desc: 'Backend robusto e escalável.', icon: 'server' },
        { name: 'Python', level: 82, desc: 'Automação e processamento de dados.', icon: 'terminal' },
        { name: 'Docker', level: 75, desc: 'Containerização de ambientes.', icon: 'box' },
        { name: 'Git & GitHub', level: 92, desc: 'Controle de versão colaborativo.', icon: 'github' },
        { name: 'APIs REST', level: 90, desc: 'Integrações e serviços modernos.', icon: 'webhook' },
        { name: 'SQL & NoSQL', level: 85, desc: 'Modelagem de dados inteligente.', icon: 'database' },
        { name: 'UI/UX Design', level: 80, desc: 'Design centrado no usuário.', icon: 'layout' }
    ];

    const skillsGrid = document.getElementById('skills-grid');
    skills.forEach(skill => {
        const div = document.createElement('div');
        div.className = 'skill-card glass';
        div.innerHTML = `
            <div class="skill-header">
                <div class="skill-icon"><i data-lucide="${skill.icon}"></i></div>
                <h4 class="skill-name">${skill.name}</h4>
            </div>
            <p style="font-size: 0.85rem; color: #a0a0a0; margin-bottom: 1rem;">${skill.desc}</p>
            <div class="skill-progress-container">
                <div class="skill-progress-bar" data-level="${skill.level}"></div>
            </div>
            <div class="skill-level">
                <span>Domínio</span>
                <span>${skill.level}%</span>
            </div>
        `;
        skillsGrid.appendChild(div);
    });

    // Trigger skills progress animation on scroll
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.skill-progress-bar').forEach(bar => {
        gsap.to(bar, {
            width: bar.getAttribute('data-level') + '%',
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: bar,
                start: "top 90%",
            }
        });
    });

    // 7. Inject Projects
    const projects = [
        // Web Projects
        { title: 'Gestor de Tarefas Pro', category: 'web', img: 'TaskPro.png', demoUrl: 'apps/gestor-tarefas-pro/demo.html', desc: 'Gerenciamento avançado com calendário interativo.', tags: ['React', 'Node', 'SQL'] },
        { title: 'Nexus E-commerce', category: 'web', img: 'Nexus.png', demoUrl: 'apps/nexus-ecommerce/index.html', desc: 'Plataforma completa com checkout modernizado.', tags: ['JavaScript', 'API', 'Tailwind'] },
        { title: 'Sistema de Agendamento', category: 'web', img: 'Agendamento.png', demoUrl: 'apps/sistema-agendamento/index.html', desc: 'Reserva online em tempo real com notificações.', tags: ['React', 'Firebase'] },
        { title: 'Analytics Dashboard', category: 'web', img: 'Analitico.png', demoUrl: 'apps/analytics-dashboard/index.html', desc: 'Gráficos dinâmicos para análise de dados brutos.', tags: ['Chart.js', 'Node', 'Express'] },
        { title: 'Paycheck Generator', category: 'web', img: 'PayCheck.png', demoUrl: 'apps/paycheck-generator/index.html', desc: 'Geração automática de contracheques em PDF.', tags: ['Vanilla JS', 'PDF-lib'] },
        { title: 'Conversion Landing Page', category: 'web', img: 'Landing page.png', demoUrl: 'apps/conversion-landing/index.html', desc: 'Focada em SEO e alta taxa de conversão.', tags: ['HTML5', 'CSS3', 'GSAP'] },
        { title: 'Real-time Monitoring', category: 'web', img: 'Real time.png', demoUrl: 'apps/realtime-monitoring/index.html', desc: 'Monitoramento de sistemas via WebSockets.', tags: ['Socket.io', 'Node'] },
        { title: 'Global Support Chat', category: 'web', img: 'Hub suport.png', demoUrl: 'apps/global-support-chat/index.html', desc: 'Chat rápido estilo suporte técnico profissional.', tags: ['Node', 'WebSocket'] },
        { title: 'Idea Hub', category: 'web', img: 'Ideal hub.png', demoUrl: 'apps/idea-hub/index.html', desc: 'Portal colaborativo para negócios locais.', tags: ['React', 'MongoDB'] },
        { title: 'Admin Control Hub', category: 'web', img: 'admin hub.png', demoUrl: 'apps/admin-control-hub/index.html', desc: 'Sistema administrativo completo (CRM).', tags: ['React', 'PostgreSQL'] },
        
        // Software Projects
        { title: 'PC Gamer Optimizer', category: 'software', img: 'software.png', demoUrl: 'apps/pc-gamer-optimizer/index.html', desc: 'Interface gamer para limpeza e otimização de cache.', tags: ['Python', 'Tkinter'] },
        { title: 'Auto Post-Format', category: 'software', img: 'software.png', demoUrl: 'apps/auto-post-format/index.html', desc: 'Automação para instalar apps após formatar PC.', tags: ['Python', 'PowerShell'] },
        { title: 'Threat Monitor', category: 'software', img: 'software.png', demoUrl: 'apps/threat-monitor/index.html', desc: 'Verificador de integridade e segurança em tempo real.', tags: ['Python', 'Security'] },
        { title: 'AutoBot WhatsApp', category: 'software', img: 'software.png', demoUrl: 'apps/autobot-whatsapp/index.html', desc: 'Bot inteligente para atendimento Automatizado.', tags: ['Node', 'Baileys'] },
        { title: 'Data Analyzer Tool', category: 'software', img: 'software.png', demoUrl: 'apps/data-analyzer-tool/index.html', desc: 'Software desktop para análise estatística.', tags: ['Python', 'Pandas'] }
    ];

    const projectsGrid = document.getElementById('projects-grid');
    projects.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = `project-card glass animate-up ${proj.category}`;
        card.innerHTML = `
            <div class="project-img">
                <img src="assets/${proj.img}" alt="${proj.title}">
                <div class="project-overlay"></div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${proj.title}</h3>
                <p style="font-size: 0.9rem; color: #a0a0a0; margin-bottom: 1rem;">${proj.desc}</p>
                <div class="project-tags">
                    ${proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <a href="${proj.demoUrl}" class="btn btn-primary small demo-btn">Demo</a>
                    <a href="#" class="btn btn-secondary small"><i data-lucide="github"></i> Código</a>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });

    // 8. Projects Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const cards = document.querySelectorAll('.project-card');
            
            cards.forEach(card => {
                if (filter === 'all' || card.classList.contains(filter)) {
                    gsap.to(card, { opacity: 1, scale: 1, duration: 0.5, display: 'block' });
                } else {
                    gsap.to(card, { opacity: 0, scale: 0.8, duration: 0.5, display: 'none' });
                }
            });
        });
    });

    // 9. GSAP Entry Animations
    gsap.utils.toArray('.section').forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            }
        });
    });

    // 10. Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.textContent;
        
        btn.disabled = true;
        btn.textContent = 'Enviando...';
        
        setTimeout(() => {
            btn.innerHTML = '<i data-lucide="check"></i> Mensagem Enviada!';
            lucide.createIcons(); // Re-initialize icons for the button
            btn.classList.add('success');
            contactForm.reset();
            
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = originalText;
                btn.classList.remove('success');
            }, 3000);
        }, 1500);
    });

    // 11. Project Modal
    const projectModal = document.getElementById('project-modal');
    const projectIframe = document.getElementById('project-iframe');
    const closeModalBtn = document.getElementById('close-modal');

    if (projectModal && projectIframe && closeModalBtn) {
        // Event delegation no grid de projetos
        document.getElementById('projects-grid').addEventListener('click', (e) => {
            const demoBtn = e.target.closest('.demo-btn');
            if (demoBtn) {
                const url = demoBtn.getAttribute('href');
                if (url && url !== '#') {
                    e.preventDefault();
                    
                    // Adicionar um pequeno atraso para UX (spinner)
                    projectIframe.classList.remove('loaded');
                    projectIframe.src = url;
                    
                    projectModal.classList.add('active');
                    document.body.classList.add('modal-open');
                    
                    projectIframe.onload = () => {
                        projectIframe.classList.add('loaded');
                    };
                }
            }
        });

        // Fechar Modal rotinas
        const closeModal = () => {
            projectModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            setTimeout(() => {
                projectIframe.src = '';
                projectIframe.classList.remove('loaded');
            }, 400); // Tempo igual a transição CSS
        };

        closeModalBtn.addEventListener('click', closeModal);
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Re-initialize Lucide icons for injected content
    lucide.createIcons();
});
