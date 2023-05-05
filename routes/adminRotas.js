const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController')

const passport = require('passport')

const { usuarioAdmin } = require("../helpers/usuarioAdmin")//{ usuarioAdmin } este objeto está pegando somente a função usuarioAdmin

const { upload, handleInvalidFileError } = require("../helpers/uploadFoto")

router.get('/', usuarioAdmin,   AdminController.inicialAdmin)
router.get('/registro', usuarioAdmin,    AdminController.registroAdmin)
router.post('/registroAdminPost', usuarioAdmin, upload.single("pic"), handleInvalidFileError,  AdminController.registroAdminPost)
router.get('/lista', usuarioAdmin,   AdminController.listarAdmin)
router.post('/deletarAdmin', usuarioAdmin, AdminController.deletarAdmin)
router.get('/login', AdminController.login)
router.post('/loginPost',  AdminController.loginPost)
//router.post('/',  AdminController.loginPost)
router.get('/sair', usuarioAdmin,  AdminController.sair)
router.post('/editarAdmin', usuarioAdmin,  AdminController.updateAdmin)
router.post('/editarAdminPost', usuarioAdmin,  AdminController.updateAdminPost)
//rotas facebook

router.get('/auth/facebook', passport.authenticate('facebook', 
{scope : 'email'}
));
router.get('/facebook/callback',      passport.authenticate('facebook', {
    successRedirect: '/administrador',// qual o caminho quaso ocorrer a autenticação
    failureRedirect: '/administrador/login',// caminho de erro
}));



module.exports = router;
