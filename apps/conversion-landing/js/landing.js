// Registrar Plug-in do ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // --- TEMPORIZADOR DE ESCASSEZ ---
    const startTimer = (durationMinutes) => {
        let timer = durationMinutes * 60;
        const minEl = document.getElementById('timer-m');
        const secEl = document.getElementById('timer-s');

        setInterval(() => {
            let m = parseInt(timer / 60, 10);
            let s = parseInt(timer % 60, 10);

            m = m < 10 ? "0" + m : m;
            s = s < 10 ? "0" + s : s;

            if(minEl) minEl.textContent = m;
            if(secEl) secEl.textContent = s;

            if(--timer < 0) {
                // Ao acabar o tempo
                timer = 0;
            }
        }, 1000);
    };
    startTimer(15); // Dispara 15 minutos pro FOMO (Fear Of Missing Out)

    
    // --- TIMELINE MASTER INITIAL (Entrada do Hero) ---
    const masterTl = gsap.timeline({ defaults: { ease: "power4.out" } });
    
    // Mostra Elementos Pre-Loading Invisíveis
    gsap.set('.gsap-hide', { autoAlpha: 1 }); // Remove o 'Visibility hidden' sem piscar
    
    // Entrada Hero Badge Pequena
    masterTl.fromTo('.hero-badge', 
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.2
    );

    // Entrada Textos Headline e Subtitle
    masterTl.fromTo('.hero-title span',
        { y: 50, opacity: 0, rotationX: -10 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.2 },
        0.4
    );
    
    masterTl.fromTo('.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        0.8
    );

    // Entrada Botões (Bouncing)
    masterTl.fromTo('.hero-actions a',
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.5)' },
        1.0
    );

    // Fade Logos Empresas
    masterTl.fromTo('.logos-section',
        { opacity: 0 },
        { opacity: 1, duration: 1.5 },
        1.5
    );

    
    // --- SCROLL ANIMATIONS (Revelação Durante Descida) ---

    // 1. Método / Features Section
    gsap.fromTo('.section-header', 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1,
            scrollTrigger: {
                trigger: '#metodo',
                start: 'top 80%', // Dispara quando o topo do '#metodo' cruzar 80% da tela descendo
                toggleActions: "play none none reverse"
            }
        }
    );

    gsap.fromTo('.feature-card', 
        { y: 80, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.2, // Um surge depois do outro
            scrollTrigger: {
                trigger: '.feature-card',
                start: 'top 85%'
            }
        }
    );

    // 2. Reviews Section (Deslizando Direita pra Esquerda)
    gsap.fromTo('.review-card', 
        { x: 100, opacity: 0 },
        {
            x: 0, opacity: 1, duration: 1, stagger: 0.3, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.review-card',
                start: 'top 85%'
            }
        }
    );

    // 3. Efeito Contador na ViewPort (Numbers)
    const counters = document.querySelectorAll('.counter');
    
    ScrollTrigger.create({
        trigger: '.numbers-wrapper',
        start: 'top 80%',
        onEnter: () => {
            gsap.fromTo('.numbers-wrapper', {y: 40, opacity: 0}, {y: 0, opacity: 1, duration: 1});
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 3, // Demora 3 segundos rolando numero até o Target
                    snap: { innerHTML: 1 }, // O snap garante q vao virar inteiros sem vírgula
                    ease: "power2.out"
                });
            });
        },
        once: true // Anima Números só a 1ª vez
    });


    // 4. Seção Final Oferta Caixote (Scale e Shadow Pop)
    gsap.fromTo('.offer-wrapper', 
        { scale: 0.9, y: 50, opacity: 0 },
        {
            scale: 1, y: 0, opacity: 1, duration: 1.2, ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: '#oferta',
                start: 'top 75%'
            }
        }
    );

    // --- NAVBAR AUTO-Ocultar ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        let currentScroll = window.pageYOffset;
        if (currentScroll > 150) { // Se desceu
            if (currentScroll > lastScroll) { 
                // Desceu Ocultar Header Flutuando - Top value
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Subiu Revelar Header
                navbar.style.transform = 'translateY(0)';
                navbar.classList.add('shadow-[0_4px_30px_rgba(0,0,0,0.5)]');
            }
        } else {
            // Topo da Pagina
            navbar.style.transform = 'translateY(0)';
            navbar.classList.remove('shadow-[0_4px_30px_rgba(0,0,0,0.5)]');
        }
        lastScroll = currentScroll;
    });

});
