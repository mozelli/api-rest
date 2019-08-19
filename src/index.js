const express = require('express');
const app = express();
const config = require('../config/config');
const mongoose = require('mongoose');

// Tenta conectar ao bando de dados.
// Caso consiga, inicia o servidor.
// Caso não consiga, não inicia o servidor.
mongoose.connect(config.connectdb, { useNewUrlParser: true })
	.then(
		() => {
			console.log('Conectado ao banco de dados com sucesso!');
			
			const PORT = 3333;
			const routes = require('./routes');
			const cors = require('cors');
			
			app.use(express.json());
			app.use(express.urlencoded({ extended: false }));
			app.use(cors());
			app.use(routes);
			
			app.listen(PORT, console.log(`O servidor está rodando em http://localhost:${PORT}`));
		},
		(err) => {
			console.log('Um erro ocorreu ao tentar conectar ao banco de dados.');
			console.log('O servidor não pode ser iniciado.');
		}
	);