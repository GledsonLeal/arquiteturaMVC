const mongoose = require('../db/bancoMongoDB')
const Schema = mongoose.Schema


const Aluno = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    cidade: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    cep: {
        type: String,
        required: true
    }
})

//Aluno.sync({force: true})//depois de criar, comentar ou apagar
mongoose.model('alunos', Aluno)
//admin = nome da minha collection
//Admin = nome do model