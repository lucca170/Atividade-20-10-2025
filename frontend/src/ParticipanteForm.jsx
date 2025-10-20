// frontend/src/ParticipanteForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ParticipanteForm({ onSuccess, participantToEdit, onCancel }) {
  const [formData, setFormData] = useState({ nome: '', email: '' });

  useEffect(() => {
    if (participantToEdit) {
      setFormData(participantToEdit);
    } else {
      setFormData({ nome: '', email: '' });
    }
  }, [participantToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = participantToEdit
      ? axios.put(`http://127.0.0.1:5000/participantes/${participantToEdit.id_participante}`, formData)
      : axios.post('http://127.0.0.1:5000/participantes', formData);

    request
      .then(() => {
        alert(`Participante ${participantToEdit ? 'atualizado' : 'criado'} com sucesso!`);
        onSuccess();
      })
      .catch(error => console.error("Erro ao salvar participante!", error));
  };

  return (
    <div className="form-container">
      <h3>{participantToEdit ? 'Editar Participante' : 'Adicionar Novo Participante'}</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" value={formData.nome} onChange={handleChange} placeholder="Nome Completo" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <button type="submit">{participantToEdit ? 'Salvar Alterações' : 'Salvar Participante'}</button>
        {participantToEdit && <button type="button" onClick={onCancel} className="action-button">Cancelar</button>}
      </form>
    </div>
  );
}

export default ParticipanteForm;