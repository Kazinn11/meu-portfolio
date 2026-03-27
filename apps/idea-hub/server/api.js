const express = require('express');
const cors = require('cors');
const { User, Idea } = require('./models');

const app = express();
app.use(express.json());
app.use(cors());

// Middleware de Autenticação Falso (Numa vida real, usariamos JWT Headers Bearer)
const mockAuth = async (req, res, next) => {
    // Faremos de conta que ele passou o ID jwt correto.
    req.user = { id: '64e8a1d2e1329cbf9140abcd', name: 'User_Visitante' }; 
    next();
};

/**
 * [GET] /api/feed
 * Traz as ultimas postagens da Rede Social (Limita em 50, Ordenadas Novas -> Velhas)
 */
app.get('/api/feed', async (req, res) => {
    try {
        const posts = await Idea.find()
            .populate('authorId', 'username avatarUrl') // Faz o JOIN manual NoSQL pro nome do Autor
            .sort({ createdAt: -1 })
            .limit(50);
            
        res.status(200).json(posts);
    } catch(err) {
        res.status(500).json({ error: "Erro de Servidor Mongo." });
    }
});

/**
 * [POST] /api/ideas
 * Publicar nova Ideia (Req Auth)
 */
app.post('/api/ideas', mockAuth, async (req, res) => {
    try {
        const { title, content, category, location } = req.body;
        
        if(!title || !content) {
            return res.status(400).json({ error: "Título e Descrição são obrigatórios." });
        }

        const newPost = await Idea.create({
            authorId: req.user.id,
            title,
            content,
            category,
            location
        });

        res.status(201).json({ success: true, post: newPost });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * [PUT] /api/ideas/:id/upvote
 * Sistema Core de Avaliação: Dar 'Like' na parada e Retirar (Toggle)
 */
app.put('/api/ideas/:id/upvote', mockAuth, async (req, res) => {
    try {
        const post = await Idea.findById(req.params.id);
        if(!post) return res.status(404).json({ error: "Post NotFound" });

        const hasVotedIdx = post.upvotes.indexOf(req.user.id);
        
        if (hasVotedIdx === -1) {
            // Se Não Curtiu -> ADICIONA NO ARRAY
            post.upvotes.push(req.user.id);
            // Se bater 10 curtidas vira Trending
            if(post.upvotes.length >= 10) post.isTrending = true; 
        } else {
            // Se Já Curtiu -> Ele Clicou pra Descurtir -> REMOVE DO ARRAY (Toggle NoSQL)
            post.upvotes.splice(hasVotedIdx, 1);
            if(post.upvotes.length < 10) post.isTrending = false;
        }

        await post.save();
        
        res.status(200).json({ upvotesCount: post.upvotes.length, trending: post.isTrending });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Starts App
const PORT = process.env.PORT || 9090;
/*
app.listen(PORT, () => {
    console.log(`📡 [IDEA-HUB API] Server REST rodando integrado com Mongoose MongoDB na porta: ${PORT}`);
});
*/
module.exports = app;
