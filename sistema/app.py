# /sistema/app.py - VERSÃO COMPLETA E FINAL
import sqlite3
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row 
    return conn

@app.route('/')
def index():
    return "Backend no ar!"

# ===============================================================
# CRUD Eventos
# ===============================================================
@app.route('/eventos', methods=['GET'])
def get_eventos():
    conn = get_db_connection()
    eventos_cursor = conn.execute('SELECT * FROM eventos ORDER BY titulo ASC').fetchall()
    conn.close()
    eventos = []
    for evento_row in eventos_cursor:
        eventos.append(dict(evento_row))
    return jsonify(eventos)

@app.route('/eventos', methods=['POST'])
def create_evento():
    dados = request.get_json()
    conn = get_db_connection()
    conn.execute('INSERT INTO eventos (titulo, descricao, data_hora, vagas) VALUES (?, ?, ?, ?)',
                 (dados['titulo'], dados['descricao'], dados['data_hora'], dados['vagas']))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Evento criado com sucesso!'}), 201

@app.route('/eventos/<int:id>', methods=['PUT'])
def update_evento(id):
    dados = request.get_json()
    conn = get_db_connection()
    conn.execute('UPDATE eventos SET titulo = ?, descricao = ?, data_hora = ?, vagas = ? WHERE id_evento = ?',
                 (dados['titulo'], dados['descricao'], dados['data_hora'], dados['vagas'], id))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Evento atualizado com sucesso!'})

@app.route('/eventos/<int:id>', methods=['DELETE'])
def delete_evento(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM eventos WHERE id_evento = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Evento deletado com sucesso!'})

# ===============================================================
# CRUD Participantes
# ===============================================================
@app.route('/participantes', methods=['GET'])
def get_participantes():
    conn = get_db_connection()
    participantes_cursor = conn.execute('SELECT * FROM participantes ORDER BY nome').fetchall()
    conn.close()
    participantes = []
    for participante_row in participantes_cursor:
        participantes.append(dict(participante_row))
    return jsonify(participantes)

@app.route('/participantes', methods=['POST'])
def create_participante():
    dados = request.get_json()
    conn = get_db_connection()
    conn.execute('INSERT INTO participantes (nome, email) VALUES (?, ?)',
                 (dados['nome'], dados['email']))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Participante criado com sucesso!'}), 201

@app.route('/participantes/<int:id>', methods=['PUT'])
def update_participante(id):
    dados = request.get_json()
    conn = get_db_connection()
    conn.execute('UPDATE participantes SET nome = ?, email = ? WHERE id_participante = ?',
                 (dados['nome'], dados['email'], id))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Participante atualizado com sucesso!'})

@app.route('/participantes/<int:id>', methods=['DELETE'])
def delete_participante(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM participantes WHERE id_participante = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'mensagem': 'Participante deletado com sucesso!'})

# ===============================================================
# ROTA PARA GESTÃO DE INSCRIÇÕES
# ===============================================================
@app.route('/inscricoes', methods=['POST'])
def create_inscricao():
    dados = request.get_json()
    id_evento = dados['id_evento']
    id_participante = dados['id_participante']

    conn = get_db_connection()
    
    evento = conn.execute('SELECT vagas FROM eventos WHERE id_evento = ?', (id_evento,)).fetchone()
    if evento is None:
        return jsonify({'mensagem': 'Evento não encontrado!'}), 404
    vagas_totais = evento['vagas']

    inscricoes_cursor = conn.execute('SELECT COUNT(*) FROM inscricoes WHERE id_evento = ?', (id_evento,)).fetchone()
    inscricoes_feitas = inscricoes_cursor[0]

    if inscricoes_feitas >= vagas_totais:
        conn.close()
        return jsonify({'mensagem': 'Vagas Esgotadas!'}), 400

    data_hora_agora = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    conn.execute(
        'INSERT INTO inscricoes (id_evento, id_participante, data_hora_inscricao) VALUES (?, ?, ?)',
        (id_evento, id_participante, data_hora_agora)
    )
    conn.commit()
    conn.close()

    return jsonify({'mensagem': 'Inscrição realizada com sucesso!'}), 201
# ===============================================================
# ROTA PARA LISTAR INSCRITOS DE UM EVENTO
# ===============================================================
@app.route('/eventos/<int:id>/inscritos', methods=['GET'])
def get_inscritos_evento(id):
    conn = get_db_connection()
    inscritos_cursor = conn.execute('''
        SELECT p.nome, p.email, i.data_hora_inscricao
        FROM participantes p
        JOIN inscricoes i ON p.id_participante = i.id_participante
        WHERE i.id_evento = ?
        ORDER BY p.nome
    ''', (id,)).fetchall()
    conn.close()
    
    inscritos = [dict(row) for row in inscritos_cursor]
    return jsonify(inscritos)

# ===============================================================
# ROTA PARA AUTENTICAÇÃO DE USUÁRIO
# ===============================================================
@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados['email']
    senha = dados['senha']

    conn = get_db_connection()
    usuario = conn.execute('SELECT * FROM usuarios WHERE email = ?', (email,)).fetchone()
    conn.close()

    # ATENÇÃO: Em um projeto real, NUNCA compare senhas em texto plano.
    # Você deveria comparar o hash da senha enviada com o hash salvo no banco.
    # Para este projeto escolar, a comparação direta é suficiente.
    if usuario and usuario['senha'] == senha:
        return jsonify({
            'id_usuario': usuario['id_usuario'],
            'nome': usuario['nome'],
            'email': usuario['email']
        })
    else:
        return jsonify({'mensagem': 'Email ou senha incorretos'}), 401

if __name__ == '__main__':
    app.run(debug=True)