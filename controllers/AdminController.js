const mongoose = require('mongoose')
require('../models/Admin')
const Admin = mongoose.model('admin')
const bcrypt = require('bcryptjs')
const passport = require('passport')




module.exports = class AdminController{

    static inicialAdmin(req, res){
        
        res.render('administrador/inicialAdmin', {
            user: req.user // get the user out of session and pass to template
          })
        console.log(req.user)
    }
    static registroAdmin(req, res){
        res.render('administrador/registro')
    }
    static registroAdminPost(req, res){
        var erros = []
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
            erros.push({texto: "Nome inválido"})
        }
        if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
            erros.push({texto: "E-mail inválido"})
        }
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null || req.body.senha < 4){
            erros.push({texto: "Senha inválida ou senha com menos de 4 algarismos"})
        }
        if(req.body.senha != req.body.senha2){
            erros.push({texto: "Senhas diferentes. Tente novamente"})
        }
        if(erros.length > 0){
            res.render("administrador/listaAdmin", {erros: erros})
        }else{
            const admin = {
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
               }
               // npm install --save bcryptjs
               // depois precisa importar o bcryptjs
                /**
                *      HASH DE SENHA
                    senhas sem tratamento,
                    senhas criptografadas: pode ter reversão.
                            criptografia =====> descriptografia
                                Assimétrico: duas chaves, uma para criptografia e outra para descripografia
                                Simétrico: uma chave para criptografia e descriptografia.
                            hash: são algoritmos que não possibilitam o retorno da senha original
                */
                bcrypt.genSalt(10, (salt)=>{
                // o 10 representa 2 elevado a 10 = 1024. Vai gerar uma criptografia diferente.
                // o módulo bcrypt tem um módulo de comparação de senhas hash.
                // não é possível reverter um hash, mas é possível comparar 2 hash
                //IMPORTANTE!! DEPOIS DAQUI, DESENVOLVER O FORMULÁRIO DE LOGIN
                   bcrypt.hash(admin.senha, salt, (hash)=>{
                       admin.senha = hash
                       new Admin(admin).save().then(()=>{
                           req.flash("success_msg", "Administrador salvo com sucesso!")
                           res.redirect('/administrador/lista')
                       }).catch((erro)=>{
                            req.flash("error_msg", `Erro ao salvar: ${erro}`)
                            res.redirect('/administrador/lista')
                      })
                   })
               })
               //await Admin.create(admin)
               
                                
                
        }

    }
    static listarAdmin(req, res){
        Admin.find().then((admin)=>{
            res.render('administrador/listaAdmin', {admin: admin})
        })
        
    }
    static deletarAdmin(req, res){
        Admin.remove({_id: req.body.id}).then(()=>{
            req.flash("success_msg", `Administrador excuído com sucesso!`)
            res.redirect('/administrador/lista')
        }).catch((erro)=>{
            req.flash('error_msg', `Erro ao deletar administrador: ${erro}`)
            res.redirect('/administrador/lista')
        })
    }

    static updateAdmin(req, res){
        Admin.findOne({ _id:req.body.id }).then((admin)=>{
            res.render('administrador/editarAdmin',{admin: admin} )//renderizando uma view!!!!
        }).catch((erro)=>{
            req.flash("error_msg", "Admin inexistente.")
            res.redirect('/administrador')
        })
        //const id = req.params.id
        //const aluno = Aluno.findOne({where:{id: id}})
        //res.render('alunos/editarAluno',{aluno} )//renderizando uma view!!!!
    }
    static updateAdminPost(req, res){
        var erros = []
        if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null || req.body.senha < 4){
            erros.push({texto: "Senha inválida ou senha com menos de 4 algarismos"})
        }
        if(req.body.senha != req.body.senha2){
            erros.push({texto: "Senhas diferentes. Tente novamente"})
        }
        if(erros.length > 0){
            //req.flash("error_msg", `Erros: ${erros}`)
            //res.redirect('/administrador/lista')
            res.render("administrador/listaAdmin", {erros: erros})
        }else{
            const adminUpdate = {
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha
            }
            bcrypt.genSalt(10, (erro, salt)=>{
                bcrypt.hash(adminUpdate.senha, salt, (erro, hash)=>{
                    adminUpdate.senha = hash
                    Admin.updateOne({_id: req.body.id}, adminUpdate).then(()=>{
                        req.flash("success_msg", "Administrador editado com sucesso!")
                        res.redirect('/administrador/lista')
                    }).catch((erro)=>{
                         req.flash("error_msg", `Erro ao salvar: ${erro}`)
                         res.redirect('/administrador/lista')
                   })
                })
            })

        }
    }

    //##############################    LOGIN    ##################################
    static login(req, res){// formulário de login
        res.render('administrador/login')
    }
    //https://www.passportjs.org/
    //npm install --save passport-local
    //criar uma pasta, dentro da raiz do projeto, com nome de config.
    //      dentro da pasta config, criar o arquivo auth.js, arquivo de autenticação
    static loginPost(req, res, next){

            passport.authenticate("local",{
            successRedirect: '/administrador',// qual o caminho quaso ocorrer a autenticação
            failureRedirect: '/administrador/login',// caminho de erro
            failureFlash: true,// habilitando as mensagens de flash do conect flash
            //if(failureRedirect){ req.flash('error_msg', "email ou senha incorretos")}
        })(req, res, next)
    }
    //##############################    LOGOUT    ##################################
    static sair(req, res){
        req.logout()
        req.flash('success_msg', 'Administrador deslogado')
        res.redirect('/')
    }
//##################################    FACEBOOK ###################################
    //static authFacebook(req, res, next){
    //    passport.authenticate('facebook', {
    //        scope: ['public_profile', 'email']
    //    })(req, res, next)
    //}
    static authFacebookCallback(req, res, next){
        passport.authenticate('facebook',{
            successRedirect: '/administrador',// qual o caminho quaso ocorrer a autenticação
            failureRedirect: '/administrador/login',// caminho de erro
            failureFlash: true,// habilitando as mensagens de flash do conect flash
        })(req, res, next)
    }
}


