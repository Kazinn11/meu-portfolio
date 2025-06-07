document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !email || !message) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }
    
    // Aqui você pode adicionar o código para enviar o formulário
    // Por exemplo, usando Fetch API ou AJAX
    
    alert('Mensagem enviada com sucesso! Entrarei em contato em breve.');
    this.reset();
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}