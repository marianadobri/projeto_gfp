import {BD} from '../db.js';

class rotasSubCategorias{
    //nova Subcategoria
    static async novaSubCategoria(req,res){
        const{ nome, id_categoria, gasto_fixo} = req.body;
        try{
            const subcategoria = await BD.query(`INSERT INTO subcategorias (nome, id_categoria, gasto_fixo)
                    VALUES ($1, $2, $3) RETURNING *`,
                    [nome, id_categoria, gasto_fixo])
            return res.status(201).json(subcategoria.rows[0]);// retorna o usuario criado com status 201
        }catch(error){
            console.error('Erro ao criar a subcategoria', error);
            res.status(500).json({message: 'Erros ao criar subcategoria', error: error.message});
        }
    }

    //listar subcategorias
    static async listarSubCategorias(req,res){
        try{
            const subcategorias = await BD.query('SELECT * FROM subcategorias WHERE ativo = true');
            res.status(200).json(subcategorias.rows); //retorna os produtos com status 200
        }catch(error){
            res.status(500).json({message: 'Erro ao listar subcategorias', error: error.message});
        }
    }


    //listar subcategoria por id
    static async listarSubCategoriasPorID(req, res) {  
        const { id_subcategoria } = req.params;
       
        try{
            const subcategoria = await BD.query('SELECT * FROM subcategorias WHERE id_subcategoria = $1', [id_subcategoria]);
            res.status(200).json(subcategoria.rows);  
        }catch(error){
            res.status(500).json({message: "Erro ao consultar a subcategoria", error: error.message});
        }
   
    }

    //atualizar todos os campos da subcategoria
    static async atualizarTodosSubCategoria(req,res){
        const {id_subcategoria} = req.params;                
        const {nome, id_categoria, gasto_fixo} = req.body;
        try{
            const subcategoria = await BD.query ('UPDATE subcategorias SET nome = $1, id_categoria = $2, gasto_fixo = $3 WHERE id_subcategoria = $4 RETURNING *',
                [nome, id_categoria, gasto_fixo, id_subcategoria]
            )
            res.status(200).json(subcategoria.rows)
        }catch(error){
            res.status(500).json({message: "Erro ao atualizar a subcategoria", error: error.menssage})
        }

}

    //atualizar subcategoria
    static async atualizarSubCategoria(req,res){
        const {id_subcategoria} = req.params;                
        const {nome, id_categoria} = req.body;
        try{
            const subcategoria = await BD.query ('UPDATE subcategorias SET nome = $1, id_categoria = $2 WHERE id_subcategoria = $3 RETURNING *',
                [nome, id_categoria, id_subcategoria]
            )
            res.status(200).json(subcategoria.rows)
        }catch(error){
            res.status(500).json({message: "Erro ao atualizar a subcategoria", error: error.menssage})
        }

    }

    //deletar subcategoria
    static async deletarSubCategoria(req,res){
        const {id_subcategoria} = req.params;                
        try{
            const subcategoria = await BD.query (`UPDATE subcategorias SET ativo = false WHERE id_subcategoria = $1 RETURNING *`,
                [id_subcategoria]
            )
            return res.status(200).json(subcategoria.rows)
        }catch(error){
            res.status(500).json({message: "Erro ao deletar a subcategoria", error: error.menssage})
        }

    }

}

export default rotasSubCategorias;