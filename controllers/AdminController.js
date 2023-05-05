const mongoose = require('mongoose')
require('../models/Admin')
const Admin = mongoose.model('admin')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const logger = require('../helpers/logger')
const email = require("../helpers/configuracaoEmail")
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis"); 
const OAuth2 = google.auth.OAuth2;

module.exports = class AdminController{

    static inicialAdmin(req, res){
        
        res.render('administrador/inicialAdmin', {
            user: req.user // get the user out of session and pass to template
          })
        //console.log(req.user)
        logger.info(`: Usuario ${req.user.nome} autenticado no recurso /administrador/inicialAdmin`)
    }
    static registroAdmin(req, res){
        logger.info(`Usuario ${req.user.nome} autenticado no recurso /administrador/registro`)
        res.render('administrador/registro')
    }
    static registroAdminPost(req, res){
        logger.info(`Usuario ${req.user.nome} autenticado no recurso /administrador/registroAdminPost`)
        //const imagem = req.file.filename
        var erros = []
        if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null || req.body.nome.trim().length < 3){
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
        //if (!req.file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        //    erros.push({texto: "O arquivo enviado não é uma imagem válida!"})
        //}
        if(erros.length > 0){
            res.render("administrador/registro", {erros: erros})
        }
        else{
            const admin = {
                nome: req.body.nome,
                email: req.body.email,
                senha: req.body.senha,
                pic: req.file.filename
            }
               console.log(admin)
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
                bcrypt.genSalt(10, (erro, salt)=>{
                // o 10 representa 2 elevado a 10 = 1024. Vai gerar uma criptografia diferente.
                // o módulo bcrypt tem um módulo de comparação de senhas hash.
                // não é possível reverter um hash, mas é possível comparar 2 hash
                //IMPORTANTE!! DEPOIS DAQUI, DESENVOLVER O FORMULÁRIO DE LOGIN
                   bcrypt.hash(admin.senha, salt, (erro, hash)=>{
                       admin.senha = hash
                       console.log(`senha gerada: ${hash}`)
                       new Admin(admin).save().then(()=>{
                           req.flash("success_msg", "Administrador salvo com sucesso!")
                           res.redirect('/administrador/lista') 
                       }).catch((erro)=>{
                            req.flash("error_msg", `Erro ao salvar: ${erro}`)
                            res.redirect('/administrador/lista')
                      })
                   })
               })
               /*
               // configurar o transportador
               //https://www.freecodecamp.org/portuguese/news/como-usar-o-nodemailer-para-enviar-emails-do-seu-servidor-do-node-js/
               let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  type: 'OAuth2',
                  user: email.user,
                  pass: email.pass,
                  clientId: email.client_id,
                  clientSecret: email.client_secret,
                  project_id: email.project_id,
                  auth_uri: email.auth_uri,
                  token_uri: email.token_uri,
                  auth_provider_x509_cert_url: email.auth_provider_x509_cert_url,
                  redirect_uris: email.redirect_uris
                  //refreshToken: email.refreshToken
                }
              });;

                // configurar o email
                let mailOptions = {
                    from: email.user, // email do remetente
                    to: admin.email, // email do destinatário
                    subject: 'Novo administrador cadastrado', // assunto do email
                    text: 'Olá, um novo administrador foi cadastrado.', // texto do email
                    //attachments: [{
                    //    filename: 'imagem.jpg',
                    //    path: 'caminho/para/a/imagem.jpg'
                    //}]
                };

                // enviar o email
                transporter.sendMail(mailOptions, (erro, info) => {
                    if (erro) {
                        console.log(erro);
                    } else {
                        console.log('Email enviado: ' + info.response);
                    }
                });
               */
                      
             
        }

    }
    static listarAdmin(req, res){
        logger.info(`Usuario ${req.user.nome} autenticado no recurso /administrador/lista`)
        Admin.find().then((admin)=>{
            res.render('administrador/listaAdmin', {admin: admin})
        })
        
    }
     static async deletarAdmin(req, res){
        logger.info(`Usuario ${req.user.nome} autenticado no recurso /administrador/deletarAdmin`)
    
        Admin.findOne({_id: req.body.id}).then((admin) => {
            if (!admin) {
                req.flash('error_msg', 'Administrador não encontrado')
                return res.redirect('/administrador/listaAdmin')
            }
            
            if (admin.pic) {
                const photoPath = path.join(__dirname, '..', 'public', 'images', admin.pic)
                fs.unlink(photoPath, (err) => {
                    if (err) {
                        console.error(`Erro ao excluir a foto: ${err}`)
                    }
                })
            }
    
            Admin.deleteOne({_id: req.body.id}).then(()=>{
                req.flash("success_msg", `Administrador excluído com sucesso!`)
                //res.locals.success_msg = req.flash('success_msg');
                res.redirect('/administrador/lista')
            }).catch((erro)=>{
                req.flash('error_msg', `Erro ao deletar administrador: ${erro}`)
                res.render('/administrador/listaAdmin')
            })
        }).catch((erro) => {
            req.flash('error_msg', `Erro ao buscar administrador: ${erro}`)
            res.redirect('/administrador/lista')
        })
    }
    

    static updateAdmin(req, res){
        logger.info(`Usuario ${req.user.nome} autenticado no recurso /administrador/editarAdmin`)
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
        logger.info(`Usuario ${req.user.nome} autenticado no recurso /administrador/editarAdminPost`)
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
    static loginPost(req, res, next) {
        passport.authenticate("local", {
            successRedirect: '/administrador',
            failureRedirect: '/administrador/login',
            failureFlash: true,
            user: req.user
        })(req, res, next)
    }
    //##############################    LOGOUT    ##################################
    static sair(req, res){
        logger.info(`Usuario ${req.user.nome} deslogado`)
        req.logout()
        req.flash('success_msg', 'Administrador deslogado')
        res.redirect('/')
    }
//##################################    FACEBOOK ###################################
    /**
    static authFacebook(){
        passport.authenticate('facebook', 
            {scope : 'email'}
        )
    }
    static facebookCallback(){
        passport.authenticate('facebook', {
            successRedirect: '/administrador',// qual o caminho quaso ocorrer a autenticação
            failureRedirect: '/administrador/login',// caminho de erro
		})
    }
     */
    
    //static authFacebook(req, res, next){
    //    passport.authenticate('facebook', {
    //        scope: ['public_profile', 'email']
    //    })(req, res, next)
    //}
    /**
    static authFacebookCallback(req, res, next){
        passport.authenticate('facebook',{
            successRedirect: '/administrador',// qual o caminho quaso ocorrer a autenticação
            failureRedirect: '/administrador/login',// caminho de erro
            failureFlash: true,// habilitando as mensagens de flash do conect flash
        })(req, res, next)
    }
     */

}


