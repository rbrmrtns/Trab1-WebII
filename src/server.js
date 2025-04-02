const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false 
}));

const authMiddleware = (req, res, next) => {
    if (req.query.teste === 'true') { // adicione '?teste=true' ao final da URL para contornar a verificação
        return next();
    }

    const token = req.headers['authorization'];
   
    if (!token) {
        const erro = new Error;
        erro.statusCode = 401;
        erro.message = "Requisição não autorizada";
        throw erro;
    }

    next();
};

const validationMiddleware = (req, res, next) => {
    const email = req.body['email'];
    const nome = req.body['nome'];

    

    if (!email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        const erro = new Error;
        erro.statusCode = 400;
        erro.message = "E-mail não informado ou inválido";
        throw erro;
    }

    if (!nome || !/^[a-zA-Z\s]+$/.test(nome)) {
        const erro = new Error;
        erro.statusCode = 400;
        erro.message = "Nome não informado ou inválido";
        throw erro;
    }

    next();
}

const errorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    return res.status(statusCode).json({ erro: message });
}

const usuarios = ['Enzo', 'Ricardo', 'Giovana', 'Oliver', 'Anthony'];

app.get('/', authMiddleware, (req, res, next) => {
    res.send("Bem-vindo(a), você se conectou com sucesso!");
});

app.get('/usuarios/:usuarioNome', authMiddleware, (req, res, next) => {
    const usuarioNome = req.params.usuarioNome;
    res.send(`Olá, ${usuarioNome}!`);
});

app.get('/usuarios', authMiddleware, (req, res, next) => {
    const query = req.query.nome;
    let html;

    if (query == null) {
        html = `<h1>Nomes de usuários</h1>`;
    } else {
        html = `<h1>Nomes de usuários que começam com ${query}</h1>`;
    }
    html += "<ul>";
    let usuariosFiltrados = [];
    if (query != null) {
        usuariosFiltrados = usuarios.filter((u) => u.toLowerCase().includes(query.toLowerCase()));
    } else {
        usuariosFiltrados = usuarios;
    }
    usuariosFiltrados.forEach(u => {
        html += `<li>${u}</li>`;
    })
    html += "</ul>";
    
    res.send(html);
});

app.post('/usuarios/add', authMiddleware, validationMiddleware, (req, res, next) => {
    const id = crypto.randomUUID();
    const email = req.body['email'];
    const nome = req.body['nome'];
    const dados = {id, email, nome};

    res.send(dados)
})

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});