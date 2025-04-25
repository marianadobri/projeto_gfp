import {BD} from '../db.js';

class rotasTransacoes {
    //nova Transação
    static async novaTransacoes(req, res) {
        const { id_usuario, id_categoria, id_subcategoria, valor            } = req.body;
        try {
            const transacao = await BD.query(`INSERT INTO transacoes (id_usuario, id_categoria, id_subcategoria, valor)
                    VALUES ($1, $2, $3, $4)`,
                [id_usuario, id_categoria, id_subcategoria, valor]);                
            res.status(201).json(transacao); //retorna o usuario criado com status 201
        }
        catch (error) {
            console.error('Erro ao criar a transação', error);
            res.status(500).json({ message: 'Erro ao criar transação', error: error.message });
        }
    }

    //listar transações
    static async listarTransacoes(req, res) {
        try {
            const transacoes = await BD.query('SELECT * FROM transacoes');
            res.status(200).json(transacoes.rows); //retorna os produtos com status 200
        }
        catch (error) {
            res.status(500).json({ message: 'Erro ao listar transações', error: error.message });
        }
    }

    //listar transações por id
    static async listarTransacoesPorID(req, res) {
        const { id_transacao } = req.params;
        try {  
            const transacao = await BD.query('SELECT * FROM transacoes WHERE id_transacao = $1', [id_transacao]);
            res.status(200).json(transacao.rows);
        }
        catch (error) {
            res.status(500).json({ message: "Erro ao consultar a transação", error: error.message });
        }
    }

    //atualizar transações
    static async atualizarTransacoes(req, res) {
        const { id_transacao } = req.params;
        const { id_usuario, id_categoria, id_subcategoria, valor} = req.body;
        try {
            const transacao = await BD.query(`UPDATE transacoes SET id_usuario = $1, id_categoria
    = $2, id_subcategoria = $3, valor = $4 WHERE id_transacao = $5`,
                [id_usuario, id_categoria, id_subcategoria, valor, id_transacao]);
            res.status(200).json(transacao.rows); //retorna o usuario criado com status 201
        }  
        catch (error) {
            console.error('Erro ao atualizar a transação', error);
            res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
        }        
    }

    //atualizar todos os campos da transação
    static async atualizarTodosTransacoes(req, res) {
        const { id_transacao } = req.params;
        const { id_usuario, id_categoria, id_subcategoria, valor} = req.body;
        try {
            const transacao = await BD.query(`UPDATE transacoes SET id_usuario = $1, id_categoria
    = $2, id_subcategoria = $3, valor = $4 WHERE id_transacao = $5`,
                [id_usuario, id_categoria, id_subcategoria, valor, id_transacao]);
            res.status(200).json(transacao.rows); //retorna o usuario criado com status 201
        }  
        catch (error) {
            console.error('Erro ao atualizar a transação', error);
            res.status(500).json({ message: 'Erro ao atualizar transação', error: error.message });
        }        
    }

    //deletar transações
    static async deletarTransacoes(req, res) {
        const { id_transacao } = req.params;
        try {
            const transacao = await BD.query('DELETE FROM transacoes WHERE id_transacao = $1', [id_transacao]);
            if (transacao.rowCount === 0) {
                return res.status(404).json({ message: 'Transação não encontrada' });
            }
            res.status(200).json({ message: 'Transação deletada com sucesso' });
        }
        catch (error) {
            console.error('Erro ao deletar a transação', error);
            res.status(500).json({ message: 'Erro ao deletar transação', error: error.message });      
        }
}

}

export default rotasTransacoes;