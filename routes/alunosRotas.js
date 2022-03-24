const express = require('express');
const router = express.Router();

const AlunoController = require('../controllers/AlunoController')

const { usuarioAdmin } = require("../helpers/usuarioAdmin")//{ usuarioAdmin } este objeto está pegando somente a função usuarioAdmin


router.get('/formulario', AlunoController.formularioAluno)
router.get('/', AlunoController.listarAluno)
router.post('/cadastrarAluno', AlunoController.cadastrarAluno)
router.post('/deletarAluno', usuarioAdmin, AlunoController.deletarAluno)
router.post('/editarAluno', usuarioAdmin, AlunoController.updateAluno)
router.post('/editarAlunoPost',usuarioAdmin,  AlunoController.updateAlunoPost)

module.exports = router;
