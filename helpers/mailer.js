const nodemailer = require("nodemailer");
const conf = require("./configuracaoEmail")

const transporter = nodemailer.createTransport({
  service: conf.service,
  auth: {
    user: conf.user,
    pass: conf.pass,
  },
});

module.exports = transporter;
