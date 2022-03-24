const mongoose = require('mongoose')
require('../models/Aluno')
const Aluno = mongoose.model('alunos')

module.exports = class AlunoController{

    static  formularioAluno(req, res){
        res.render('alunos/formulario')
    }
    static listarAluno(req, res){
            Aluno.find().then((alunos)=>{
            res.render('alunos/listaAluno', {alunos: alunos})
        })
        
    }
    static cadastrarAluno(req, res){
                var erros = []
                if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                    erros.push({texto: "Nome inválido"})
                }
                if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
                    erros.push({texto: "E-mail inválido"})
                }
                if(erros.length > 0){
                    res.render("alunos/formulario", {erros: erros})
                }else{
                    const aluno = {
                        nome: req.body.nome,
                        email: req.body.email,
                        endereco: req.body.endereco,
                        cidade: req.body.cidade,
                        estado: req.body.estado,
                        cep: req.body.cep
                      }
                      new Aluno(aluno).save().then(()=>{
                        req.flash("success_msg", "Aluno salvo com sucesso!")
                        res.redirect('/alunos')
                      }).catch((erro)=>{
                        req.flash("error_msg", `Erro ao salvar: ${erro}`)
                        res.redirect('/alunos')
                      })
                                             
                                                     
                        
                }


                                                   
    }
    static updateAluno(req, res){
        Aluno.findOne({ _id:req.body.id }).then((aluno)=>{
            res.render('alunos/editarAluno',{aluno: aluno} )//renderizando uma view!!!!
        }).catch((erro)=>{
            req.flash("error_msg", "Aluno inexistente.")
            res.redirect('/alunos')
        })
       
    }
    static updateAlunoPost(req, res){
        const alunoUpdate = {
            nome : req.body.nome,
            email : req.body.email,
            endereco : req.body.endereco,
            cidade : req.body.cidade,
            estado : req.body.estado,
            cep : req.body.cep
        }
        Aluno.updateOne({_id: req.body.id}, alunoUpdate).then(()=>{
            req.flash("success_msg", "Aluno editado com sucesso!")
            res.redirect('/alunos')
        }).catch((erro)=>{
            req.flash("error_msg", `Erro ao editar: ${erro}`)
            res.redirect('/alunos')
        })        
    }

    /**
     * 
        Aluno.findOne({_id: req.body.id}).then((aluno)=>{
            aluno.nome = req.body.nome,
            aluno.email = req.body.email,
            aluno.endereco = req.body.endereco,
            aluno.cidade = req.body.cidade,
            aluno.estado = req.body.estado,
            aluno.cep = req.body.cep

            aluno.save().then(()=>{
                req.flash("success_msg", "Aluno editado com sucesso!")
                res.redirect('/alunos')
            }).catch((erro)=>{
                req.flash("error_msg", `Erro ao editar: ${erro}`)
                res.redirect('/alunos')
            })
        }).catch((erro)=>{
            req.flash("error_msg", `Aluno não encontrado: ${erro}`)
            res.redirect('/alunos')    
        })
     */



    static deletarAluno(req, res){
        Aluno.remove({_id: req.body.id}).then(()=>{
            req.flash("success_msg", `Aluno excuído com sucesso!`)
            res.redirect('/alunos')
        }).catch((erro)=>{
            req.flash('error_msg', `Erro ao deletar aluno: ${erro}`)
            res.redirect('/alunos')
        })
        
    }
}