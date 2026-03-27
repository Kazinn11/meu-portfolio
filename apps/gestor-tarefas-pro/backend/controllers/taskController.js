const db = require('../db/database');

exports.createTask = (req, res) => {
    const { title, description, category, priority, due_date, due_time } = req.body;
    const user_id = req.userId;

    if (!title) return res.status(400).json({ error: 'Título é obrigatório.' });

    const query = `INSERT INTO tasks 
        (user_id, title, description, category, priority, due_date, due_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [user_id, title, description, category, priority, due_date, due_time], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao criar tarefa.' });
        res.status(201).json({ id: this.lastID, message: 'Tarefa criada com sucesso!' });
    });
};

exports.getTasks = (req, res) => {
    const user_id = req.userId;
    const query = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC, due_time ASC';

    db.all(query, [user_id], (err, tasks) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar tarefas.' });
        res.status(200).json(tasks);
    });
};

exports.updateTask = (req, res) => {
    const { id } = req.params;
    const { title, description, category, priority, status, due_date, due_time } = req.body;
    const user_id = req.userId;

    const query = `UPDATE tasks SET 
        title = ?, description = ?, category = ?, priority = ?, status = ?, 
        due_date = ?, due_time = ?
        WHERE id = ? AND user_id = ?`;

    db.run(query, [title, description, category, priority, status, due_date, due_time, id, user_id], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao atualizar tarefa.' });
        res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
    });
};

exports.deleteTask = (req, res) => {
    const { id } = req.params;
    const user_id = req.userId;

    const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    db.run(query, [id, user_id], function(err) {
        if (err) return res.status(500).json({ error: 'Erro ao excluir tarefa.' });
        res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
    });
};
