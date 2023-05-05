const {createLogger, format, transports} = require('winston')


module.exports = createLogger({
    format: format.combine(
        format.simple(),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)//consigo configurar a mensagem de saída no log
    ),
    transports: [        
        new transports.File({
            maxsize: 5120000,//tamanho do arquivo 5mb
            maxFiles: 5, // máximo 5 arquvios
            filename: `${__dirname}/../logs/log-api.log`//criando arquivo de log
        }),
        new transports.Console({
            level: 'debug'
            
        })
    ]
})