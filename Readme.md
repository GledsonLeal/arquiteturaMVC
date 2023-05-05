### Página
https://expressjs.com/pt-br/starter/generator.html
### Comandos para gerar a aplicação:
npm install express-generator
express --view=hbs
npm install
npm start


Pequena aplicação de cadastro exemplo com arquitetura MVC.

* Banco de dados MongoDB
* Passport com estratégia local
* Hash de senha
* Passport com autenticação pelo Facebook
* MVC com 2 caminhos de rotas
* Controle de acesso à rotas
* Aplicação de sessão
* Template engine HBS
* Framework front-end Bootstrap
* Framework express
* 

hash de senha:
npm i --save bcryptjs
npm i --save passport
npm i --save passport-local

mongoose:
npm i --save mongoose

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

Você pode criar relacionamentos entre documentos no MongoDB utilizando o Mongoose no Node.js de duas maneiras principais:

1. Referência (Reference): Neste tipo de relacionamento, você armazena apenas o ID de um documento em outro documento, criando uma referência entre os dois.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: String
});

const User = mongoose.model('User', userSchema);

const taskSchema = new Schema({
  title: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Task = mongoose.model('Task', taskSchema);


2. Embedding (Embedded): Neste tipo de relacionamento, você inclui um documento inteiro dentro de outro documento.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: String,
  user: {
    name: String,
    email: String
  }
});

const Task = mongoose.model('Task', taskSchema);


Ambos os tipos de relacionamentos têm suas vantagens e desvantagens. Referência é melhor para grandes quantidades de dados e escalabilidade, enquanto Embedding é melhor para consultas mais rápidas e dados relacionados fortemente.