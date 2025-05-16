import {BD} from '../db.js';

class rotasContas {
    //nova Local Transação
    static async novaConta(req, res) {
        const {nome, tipo_conta, saldo, ativo, conta_padrao} = req.body;
        try {
            const conta = await BD.query(`INSERT INTO contas (nome, tipo_conta, saldo, ativo, conta_padrao)
                    VALUES ($1, $2, $3, $4, $5)`,
                [nome, tipo_conta, saldo, ativo, conta_padrao]);                
            res.status(201).json('Nova conta cadastrada'); //retorna o usuario criado com status 201
        } catch (error) {
            console.error('Erro ao criar a conta', error);
            res.status(500).json({ message: 'Erro ao criar conta', error: error.message });
        }
    }

    //listar transações
    static async listarContas(req, res) {
        try {
            const contas = await BD.query('SELECT * FROM contas WHERE ativo = true');
            res.status(200).json(contas.rows); //retorna os produtos com status 200
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar contas', error: error.message });
        }
    }

    //listar subcategoria por id         // NAO RETORNA NO POSTMAN
    static async listarContaPorID(req, res) {  
        const { id_conta } = req.params;
       
        try{
            const conta = await BD.query('SELECT * FROM contas WHERE id_conta = $1', [id_conta]);
           return res.status(200).json(conta.rows);  
        }catch(error){
            res.status(500).json({message: "Erro ao consultar a conta", error: error.message});
        }
   
    }

    //função atualizar os valores individualmente caso necessario
    static async atualizarContas(req, res){ //CERTO
        const {id_conta} = req.params;
        const {nome, tipo_conta, saldo, ativo, conta_padrao} = req.body;
        
        try{
            //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
            const campos = [];
            const valores = [];

            //verificar quais campos foram fornecidos
            if (nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho da array para determinar o campo
                valores.push(nome);
            }
            if(tipo_conta !== undefined){
                campos.push(`tipo_conta = $${valores.length + 1}`)
                valores.push(tipo_conta);
            }
            if(saldo !== undefined){
                campos.push(`saldo = $${valores.length + 1}`)
                valores.push(saldo);
            }
            if(ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`)
                valores.push(ativo);
            }
            if(conta_padrao !== undefined){
                campos.push(`conta_padrao = $${valores.length + 1}`)
                valores.push(conta_padrao);
            }
            if(campos.length === 0){
                return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
            }

            //montamos a query dinamicamente
            const query = `UPDATE contas
                            SET ${campos.join(', ')}
                            WHERE id_conta = ${id_conta}
                            RETURNING *`
            console.log(query);
            
            //executando nossa query
            const conta = await BD.query(query, valores)

            //verifica se o usuario foi atualizado
            if(conta.rows.length === 0){
                return res.status(404).json({message: 'Usuário não encontrado'})
            }



            return res.status(200).json(conta.rows[0]);
        }
        catch(error){
            console.log(error.message);
            
            res.status(500).json({message: "Erro ao atualizar o usuário", error: error.message})
        }
    }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

        //atualizar todos os campos de local transação                
    static async atualizarTodasContas(req,res){ //TERMINAR DE ARRUMAR
        const {id_conta} = req.params;
        const {nome, tipo_conta, saldo, ativo, conta_padrao} = req.body;

    try{
        const conta = await BD.query ('UPDATE contas SET nome = $1 , tipo_conta = $2, saldo = $3, ativo = $4, conta_padrao = $5 WHERE id_conta = $6 RETURNING *',
            [nome, tipo_conta, saldo, ativo, conta_padrao] 
        )
        res.status(200).json(conta.rows)
    }catch(error){
        res.status(500).json({message: "Erro ao atualizar a conta", error: error.message})
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //deletar transação
    static async deletarConta(req, res) {
        const { id_conta } = req.params;
        try {
            const conta = await BD.query(`DELETE FROM contas WHERE id_conta = $1 RETURNING *`,
                [id_conta]);
            res.status(200).json(conta.rows); //retorna o usuario criado com status 201
        } catch (error) {
            console.error('Erro ao deletar a conta', error);
            res.status(500).json({ message: 'Erro ao deletar conta', error: error.message });
        }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    static async filtrarNome (req, res){
        const { nome } = req.query;

        try{
            const query = `
            SELECT * FROM contas
            WHERE nome = $1 LIKE ativo = true
            ORDER BY nome DESC
            `
            const valores = [ `%${nome}%`]
            const resposta = await BD.query(query, valores)
            return res.status(200).json(resposta.rows)

    }catch(error){
        console.error('Erro ao filtrar categoria', error);
        res.status(500).json({message: "Erro ao filtrar categoria", error: error.message})
    }
}

}

export default rotasContas;