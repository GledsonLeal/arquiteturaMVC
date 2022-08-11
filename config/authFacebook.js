const mongoose = require("mongoose")// qualquer banco de dados
//model de administrador
require('../models/Admin')
const Admin = mongoose.model("admin")

const FacebookStrategy = require('passport-facebook').Strategy


module.exports = (passport)=>{
  passport.use(new FacebookStrategy({
    clientID        : "2055039021226946",
    clientSecret    : "a8b7a328256e15276d2471b9f0c840ac",
    callbackURL     : 'http://localhost:3000/administrador/facebook/callback',
    profileFields   : ['id', 'displayName', 'name', 'gender', 'picture.type(large)','email']

},// o facebook enviará de volta o token e o perfil
function(token, refreshToken, profile, done) {
        // encontre o usuário no banco de dados com base em seu id do facebook
        Admin.findOne({ 'uid' : profile.id }, function(err, user) {
            // se houver um erro, pare tudo e retorne isso
            // ou seja, um erro ao se conectar ao banco de dados
            if (err)
                return done(err);
            // se o usuário for encontrado, faça o login
            if (user) {
                console.log(user)
                return done(null, user); // usuário encontrado, retorne esse usuário
            } else {
                //se não for encontrado nenhum usuário com esse id do facebook, crie-o
                const newUser = new Admin();
                newUser.uid    = profile.id;                  
                newUser.token = token; // vamos salvar o token que o facebook fornece ao usuário                   
                newUser.nome  = profile.name.givenName + ' ' + profile.name.familyName; //veja o perfil do usuário do passport para ver como os nomes são retornados
                newUser.email = profile.emails[0].value; // o facebook pode retornar vários e-mails, então vamos pegar o primeiro
                newUser.gender = profile.gender
                newUser.pic = profile.photos[0].value
                //newUser.telephone = profile.telephone[0]
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });

    

}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    Admin.findById(id, function(err, user) {
        done(err, user);
    });
});

}