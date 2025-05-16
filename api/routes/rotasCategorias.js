import {BD} from '../db.js';

class rotasCategorias{
    //novo produto
    static async nova(req,res){  //CERTO
        const{ nome, tipo_transacao, gasto_fixo, ativo, id_usuario} = req.body;

        try{
        //chama o metodo na classe produto para criar um novo produto
            //const produtos = await Produto.listar();
            const categoria = await BD.query(`INSERT INTO categorias (nome, tipo_transacao, gasto_fixo, ativo, id_usuario)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [nome, tipo_transacao, gasto_fixo, ativo, id_usuario])
            res.status(201).json(categoria);// retorna o usuario criado com status 201
        }catch(error){
            console.error('Erro ao criar a categoria', error);
            res.status(500).json({message: 'Erros ao criar categoria', error: error.message});
        }
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //função para listar (GET)
    static async listar(req,res){  //CERTO
        try{
            const categoria = await BD.query('SELECT * FROM categorias WHERE ativo = true'); 
            res.status(200).json(categoria.rows); 
        }catch(error){
            res.status(500).json({message:'Erro ao listar ', error: error.message})
        }
    }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //consulta por id
    static async listarPorID(req, res) {  //CERTO
        const { id_categoria } = req.params;
        
        try{
            const categoria = await BD.query('SELECT * FROM categorias WHERE id_categoria = $1', [id_categoria]);
            res.status(200).json(categoria.rows);
        }catch(error){
            res.status(500).json({message: "Erro ao consultar a categoria", error: error.message});
        }
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

    //função atualizar os valores individualmente caso necessario
static async atualizar(req, res){   //CERTO
    const {id_categoria} = req.params;
    const { nome, tipo_transacao, gasto_fixo, ativo} = req.body;
    
    try{
        //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
        const campos = [];
        const valores = [];

        //verificar quais campos foram fornecidos
        if (nome !== undefined){
            campos.push(`nome = $${valores.length + 1}`) 
            valores.push(nome);
        }
        if(tipo_transacao !== undefined){
            campos.push(`tipo_transacao = $${valores.length + 1}`)
            valores.push(tipo_transacao);
        }
        if(gasto_fixo !== undefined){
            campos.push(`gasto_fixo = $${valores.length + 1}`)
            valores.push(gasto_fixo);
        }
        if(ativo !== undefined){
            campos.push(`ativo = $${valores.length + 1}`)
            valores.push(ativo);
        }
        if(campos.length === 0){
            return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
        }

        //montamos a query dinamicamente
        const query = `UPDATE categorias
                        SET ${campos.join(', ')}
                        WHERE id_categoria = ${id_categoria}
                        RETURNING *`
        console.log(query);
        
        //executando nossa query
        const categoria = await BD.query(query, valores)

        //verifica se o usuario foi atualizado
        if(categoria.rows.length === 0){
            return res.status(404).json({message: 'Categoria não encontrado'})
        }



        return res.status(200).json(categoria.rows[0]);
    }
    catch(error){
        console.log(error.message);
        
        res.status(500).json({message: "Erro ao atualizar a categoria", error: error.message})
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//função atualizar todos
static async atualizarTodos(req,res){ //CERTOO
    const {id_categoria} = req.params;
    const {nome, tipo_transacao, gasto_fixo, ativo, id_usuario} = req.body;

    try{
        const categoria = await BD.query ('UPDATE categorias SET nome = $1 , tipo_transacao = $2, gasto_fixo = $3, ativo = $4, id_usuario = $5 WHERE id_categoria = $6 RETURNING *',
            [nome, tipo_transacao, gasto_fixo, ativo, id_usuario, id_categoria] 
        )
        res.status(200).json(categoria.rows)
    }catch(error){
        res.status(500).json({message: "Erro ao atualizar a categoria", error: error.message})
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//deletar 
static async deletar(req, res) {  //CERTO
    const { id_categoria } =req.params;
    try{
        const categoria = await BD.query('UPDATE categorias set ativo = false WHERE id_usuario = $1', [id_categoria])
        return res.status(200).json({message: "Categoria desativado com sucesso"})
    }catch(error){
        res.status(500).json({message: "Erro ao desativar categoria", error: error.message})
    }
}

    //filtrar por tipo categoria
    static async filtrarCategoria (req, res){
        const { tipo_transacao } = req.query;

        try{
            const query = `
            SELECT * FROM categorias
            WHERE tipo_transacao = $1 AND ativo = true
            ORDER BY nome DESC
            `
            const valores = [tipo_transacao]
            const resposta = await BD.query(query, valores)
            return res.status(200).json(resposta.rows)

        }catch(error){
            console.error('Erro ao filtrar categoria', error);
            res.status(500).json({message: "Erro ao filtrar categoria", error: error.message})
        }
    }
}


export default rotasCategorias;