// frontend/src/Participantes.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ParticipanteForm from './ParticipanteForm.jsx';

function Participantes() {
  const [participantes, setParticipantes] = useState([]);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a busca

  const fetchParticipantes = () => {
    axios.get('http://127.0.0.1:5000/participantes')
      .then(response => setParticipantes(response.data))
      .catch(error => console.error("Erro ao buscar participantes!", error));
  };

  useEffect(() => {
    fetchParticipantes();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza?')) {
      axios.delete(`http://127.0.0.1:5000/participantes/${id}`)
        .then(() => {
          alert('Participante deletado!');
          fetchParticipantes();
        });
    }
  };
  
  const handleEditClick = (participante) => {
    setEditingParticipant(participante);
    window.scrollTo(0, 0);
  };

  const handleSuccess = () => {
    setEditingParticipant(null);
    fetchParticipantes();
  };
  
  const handleCancel = () => {
    setEditingParticipant(null);
  };

  return (
    <div>
      <ParticipanteForm 
        onSuccess={handleSuccess} 
        participantToEdit={editingParticipant}
        onCancel={handleCancel}
      />
      <hr />
      <h2>Lista de Participantes</h2>

      <input 
        type="text" 
        placeholder="Buscar por nome ou email..." 
        style={{ width: '98%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="event-list">
        {participantes.filter(p => 
          p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(p => (
          <li key={p.id_participante} className="event-card">
            <strong>{p.nome}</strong>
            <p>{p.email}</p>
            <div className="event-card-actions">
              <button className="action-button" onClick={() => handleEditClick(p)}>Editar</button>
              <button className="delete-button" onClick={() => handleDelete(p.id_participante)}>Deletar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Participantes;