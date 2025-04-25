import {BD} from '../db.js';

class rotasLocalTransacoes {
    //nova Local Transação
    static async novaLocalTransacoes(req, res) {
        const { nome, tipo_local, saldo } = req.body;
        try {
            const localTransacao = await BD.query(`INSERT INTO local_transacao (nome, tipo_local, saldo)
                    VALUES ($1, $2, $3)`,
                [nome, tipo_local, saldo]);                
            res.status(201).json('Nova transação cadastrada'); //retorna o usuario criado com status 201
        } catch (error) {
            console.error('Erro ao criar a transação', error);
            res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
        }
    }

    //listar transações
    static async listarTransacoes(req, res) {
        try {
            const transacoes = await BD.query('SELECT * FROM local_transacao WHERE ativo = true');
            res.status(200).json(transacoes.rows); //retorna os produtos com status 200
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar transações', error: error.message });
        }
    }

    //listar subcategoria por id         // NAO RETORNA NO POSTMAN
    static async listarLocalTransacaoPorID(req, res) {  
        const { id_local_transacao } = req.params;
       
        try{
            const localTransacao = await BD.query('SELECT * FROM local_transacao WHERE id_local_transacao = $1', [id_local_transacao]);
           return res.status(200).json(localTransacao.rows);  
        }catch(error){
            res.status(500).json({message: "Erro ao consultar o local transação", error: error.message});
        }
   
    }

    //função atualizar os valores individualmente caso necessario
    static async atualizarLocalTransacoes(req, res){ //CERTO
        const {id_local_transacao} = req.params;
        const {nome, tipo_local, saldo, ativo} = req.body;
        
        try{
            //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = [];
            const valores = [];

            //verificar quais campos foram fornecidos
            if (nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho da array para determinar o campo
                valores.push(nome);
            }
            if(tipo_local !== undefined){
                campos.push(`tipo_local = $${valores.length + 1}`)
                valores.push(tipo_local);
            }
            if(saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }
            if(campos.length === 0){
                return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
            }

            //montamos a query dinamicamente
            const query = `UPDATE local_transacao
                            SET ${campos.join(', ')}
                            WHERE id_local_transacao = ${id_local_transacao}
                            RETURNING *`
            console.log(query);
            
            //executando nossa query
            const localTransacao = await BD.query(query, valores)

            //verifica se o usuario foi atualizado
            if(localTransacao.rows.length === 0){
                return res.status(404).json({message: 'Usuário não encontrado'})
            }



            return res.status(200).json(localTransacao.rows[0]);
        }
        catch(error){
            console.log(error.message);
            
            res.status(500).json({message: "Erro ao atualizar o usuário", error: error.message})
        }
    }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

        //atualizar todos os campos de local transação                
    static async atualizarTodosLocalTransacoes(req,res){ //TERMINAR DE ARRUMAR
        const {id_local_transacao} = req.params;
        const {nome, tipo_local, saldo, ativo} = req.body;

    try{
        const localTransacao = await BD.query ('UPDATE local_transacao SET nome = $1 , tipo_local = $2, saldo = $3, ativo = $4 WHERE id_local_transacao = $6 RETURNING *',
            [nome, tipo_local, saldo, ativo] 
        )
        res.status(200).json(localTransacao.rows)
    }catch(error){
        res.status(500).json({message: "Erro ao atualizar o Local Transação", error: error.message})
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //deletar transação
    static async deletarTransacoes(req, res) {
        const { id_transacao } = req.params;
        try {
            const transacao = await BD.query(`DELETE FROM local_transacoes WHERE id_transacao = $1 RETURNING *`,
                [id_transacao]);
            res.status(200).json(transacao.rows); //retorna o usuario criado com status 201
        } catch (error) {
            console.error('Erro ao deletar a transação', error);
            res.status(500).json({ message: 'Erro ao deletar transação', error: error.message });
        }
}

}

export default rotasLocalTransacoes;