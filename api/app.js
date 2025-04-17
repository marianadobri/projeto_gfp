import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors'
import rotasUsuarios from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';

const app = express()
testarConexao();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Funcionando!')
})

//ROTAS USUARIOS
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.get('/usuarios/:id_usuario', rotasUsuarios.listarUsuariosPorID)
app.get('/usuarios', rotasUsuarios.listarUsuarios)
app.delete('/usuarios/:id_usuario', rotasUsuarios.deletar)
app.put('/usuarios/:id_usuario', rotasUsuarios.atualizarTodos)
app.patch('/usuarios/:id_usuario', rotasUsuarios.atualizar) 
app.post('/usuarios/login', rotasUsuarios.login) 


//ROTAS CATEGORIAS
app.post('/categorias', rotasCategorias.nova)
app.get('/categorias', rotasCategorias.listar)
app.get('/categorias/:id_categoria', rotasCategorias.listarPorID)
app.patch('/categorias/:id_categoria', rotasCategorias.atualizar)
app.put('/categorias/:id_categoria', rotasCategorias.atualizarTodos)
app.delete('/categorias/:id_categoria', rotasCategorias.deletar)





const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
})