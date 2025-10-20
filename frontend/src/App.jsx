// frontend/src/App.jsx

import React, { useState } from 'react';
import './App.css';
import Eventos from './Eventos.jsx';
import Participantes from './Participantes.jsx';
import Inscricoes from './Inscricoes.jsx';
import Login from './Login.jsx'; // 1. Importa a nova tela de Login

function App() {
  const [view, setView] = useState('eventos');
  // 2. Novo estado para controlar o usuário logado. 'null' = ninguém logado.
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null); // Simplesmente limpa o estado do usuário
  };

  // 3. Se não há usuário logado, mostra apenas o componente de Login
  if (!user) {
    // A função setUser é passada para o componente Login
    return <Login onLoginSuccess={setUser} />;
  }

  // 4. Se há um usuário logado, mostra o painel principal
  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Bem-vindo(a), {user.nome}!</h2>
        <button onClick={handleLogout} className="delete-button">Logout</button>
      </header>
      
      <h1>Gestão de Eventos da Escola</h1>
      
      <nav style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button className="action-button" onClick={() => setView('eventos')}>Gerenciar Eventos</button>
        <button className="action-button" onClick={() => setView('participantes')}>Gerenciar Participantes</button>
        <button className="action-button" onClick={() => setView('inscricoes')}>Realizar Inscrição</button>
      </nav>
      
      {view === 'eventos' && <Eventos />}
      {view === 'participantes' && <Participantes />}
      {view === 'inscricoes' && <Inscricoes />}
    </div>
  );
}

export default App;