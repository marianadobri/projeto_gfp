import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import '../styles/Login.css'
import { enderecoServidor } from "../utils"


function Login () {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate()
  const [lembrar, setLembrar] = useState (false);
  
  async function botaoEntrar(e) {
    e.preventDefault();

    try {
      if (email == '' || senha == '') {
        throw new Error('Preencha todos os campos')
      }
      //Autenticando utilizando a API de backend com o fetch
      const resposta = await fetch(`${enderecoServidor}/usuarios/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({
            email: email,
            senha: senha,
          })
        }
      )
      if (resposta.ok) {
        const dados = await resposta.json();
        
        localStorage.setItem('UsuarioLogado', JSON.stringify({...dados,lembrar}))
        navigate("/principal")
      }else {
        throw new Error('Email ou senha incorretos ❌');
      }

    }catch (error) {
      console.error('Erro ao realizar login:', error);
      alert(error.message);
      return;
    }
  }
  function botaoLimpar() {
    setEmail('');
    setSenha('');
    setMensagem('');
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <div>
          <div className="input-group">
            <label>Email</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="Digite seu email" required />
          </div>
          <div className="input-group">
            <label>Senha</label>
            <input onChange={(e) => setSenha(e.target.value)} value={senha} type="password" placeholder="Digite sua senha" required />
          </div>
          <div className={styles.between}>
            <div style={{display:'flex', alignItems: 'center'}}>
              <input type='checkbox' style={{marginRight: '5px'}}
                checked={lembrar} onChange={(e) => setLembrar(e.target.checked)}/>
              <label>Lembrar-me</label>
            </div>
            <a href="#" className={styles.forgotPassword}>Esqueceu a senha?</a>
          </div>
          <button onClick={botaoEntrar} type="submit" className="login-button">Entrar</button>
          <button onClick={botaoLimpar} type="submit" className="login-button">Limpar</button>
        </div>
      </div>
    </div>
  );
}

export default Login;

