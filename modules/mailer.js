const path = require('path');
const nodemailer = require('nodemailer');
const { host, port, user, pass } = require('../config/mail');
const handlebars = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
 	host,
  port,
  auth: { user, pass }
});

const handlebarsOptions = {
	viewEngine: {
		extName: '.html',
		defaultLayout: null,
		partialsDir: path.join('./src/resources/mail'),
		layoutsDir: path.join('./src/resources/mail'),
	},
	viewPath: path.join('./src/resources/mail'),
	extName: '.html'
};

transport.use('compile', handlebars(handlebarsOptions));

module.exports = transport;