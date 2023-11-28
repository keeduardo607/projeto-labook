# Projeto Labook 🚀

O Labook é uma emocionante rede social criada com o objetivo de promover conexões e interações entre pessoas. Usuários registrados no aplicativo têm a capacidade de criar e curtir publicações, tornando-o um lugar perfeito para compartilhar ideias e se conectar com outras pessoas.

## Tecnologias Utilizadas 🛠️

Este projeto foi desenvolvido utilizando uma variedade de tecnologias e conceitos, incluindo:

- Node.js
- Typescript
- Express.js
- SQL e SQLite
- Knex.js
- Programação Orientada a Objetos (POO)
- Arquitetura em Camadas
- Geração de UUID
- Geração de Hashes
- Autenticação e Autorização
- Roteamento
- Postman (para testes de API)

O Labook utiliza um banco de dados SQL com SQLite para armazenar dados de usuários e publicações. A estrutura do banco de dados é projetada para garantir a eficiência e a escalabilidade do aplicativo.

## Endpoints 🌐

A API do Labook fornece vários endpoints para interagir com o sistema. Aqui estão alguns dos principais endpoints:

- `POST /signup`: Permite que os usuários se cadastrem no aplicativo.
- `POST /login`: Permite que os usuários façam login no aplicativo.
- `POST /create-post`: Cria uma nova publicação.
- `GET /get-posts`: Recupera todas as publicações disponíveis.
- `PUT /edit-post/:id`: Edita uma publicação existente.
- `DELETE /delete-post/:id`: Exclui uma publicação.
- `POST /like/:id`: Permite que os usuários curtam uma publicação.
- `POST /dislike/:id`: Permite que os usuários removam a curtida de uma publicação.

Para configurar o projeto em sua máquina local, siga os passos abaixo:

1. Clone o repositório:
git clone https://github.com/keeduardo607/projeto-labook.git

2. Instale as dependências do projeto:
cd projeto-labook
npm install

3. Inicie o servidor:
npm run start

## Documentação da API 📄
https://documenter.getpostman.com/view/28314885/2s9YXfcPbN#ba22f230-1415-4a90-a41e-339d438c694d