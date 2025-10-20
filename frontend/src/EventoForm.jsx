// frontend/src/EventoForm.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// O formulário agora recebe o evento a ser editado (eventToEdit) e uma função para cancelar (onCancel)
function EventoForm({ onSuccess, eventToEdit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', data_hora: '', vagas: 0
  });

  // Este 'useEffect' observa a propriedade eventToEdit.
  // Se ela mudar (ou seja, se clicarmos em "Editar"), ele preenche o formulário.
  useEffect(() => {
    if (eventToEdit) {
      // Formata a data e hora para ser compatível com o input datetime-local
      const formattedDate = eventToEdit.data_hora ? new Date(eventToEdit.data_hora).toISOString().slice(0, 16) : '';
      setFormData({ ...eventToEdit, data_hora: formattedDate });
    } else {
      // Se não há evento para editar, limpa o formulário
      setFormData({ titulo: '', descricao: '', data_hora: '', vagas: 0 });
    }
  }, [eventToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Se temos um eventToEdit, fazemos um PUT (update). Senão, um POST (create).
    const request = eventToEdit
      ? axios.put(`http://127.0.0.1:5000/eventos/${eventToEdit.id_evento}`, formData)
      : axios.post('http://127.0.0.1:5000/eventos', formData);

    request
      .then(() => {
        alert(`Evento ${eventToEdit ? 'atualizado' : 'criado'} com sucesso!`);
        onSuccess(); // Recarrega a lista e limpa o formulário
      })
      .catch(error => console.error(`Erro ao ${eventToEdit ? 'atualizar' : 'criar'} evento!`, error));
  };

  return (
    <div className="form-container">
      {/* O título muda dependendo se estamos editando ou criando */}
      <h3>{eventToEdit ? 'Editar Evento' : 'Adicionar Novo Evento'}</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Título do Evento" required />
        <input type="text" name="descricao" value={formData.descricao} onChange={handleChange} placeholder="Descrição" />
        <input type="datetime-local" name="data_hora" value={formData.data_hora} onChange={handleChange} required />
        <input type="number" name="vagas" min="0" value={formData.vagas} onChange={handleChange} placeholder="Nº de Vagas" required />
        <button type="submit">{eventToEdit ? 'Salvar Alterações' : 'Salvar Evento'}</button>
        {/* O botão de cancelar só aparece se estivermos no modo de edição */}
        {eventToEdit && <button type="button" onClick={onCancel} className="action-button">Cancelar</button>}
      </form>
    </div>
  );
}

export default EventoForm;