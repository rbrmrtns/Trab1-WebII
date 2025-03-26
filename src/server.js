const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false 
}));

const middleware = (req, res, next) => {
    const token = req.headers['authorization'];
   
    if (token == null) {
        return res.sendStatus(401);
    }

    next();
};

const usuarios = ['Enzo', 'Ricardo', 'Giovana', 'Oliver', 'Anthony'];

app.get('/', middleware, (req, res, next) => {
    res.send("Bem-vindo(a), você se conectou com sucesso!");
});

app.get('/usuarios/:usuarioNome', middleware, (req, res, next) => {
    const usuarioNome = req.params.usuarioNome;
    res.send(`Olá, ${usuarioNome}!`);
});

app.get('/usuarios', middleware, (req, res, next) => {
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

app.post('/usuarios/add', middleware, (req, res, next) => {

})

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});



// const users = ['vini', 'theo'];
// app.get('/users', (req, res) => {
//     let html = "<ul>";
//     users.forEach(u => {
//         html += `<li>${u}</li>`
//     })
//     html += "</ul>"
//     html += '<a href="add-user.html">ADD USER</a>'
//     res.send(html);
// });

// app.post('/users', (req, res) => {
//     console.log({ body: req.body});
//     const { name } = req.body;
//     users.push(name);
//     // res.send("OK!!")
//     res.redirect('/users');
// });

// // pagina estatica
// // 1. mapear junto ao express tudo que é estático
// app.use(express.static('public'))
// // 2. enviar o arquivo de fato



// // query params
// // sao legais => CACHE! Dados simples, paginacao, consulta, limites
// // nao sao legais => deixa exposta a informação, logo nao podem ser utilizados para dados sensiveis; quantidade de informação e encoding da url; 
// // ?q=educacao&saude
// /*
// { q: 'educação', saude: '' }
// */
// app.get('/teste', (req, res) => {
//     console.log({
//         query: req.query
//     })
//     const query = req.query.q;
//     res.send("Voce buscou por " + query);
// })

// app.get('/parametrizado/1', (req, res) => {
//     res.send("O 1 é imutavel - deve ser declarado primeiro")
// });

// app.get('/parametrizado/:id', (req, res) => {
//     // Destructuring, pega o atributo id do objeto req.params, o mesmo que
//     // const id = req.params.id;
//     const { id } = req.params;
//     res.send("Buscou pelo id " + id);
// })

// //app.get('/users/admin')
// //app.get('/users/:username)


// app.get('/series/:name/:season', (req, res) => {
//     res.json(req.params);
// })