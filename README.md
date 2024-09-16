# CompassCar - Car Rental System API

## Descrição do Projeto

O **CompassCar** é uma API para gerenciamento de um sistema de locação de veículos. O projeto foi desenvolvido utilizando **Node.js** e **MySQL**, sem o uso de ORM. A API permite realizar operações de CRUD (Create, Read, Update, Delete) em carros e seus respectivos itens, com suporte a paginação e filtros opcionais.

---
### Funcionalidades:
- **Criar um novo carro** com marca, modelo, ano e itens.
- **Listar carros** com suporte a filtros e paginação.
- **Buscar carro por ID**.
- **Atualizar dados de um carro** e seus itens, com validações.
- **Excluir um carro** e seus itens associados.
- **Validações de duplicidade** e limitação de idade dos carros (máximo de 10 anos).

## Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **MySQL**
- **MySQL2**
- **dotenv**

## Estrutura de Pastas

📁 compasscar ├── 📁 src │ ├── 📁 controllers │ │ └── carController.js │ ├── 📁 routes │ │ └── carRoutes.js │ ├── 📁 config │ │ └── db.js │ └── app.js ├── .env ├── package.json ├── package-lock.json └── README.md


## Instalação e Execução Local

### 1. Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **MySQL** (ou MariaDB)
- **Git** (opcional, para clonar o repositório)
---
### 2. Clonando o Repositório

```bash
git clone https://github.com/SEU_USUARIO/compasscar.git
cd compasscar
```
---
### 3. Configuração do Banco de Dados MySQL

Certifique-se de que o MySQL está instalado e rodando.

Acesse o MySQL no terminal:

```bash
mysql -u root -p
```
---
### Crie o banco de dados `compasscar`

Acesse o MySQL no terminal e crie o banco de dados:

```sql
CREATE DATABASE compasscar;
USE compasscar;
```
---

### Crie as Tabelas Necessárias usando NodeJS

```
npm run migration
```

### Crie as Tabelas Necessárias usando SQL

Execute os seguintes comandos para criar as tabelas no banco de dados:

```sql
CREATE TABLE cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  brand VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year INT NOT NULL
);

CREATE TABLE cars_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  car_id INT,
  FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
```

---
### 4. Configuração das Variáveis de Ambiente

Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente para a conexão com o MySQL. Exemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=suasenha
DB_NAME=compasscar
PORT=3000
```
---
### 5. Instalação das Dependências

Execute o comando abaixo para instalar as dependências:

```bash
npm install
npm dev
```
---
### 7. Testar a API

Use **Postman** ou **Insomnia** para testar a API. Abaixo estão exemplos de requisições que você pode realizar:
---
### Exemplos de Requisições:

- **Criar Carro (POST)**: `http://localhost:3000/api/v1/cars`
  
  ```json
  {
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "items": ["Air Conditioning", "Bluetooth"]
  }

### Listar Carros com Paginação (GET)
GET http://localhost:3000/api/v1/cars?page=1&limit=5

---
### Buscar carro por ID (GET)
GET `http://localhost:3000/api/v1/cars/:id`

---

### Atualizar Carro (PATCH)
PATCH http://localhost:3000/api/v1/cars/:id

### Exemplo de corpo da requisição (JSON):

```json
{
  "brand": "Chevrolet",
  "model": "Onix",
  "year": 2021,
  "items": ["Leather Seats", "Cruise Control"]
}
```
### Excluir Carro (DELETE)

DELETE `http://localhost:3000/api/v1/cars/:id`

---

### Executar o Servidor

Para iniciar o servidor, execute o comando:

```bash
npm start
```

**O servidor estará rodando na porta especificada no arquivo .env (por padrão, localhost:3000).**

## Conclusão

Este projeto foi desenvolvido como parte do meu estágio na **Compass.UOL**, com o objetivo de criar uma API eficiente para o gerenciamento de locação de veículos. Através desse projeto, aprendi e apliquei conceitos fundamentais de desenvolvimento backend, incluindo a criação de endpoints RESTful, validação de dados, uso de banco de dados MySQL sem ORM, e boas práticas de versionamento e documentação.

O projeto **CompassCar** não só atendeu aos requisitos funcionais propostos, como também proporcionou uma valiosa experiência em ambientes de desenvolvimento colaborativo e orientado a performance, além de aprimorar minhas habilidades em **Node.js**, **Express**, e **SQL**.

Agradeço à equipe da Compass.UOL pela oportunidade de contribuir para este projeto e pelo suporte ao longo do projeto.

---

### Autor

**Iris Almeida Medeiros**  
Desenvolvedora de software e estudante de Sistemas para a Internet no Senac.

---

### Contato

- [LinkedIn](https://www.linkedin.com/in/irisalmeidamedeiros/)
- [GitHub](https://github.com/irixalmeida)
