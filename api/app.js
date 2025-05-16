import express from 'express';
import { testarConexao } from './db.js';
import cors from 'cors'
import rotasUsuarios, {autenticarToken} from './routes/rotasUsuarios.js';
import rotasCategorias from './routes/rotasCategorias.js';
import rotasSubCategorias from './routes/rotasSubCategorias.js';
import rotasTransacoes from './routes/rotasTransacoes.js';
import rotasContas from './routes/rotasContas.js';

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
app.get('/categorias/filtrarCategoria', rotasCategorias.filtrarCategoria)
app.get('/categorias/listar', autenticarToken, rotasCategorias.listar) // foi
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


//Rotas contas - tudo certo
app.post('/contas', rotasContas.novaConta) // certo
app.get('/contas/filtrarCategoria', rotasContas.filtrarNome)
app.get('/contas', autenticarToken, rotasContas.listarContas) // certo
app.get('/contas/:id_conta', autenticarToken, rotasContas.listarContaPorID)  // foi
app.patch('/contas/:id_conta', autenticarToken, rotasContas.atualizarContas) // foi
app.put('/contas/:id_conta', autenticarToken, rotasContas.atualizarTodasContas) 
app.delete('/contas/:id_conta', autenticarToken, rotasContas.deletarConta)




//Rotas Transações 
app.post('/transacoes', rotasTransacoes.novaTransacoes) //ok
app.get('/transacoes/somarTransacoes', rotasTransacoes.somarTransacoes) //ok
app.get('/transacoes/filtroData', rotasTransacoes.filtrarPorData) //ok
app.get('/transacoes/transacoesVencidas/:id_usuario', rotasTransacoes.transacoesVencidas) //ok
app.get('/transacoes', rotasTransacoes.listarTransacoes) //ok
app.get('/transacoes/:id_transacao', rotasTransacoes.listarTransacoesPorID)  // ok
app.patch('/transacoes/:id_transacao', rotasTransacoes.atualizarTransacoes)   // ok             
app.put('/transacoes/:id_transacao', rotasTransacoes.atualizarTodosTransacoes) //ok
app.delete('/transacoes/:id_transacao', rotasTransacoes.deletarTransacoes) //ok



const porta = 3000;
app.listen(porta, () => {
    console.log(`Api http://localhost:${porta}`)
})