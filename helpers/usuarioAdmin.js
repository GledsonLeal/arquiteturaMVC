//HELPERS são pequenos códigos para axuliar em alguma permissão
// são pequenos middlewares

//const passport = require("passport")
//const{ autenticado } = require('../config/auth')
module.exports = {
    usuarioAdmin: (req, res, next)=>{
        if(req.isAuthenticated()){ //&& req.user.usuarioAdmin == 1){ 
            console.log(req.user.email)
            //console.log(getRoleName())
            //console.log(passport.serializeUser(admin))
            return next()
        }else{
            req.flash("error_msg", "Sem privilégios de administrador")
            res.redirect("/")
        }

    }
}