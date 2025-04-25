import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors'
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubCategorias from './routes/rotasSubCategorias.js';
import rotasLocalTransacoes from './routes/rotasLocalTransacoes.js';
import rotasTransacoes from './routes/rotasTransacoes.js';

const app = express()
testarConexao();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('API Funcionando!')
})

//ROTAS USUARIOS - tudo certo
app.post('/usuarios', rotasUsuarios.novoUsuario)
app.post('/usuarios/login', rotasUsuarios.login) 
app.get('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.listarUsuariosPorID) //foi
app.get('/usuarios', autenticarToken, rotasUsuarios.listarUsuarios) //foi
app.delete('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.deletar) // foi
app.put('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizarTodos) // foi
app.patch('/usuarios/:id_usuario', autenticarToken, rotasUsuarios.atualizar) // foi



//ROTAS CATEGORIAS - tudo certo  //// autenticar diz que não é fornecido o token
app.post('/categorias', autenticarToken, rotasCategorias.nova) // foi
app.get('/categorias', autenticarToken, rotasCategorias.listar) // foi
app.get('/categorias/:id_categoria', autenticarToken, rotasCategorias.listarPorID) // foi
app.patch('/categorias/:id_categoria', autenticarToken, rotasCategorias.atualizar) // foi 
app.put('/categorias/:id_categoria', autenticarToken, rotasCategorias.atualizarTodos) //foi
app.delete('/categorias/:id_categoria', autenticarToken, rotasCategorias.deletar) // foi

//Rotas SubCategorias - tudo certo
app.post('/subcategorias', autenticarToken,rotasSubCategorias.novaSubCategoria) // foi
app.get('/subcategorias',  autenticarToken,rotasSubCategorias.listarSubCategorias) //foi
app.get('/subcategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.listarSubCategoriasPorID) // foi
app.put('/subcategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.atualizarTodosSubCategoria) // foi
app.patch('/subcategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.atualizarSubCategoria) // foi 
app.delete('/subcategorias/:id_subcategoria', autenticarToken, rotasSubCategorias.deletarSubCategoria) // foi












//Rotas Local Transações 
app.post('/localTransacoes', rotasLocalTransacoes.novaLocalTransacoes) // certo
app.get('/localTransacoes', rotasLocalTransacoes.listarTransacoes) // certo
app.get('/localTransacoes/:id_local_transacao', rotasLocalTransacoes.listarLocalTransacaoPorID)  // foi
app.patch('/localTransacoes/:id_local_transacao', rotasLocalTransacoes.atualizarLocalTransacoes) // foi
app.put('/localTransacoes/:id_local_transacao', rotasLocalTransacoes.atualizarTodosLocalTransacoes) 
app.delete('/localTransacoes/:id_local_transacao', rotasLocalTransacoes.deletarTransacoes)
































//Rotas Transações 
app.post('/transacoes', rotasTransacoes.novaTransacoes)
app.get('/transacoes', rotasTransacoes.listarTransacoes)
app.get('/transacoes/:id_transacao', rotasTransacoes.listarTransacoesPorID)  
app.patch('/transacoes/:id_transacao', rotasTransacoes.atualizarTransacoes)                
app.put('/transacoes/:id_transacao', rotasTransacoes.atualizarTodosTransacoes)
app.delete('/transacoes/:id_transacao', rotasTransacoes.deletarTransacoes)




const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
})