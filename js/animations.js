// Observador de elementos para animações ao rolar
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Observar todas as seções
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Animação de digitação
function initTypingAnimation() {
    const texts = [
        "Desenvolvedor Web Front-end",
        "Designer UI/UX",
        "Entusiasta de Tecnologia"
    ];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    
    const typingElement = document.querySelector('.typing-animation');
    
    function type() {
        if (count === texts.length) {
            count = 0;
        }
        
        currentText = texts[count];
        letter = currentText.slice(0, ++index);
        
        typingElement.textContent = letter;
        
        if (letter.length === currentText.length) {
            setTimeout(erase, 2000);
        } else {
            setTimeout(type, 100);
        }
    }
    
    function erase() {
        letter = currentText.slice(0, --index);
        typingElement.textContent = letter;
        
        if (letter.length === 0) {
            count++;
            index = 0;
            setTimeout(type, 500);
        } else {
            setTimeout(erase, 50);
        }
    }
    
    // Iniciar animação após um breve atraso
    setTimeout(type, 1000);
}

// Iniciar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initTypingAnimation);