const mysql = require('mysql2');

// Conectar ao banco de dados MySQL usando as variáveis de ambiente
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Script SQL para criar as tabelas
const createTables = `
  CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cars_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    car_id INT,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
  );
`;

// Executar o script de criação de tabelas
connection.query(createTables, (err, results) => {
  if (err) {
    console.error('Erro ao criar tabelas:', err);
    process.exit(1);
  }
  console.log('Tabelas criadas com sucesso!');
  connection.end(); // Fechar a conexão
});
