import { BD } from '../db.js'
import bcrypt from 'bcrypt'

class rotasUsuarios{
    static async novoUsuario(req, res){ //CERTO
        const { nome, email, senha, tipo_acesso } = req.body;
        
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds)
        try{
            const usuario = await BD.query(`
                INSERT INTO usuarios (nome, email, senha, tipo_acesso)
                VALUES ($1, $2, $3, $4)`,
                [nome, email, senhaCriptografada, tipo_acesso])

            res.status(201).json("Usuario Cadastrado")
        }catch(error){
            console.error("Erro ao criar usuario")
            res.status(500).json({message: 'Erro ao criar', error: error.message})
        }
    }
    //consulta por id
    static async listarUsuariosPorID(req, res) {  //CERTO
        const { id_usuario } = req.params;
        
        try{
            const usuario = await BD.query('SELECT * FROM usuarios WHERE id_usuario = $1', [id_usuario]);
            res.status(200).json(usuario);
        }catch(error){
            res.status(500).json({message: "Erro ao consultar o usuario", error: error.message});
        }
    }
        //função para listar (GET) todos os usuarios
        static async listarUsuarios(req,res){  //CERTO
            try{
                const usuarios = await BD.query('SELECT * FROM usuarios WHERE ativo = true'); 
                res.status(200).json(usuarios); //retorna a lista de usuarios.
            }catch(error){
                res.status(500).json({message:'Erro ao listar os usuários', error: error.message})
            }
        }
    
    
        //deletar 
        static async deletar(req, res) {  //CERTOOO
            const { id_usuario } =req.params;
            try{
                const usuario = await BD.query('UPDATE usuarios set ativo = false WHERE id_usuario = $1', [id_usuario])
                return res.status(200).json({message: "Usuario desativado com sucesso"})
            }catch(error){
                res.status(500).json({message: "Erro ao desativar usuario", error: error.mensage})
            }
        }
    
    
    
    
        //função atualizar
        static async atualizarTodos(req,res){
            const {id_usuario} = req.params;
            const {nome, email, senha, tipo_acesso} = req.body;
    
            try{
                const usuario = await BD.query ('UPDATE usuarios SET nome = $1, email = $2, senha = $3, tipo_acesso = $4 WHERE id_usuario = $5 RETURNING *',
                    [nome, email, senha, tipo_acesso, id_usuario] //comando SQL para atualizar o usuario
                )
                res.status(200).json(usuario.rows)
            }catch(error){
                res.status(500).json({message: "Erro ao atualizar o usuario", error: error.menssage})
            }
        }
    
    
        //função atualizar os valores individualmente caso necessario
        static async atualizar(req, res){ //CERTO
            const {id_usuario} = req.params;
            const {nome, email, senha, tipo_acesso} = req.body;
            
            try{
                //inicializar arrays(vetores) para armazenar os campos e valores a serem atualizados
                const campos = [];
                const valores = [];
    
                //verificar quais campos foram fornecidos
                if (nome !== undefined){
                    campos.push(`nome = $${valores.length + 1}`) //Usa o tamanho da array para determinar o campo
                    valores.push(nome);
                }
                if(email !== undefined){
                    campos.push(`email = $${valores.length + 1}`)
                    valores.push(email);
                }
                if(senha !== undefined){
                    campos.push(`senha = $${valores.length + 1}`)
                    valores.push(senha);
                }
                if(tipo_acesso !== undefined){
                    campos.push(`tipo_acesso = $${valores.length + 1}`)
                    valores.push(tipo_acesso);
                }
                if(campos.length === 0){
                    return res.status(400).json({message: 'Nenhum campo fornecido para atualização'})
                }
    
                //montamos a query dinamicamente
                const query = `UPDATE usuarios
                                SET ${campos.join(', ')}
                                WHERE id_usuario = ${id_usuario}
                                RETURNING *`
                console.log(query);
                
                //executando nossa query
                const usuario = await BD.query(query, valores)
    
                //verifica se o usuario foi atualizado
                if(usuario.rows.length === 0){
                    return res.status(404).json({message: 'Usuário não encontrado'})
                }
    
    
    
                return res.status(200).json(usuario.rows[0]);
            }
            catch(error){
                console.log(error.message);
                
                res.status(500).json({message: "Erro ao atualizar o usuário", error: error.message})
            }
        }

        static async login(req, res){ //CERTO
            const {email, senha} = req.body;
            
            try{
                const resultado = await BD.query(
                    `SELECT id_usuario, nome, email, senha, tipo_acesso
                    FROM usuarios
                    WHERE email = $1`,
                    [email]
                );
                if(resultado.rows.length === 0){
                    return res.status(401).json({message: 'Email ou senha inválidos'})
                }
                const usuario = resultado.rows[0];
                const senhaValida = await bcrypt.compare(senha, usuario.senha)
    
                if(!senhaValida){
                    return res.status(401).json('Email ou senha inválidos')
                }
                //Gerar um novo token para o usuario
                // const token = jwt.sign(
                //     //payload
                //     {id: usuario.id_usuario, nome: usuario.nome, email: usuario.email, senha: usuario.senha, acesso: usuario.tipo_acesso},
                //     //signature
                //     SECRET_KEY,
                //     {expiresIn: '1h'}
                // )
                return res.status(200).json({message: 'Login realizado com sucesso'})
                // return res.status(200).json({message: 'Login realizado com sucesso', usuario})
            }
            catch(error){
                console.error('Erro ao realizar login:', error)
                return res.status(500).json({message: 'Erro ao realizar login', erro: error.message})
            }
    }
}

export default rotasUsuarios;