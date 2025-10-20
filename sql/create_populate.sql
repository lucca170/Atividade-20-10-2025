-- /sql/create_populate.sql

-- Criação das Tabelas
CREATE TABLE usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE eventos (
    id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_hora DATETIME NOT NULL,
    vagas INTEGER NOT NULL CHECK(vagas >= 0)
);

CREATE TABLE participantes (
    id_participante INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE inscricoes (
    id_inscricao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_evento INTEGER NOT NULL,
    id_participante INTEGER NOT NULL,
    data_hora_inscricao DATETIME NOT NULL,
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_participante) REFERENCES participantes(id_participante) ON DELETE CASCADE
);

-- População com Dados Iniciais
-- (Para a senha 'admin123', um hash simples seria usado. Em um projeto real, use bcrypt)
INSERT INTO usuarios (nome, email, senha) VALUES ('Admin', 'admin@escola.com', 'senha_hash_exemplo');

INSERT INTO eventos (titulo, descricao, data_hora, vagas) VALUES
('Palestra de Robótica', 'Introdução à robótica com Arduino', '2025-11-10 15:00:00', 50),
('Oficina de Redação', 'Técnicas para o ENEM', '2025-11-12 09:00:00', 30),
('Feira de Ciências', 'Apresentação dos projetos dos alunos', '2025-11-15 10:00:00', 2),
('Workshop de Programação', 'Criando seu primeiro app com React', '2025-11-20 14:00:00', 1);

INSERT INTO participantes (nome, email) VALUES
('Carlos Silva', 'carlos.silva@email.com'),
('Mariana Costa', 'mariana.costa@email.com'),
('João Pereira', 'joao.pereira@email.com');

-- Inscrição de exemplo para a Feira de Ciências para testar o limite de vagas
INSERT INTO inscricoes (id_evento, id_participante, data_hora_inscricao) VALUES
(3, 1, '2025-10-19 10:30:00'),
(3, 2, '2025-10-19 11:00:00');