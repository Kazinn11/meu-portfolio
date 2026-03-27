const mongoose = require('mongoose');

// == DADOS DO USUÁRIO (Criador de Ideias) ==
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    avatarUrl:{ type: String, default: 'https://ui-avatars.com/api/?name=User' },
    createdAt:{ type: Date, default: Date.now }
});

// == COMENTARIOS (Subelemento Acoplado) ==
const CommentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text:   { type: String, required: true, maxlength: 250 },
    date:   { type: Date, default: Date.now }
});

// == AS IDEIAS (As postagens do Feed Principal) ==
const IdeaSchema = new mongoose.Schema({
    authorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title:      { type: String, required: true, trim: true },
    content:    { type: String, required: true },
    category:   { type: String, enum: ['Tecnologia', 'Alimentação', 'Serviços', 'Marketing', 'Outros'], default: 'Outros' },
    location:   { type: String, required: false }, // Foco Local: Ex "São Paulo, SP"
    
    // Matriz de UPVOTES (Matem a conta de quem Curtiu pra n repetir)
    upvotes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    // Embedding: Relacionamento 1-para-Muitos sem Foreign Key chata (O poder do NoSQL)
    comments:   [CommentSchema],
    
    createdAt:  { type: Date, default: Date.now },
    isTrending: { type: Boolean, default: false }
});

// Exporta Coleções para serem instanciadas pela API (Rotas do Express)
module.exports = {
    User: mongoose.model('User', UserSchema),
    Idea: mongoose.model('Idea', IdeaSchema)
};
