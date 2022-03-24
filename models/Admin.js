const mongoose = require('../db/bancoMongoDB')
const Schema = mongoose.Schema

const Admin = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
})

mongoose.model("admin", Admin)
//admin = nome da minha collection
//Admin = nome do model