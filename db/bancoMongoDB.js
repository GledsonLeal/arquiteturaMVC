const mongo = require('mongoose')
const logger =require('../helpers/logger')

//mongo.Promise = global.Promise

mongo.connect("mongodb://localhost/mvcmongo",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('********* Conectado ao Banco de Dados NoSQL MongoDB ****************')
    logger.info(`servidor rodando: http://localhost:3006`)
}).catch((erro)=>{
    console.log("Erro ao conectar ao MongoDB"+erro)
})

module.exports = mongo