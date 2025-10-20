# /sistema/db.py
import sqlite3

def init_db():
    # Conecta ao banco de dados (cria o arquivo se não existir)
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # CAMINHO ABSOLUTO PARA O SEU ARQUIVO SQL
    # Substituímos o caminho antigo por este para garantir que o arquivo seja encontrado.
    caminho_do_arquivo_sql = r'C:\Users\aluno\Desktop\Atividade Remulo - 20.10.2025\sql\create_populate.sql'

    # Lê o arquivo SQL e executa no banco de dados
    try:
        with open(caminho_do_arquivo_sql, 'r', encoding='utf-8') as f:
            sql_script = f.read()
        
        cursor.executescript(sql_script)
        print("Banco de dados criado e populado com sucesso.")
        
    except Exception as e:
        print("Ocorreu um erro ao criar o banco de dados:")
        print(e)
    finally:
        conn.commit()
        conn.close()

if __name__ == '__main__':
    init_db()