// frontend/src/Eventos.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventoForm from './EventoForm.jsx';
import Modal from './Modal.jsx';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inscritos, setInscritos] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para a busca

  const fetchEventos = () => {
    axios.get('http://127.0.0.1:5000/eventos')
      .then(response => setEventos(response.data))
      .catch(error => console.error("Houve um erro ao buscar os eventos!", error));
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja deletar este evento?')) {
      axios.delete(`http://127.0.0.1:5000/eventos/${id}`)
        .then(() => {
          alert('Evento deletado com sucesso!');
          fetchEventos();
        })
        .catch(error => console.error("Erro ao deletar evento!", error));
    }
  };
  
  const handleEditClick = (evento) => {
    setEditingEvent(evento);
    window.scrollTo(0, 0);
  };

  const handleSuccess = () => {
    setEditingEvent(null);
    fetchEventos();
  };
  
  const handleCancel = () => {
    setEditingEvent(null);
  };

  const handleVerInscritos = (evento) => {
    setSelectedEvent(evento);
    axios.get(`http://127.0.0.1:5000/eventos/${evento.id_evento}/inscritos`)
      .then(response => {
        setInscritos(response.data);
        setIsModalOpen(true);
      })
      .catch(error => console.error("Erro ao buscar inscritos!", error));
  };

  return (
    <div>
      <EventoForm 
        onSuccess={handleSuccess} 
        eventToEdit={editingEvent}
        onCancel={handleCancel}
      />
      <hr />
      <h2>Lista de Eventos</h2>
      
      <input 
        type="text" 
        placeholder="Buscar evento por título..." 
        style={{ width: '98%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="event-list">
        {eventos.filter(evento => 
          evento.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(evento => (
          <li key={evento.id_evento} className="event-card">
            <strong>{evento.titulo}</strong>
            <p><strong>Data:</strong> {new Date(evento.data_hora).toLocaleString('pt-BR')} | <strong>Vagas:</strong> {evento.vagas}</p>
            <p>{evento.descricao}</p>
            <div className="event-card-actions">
              <button className="action-button" onClick={() => handleEditClick(evento)}>Editar</button>
              <button className="delete-button" onClick={() => handleDelete(evento.id_evento)}>Deletar</button>
              <button className="action-button" onClick={() => handleVerInscritos(evento)}>Ver Inscritos</button>
            </div>
          </li>
        ))}
      </ul>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Inscritos em "${selectedEvent?.titulo}"`}>
        {inscritos.length > 0 ? (
          <ul>
            {inscritos.map(inscrito => (
              <li key={inscrito.email}>{inscrito.nome} ({inscrito.email})</li>
            ))}
          </ul>
        ) : (
          <p>Nenhum participante inscrito neste evento ainda.</p>
        )}
      </Modal>
    </div>
  );
}

export default Eventos;