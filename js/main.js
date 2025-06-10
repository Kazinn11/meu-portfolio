document.addEventListener('DOMContentLoaded', function() {
    // Atualizar ano no footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('#navbar ul');
    
    menuToggle.addEventListener('click', function() {
        navUl.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('#navbar ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navUl.classList.remove('active');
        });
    });
    
    // Mudar navbar no scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Carregar projetos
    loadProjects();
    
    // Carregar habilidades
    loadSkills();
});

function loadProjects() {
    const projects = [
        {
            title: "🌌 Explorador de Galáxias",
            description: "O Explorador de Galáxias é um projeto web interativo que simula um catálogo astronômico, permitindo aos usuários explorar informações detalhadas sobre algumas das galáxias mais fascinantes do universo. Desenvolvido com HTML5, CSS3 e JavaScript puro, este projeto demonstra habilidades avançadas em front-end, incluindo manipulação do DOM, animações CSS, efeitos de partículas com Canvas API e integração multimídia.",
            image: "images/projects/project1.jpg",
            link: "https://kazinn11.github.io/galaxy-explorer/",
            github: "https://github.com/Kazinn11/galaxy-explorer"
        },
        {
            title: "Cosmici.Ibrary 📚",
            description: "A Cosmici.Ibrary é uma biblioteca digital interativa com temática cósmica, desenvolvida para organizar e visualizar livros em PDF de forma elegante e intuitiva. O projeto combina um design moderno com efeitos de partículas animadas, oferecendo uma experiência imersiva para amantes de livros.",
            image: "images/projects/project2.jpg",
            link: "https://kazinn11.github.io/my-digital-library/",
            github: "https://github.com/Kazinn11/my-digital-library"
        },
        {
            title: "NebulaFeed - Rede Social Intergaláctica",
            description: "O NebulaFeed é uma rede social inovadora desenvolvida com HTML, CSS e JavaScript, onde os usuários podem se conectar e compartilhar ideias em um ambiente temático inspirado no universo.",
            image: "images/projects/project3.jpg",
            link: "https://kazinn11.github.io/nebula-feed/",
            github: "https://github.com/Kazinn11/nebula-feed"
        }
        {
            title: " Café Aroma - Site de Cafeteria"
            description: "Café Aroma - um site completo para cafeteria, desenvolvido com HTML, CSS e JavaScript, oferecendo uma experiência moderna, interativa e responsiva para os amantes de café!"
            image: "images/"
            link: "https://github.com/Kazinn11/cafe-aroma/"
            github: "https://github.com/Kazinn11/cafe-aroma"
         }   
    ];
    
    const projectsGrid = document.querySelector('.projects-grid');
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card fade-in';
        
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-links">
                    <a href="${project.link}" class="btn">Ver Projeto</a>
                    <a href="${project.github}" target="_blank"><i class="fab fa-github"></i> Código</a>
                </div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}

function loadSkills() {
    const skills = [
        { name: "HTML5", level: 92 },
        { name: "CSS3", level: 85 },
        { name: "JavaScript", level: 81 },
        { name: "React", level: 70 },
        { name: "Python", level: 90 },
        { name: "Node.js", level: 60 },
        { name: "Git", level: 55 }
    ];
    
    const skillsChart = document.querySelector('.skills-chart');
    
    skills.forEach(skill => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        skillItem.innerHTML = `
            <div class="skill-info">
                <span class="skill-name">${skill.name}</span>
                <span class="skill-percent">${skill.level}%</span>
            </div>
            <div class="skill-bar">
                <div class="skill-progress" style="width: ${skill.level}%;"></div>
            </div>
        `;
        
        skillsChart.appendChild(skillItem);
    });
}
