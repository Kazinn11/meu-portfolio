const db = require('../db/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

exports.register = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatórios faltando.' });

    const hashedPassword = bcrypt.hashSync(password, 8);
    
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.run(query, [name, email, hashedPassword], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) return res.status(400).json({ error: 'Email já cadastrado.' });
            return res.status(500).json({ error: 'Erro ao criar usuário.' });
        }
        res.status(201).json({ id: this.lastID, message: 'Usuário registrado com sucesso!' });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios.' });

    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, user) => {
        if (err || !user) return res.status(401).json({ error: 'Usuário não encontrado.' });
        
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ error: 'Senha inválida.' });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 86400 });
        res.status(200).json({ auth: true, token, user: { id: user.id, name: user.name, email: user.email } });
    });
};
