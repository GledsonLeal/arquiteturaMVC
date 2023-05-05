const multer = require('multer')



const storage = multer.diskStorage({
  filename: function(req, file, cb){
    let nome= Date.now()+"-"+file.originalname
    cb(null, nome)
  },
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      // Se o arquivo for uma imagem, salva na pasta public/images
      let path = "public/images"
      cb(null, path);
    } else {
      // Se o arquivo não for uma imagem, chama o callback com um erro
      cb(new Error('Tipo de arquivo inválido!'), null);
    }
  },
  //destination: function(req, file, cb){
  //  let path = "public/images"
  //  cb(null, path)
  //}
})

const upload = multer ({
  storage,
  fileFilter: function (req, file, cb) {
    cb(null, true);
}
})
// Middleware para capturar o erro de arquivo inválido
function handleInvalidFileError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    req.flash('error_msg', 'O arquivo enviado não é uma imagem válida.');
    res.locals.error_msg = req.flash('error_msg');
    res.render("administrador/registro")
    //res.status(400).send({ error: 'O arquivo enviado não é uma imagem válida.' });
  } else if (err) {
    req.flash('error_msg', 'O arquivo enviado não é uma imagem válida.');
    res.locals.error_msg = req.flash('error_msg');
    res.render("administrador/registro")
    //res.status(500).send({ error: 'Ocorreu um erro ao processar o arquivo enviado.' });
  } else {
    next();
  }
}

module.exports = {
    upload,
    handleInvalidFileError
}