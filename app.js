const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')//sistema de login
require('./config/auth')(passport)//sistema de login
require('./config/authFacebook')(passport)//login com facebook
const session = require('express-session')
const flash = require('connect-flash')
const app = express();


//sessão
app.use(session({
  secret: "umasenha",//chave de acesso
  resave: true,
  saveUninitialized: true,
  cookie: {
    //secure: true,
    // A sessão expira após 1 minuto de inatividade.
    expires: 60000// e um minuto 
  }
}))
//                  primeiro configura a sessão
//                  depois configura o passport
//                  depois configura o flash
app.use(passport.initialize())//tem que ser abaixo da app.use(session)
app.use(passport.session())

app.use(flash())
//Middleware
app.use((req, res, next)=>{
  //declaração de variáveis globais
  res.locals.success_msg = req.flash('success_msg')// aqui são variáveis globais, criadas com res.locals e são visíveis dm qualquer parte do projeto
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash("error")
  res.locals.user = req.user || null // req.user criado pelo passport que armazena dados do usuário logado
                                      // caso não exista usuário logado, será repassado o valor null
  next()
})

const alunosRotas = require('./routes/alunosRotas');
const adminRotas = require('./routes/adminRotas');



//const conexao = require('./db/bancoMysql')

//const Aluno = require('./models/Aluno')


var hbs = require('hbs');// LINHA ADICIONAL
hbs.registerPartials(path.join(__dirname + '/views/partials'));// LINHA ADICIONAL




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/alunos', alunosRotas);
app.use('/administrador', adminRotas);

app.get('/', (req, res)=>{
  res.render('index')
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
