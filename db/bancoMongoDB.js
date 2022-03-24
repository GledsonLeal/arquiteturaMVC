const mongo = require('mongoose')

mongo.Promise = global.Promise

mongo.connect("mongodb://localhost/mvcmongo",{
    //useMongoClient: true
}).then(()=>{
    console.log('********* Conectado ao Banco de Dados NoSQL MongoDB ****************')
    console.log('http://localhost:3000')
}).catch((erro)=>{
    console.log("Erro ao conectar ao MongoDB"+erro)
})

module.exports = mongo