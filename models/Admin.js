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
        //required: true
    },
    pic: {
        type: String,
        required: true
    },
    uid: String, //Facebook id
    token: String,
    gender: String,
    //cell: String

    
})

mongoose.model("admin", Admin)
//admin = nome da minha collection
//Admin = nome do model