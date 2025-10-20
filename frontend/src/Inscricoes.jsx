// frontend/src/Inscricoes.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Algoritmo de Ordenação (Insertion Sort) ---
// Esta função implementa o requisito de ordenar a lista de eventos.
function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let current = array[i];
    let j = i - 1;
    // Compara os títulos dos eventos em minúsculas para ordenar corretamente
    while (j > -1 && current.titulo.toLowerCase() < array[j].titulo.toLowerCase()) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = current;
  }
  return array;
}
// ------------------------------------------------

function Inscricoes() {
  const [eventos, setEventos] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState('');
  const [selectedParticipante, setSelectedParticipante] = useState('');
  const [message, setMessage] = useState(''); // Para exibir mensagens de sucesso/erro

  useEffect(() => {
    // Busca eventos e participantes ao mesmo tempo
    const fetchData = async () => {
      try {
        const [eventosRes, participantesRes] = await axios.all([
          axios.get('http://127.0.0.1:5000/eventos'),
          axios.get('http://127.0.0.1:5000/participantes')
        ]);
        // Aplica o algoritmo de ordenação na lista de eventos
        const sortedEventos = insertionSort(eventosRes.data);
        setEventos(sortedEventos);
        setParticipantes(participantesRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados!", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(''); // Limpa a mensagem anterior

    if (!selectedEvento || !selectedParticipante) {
      setMessage('Por favor, selecione um evento e um participante.');
      return;
    }

    axios.post('http://127.0.0.1:5000/inscricoes', {
      id_evento: selectedEvento,
      id_participante: selectedParticipante
    })
    .then(response => {
      setMessage(response.data.mensagem); // Mensagem de sucesso
      alert(response.data.mensagem);
    })
    .catch(error => {
      // Se o backend retornar um erro (como 400), a mensagem estará em error.response.data
      if (error.response && error.response.data) {
        setMessage(error.response.data.mensagem); // Mensagem "Vagas Esgotadas!"
      } else {
        setMessage('Ocorreu um erro ao realizar a inscrição.');
      }
    });
  };

  return (
    <div>
      <h2>Realizar Inscrição</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <select value={selectedEvento} onChange={(e) => setSelectedEvento(e.target.value)} required>
          <option value="">Selecione um Evento</option>
          {eventos.map(evento => (
            <option key={evento.id_evento} value={evento.id_evento}>
              {evento.titulo}
            </option>
          ))}
        </select>

        <select value={selectedParticipante} onChange={(e) => setSelectedParticipante(e.target.value)} required>
          <option value="">Selecione um Participante</option>
          {participantes.map(p => (
            <option key={p.id_participante} value={p.id_participante}>
              {p.nome}
            </option>
          ))}
        </select>
        <button type="submit">Inscrever</button>
      </form>
      {/* Exibe a mensagem de feedback para o usuário */}
      {message && <p style={{ fontWeight: 'bold', marginTop: '1rem' }}>{message}</p>}
    </div>
  );
}

export default Inscricoes;