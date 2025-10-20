// frontend/src/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';

// O componente recebe uma função onLoginSuccess para avisar o App.jsx que o login foi bem-sucedido
function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    axios.post('http://127.0.0.1:5000/login', { email, senha })
      .then(response => {
        // Se o login for bem-sucedido, chama a função passada pelo App.jsx
        // e entrega os dados do usuário
        onLoginSuccess(response.data);
      })
      .catch(err => {
        if (err.response && err.response.data) {
          setError(err.response.data.mensagem);
        } else {
          setError('Ocorreu um erro ao tentar fazer login.');
        }
      });
  };

  return (
    <div className="form-container" style={{ maxWidth: '400px', margin: '5rem auto' }}>
      <h2>Acesso ao Sistema</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Email" 
          required 
        />
        <input 
          type="password" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
          placeholder="Senha" 
          required 
        />
        <button type="submit">Entrar</button>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;