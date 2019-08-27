// Controller para manipulação de usuários no banco de dados (MongoDB).
const User = require('../models/UserModel');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../config/auth');

module.exports = {

	async authenticate(request, response) {
		// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNWMxNDYzNDdhZjk3MGUxMGFlYzZkYyIsImlhdCI6MTU2NjMxNTYxOSwiZXhwIjoxNTY2NDAyMDE5fQ.Pm5JcqQ45a_MoZZgTgEIOR0d-gXjN9tQ7OyLs8vD9iE

		const { email, password } = request.body;

		const user = await User.findOne({ email }).select('+password');

		if (!user) {
			return response.status(400).json({ _id: 0, name: 'User not found' });
		}

		if (!await bcript.compare(password, user.password)) {
			return response.status(400).json({ _id: 0, name: 'Error login' });
		}

		user.password = undefined;

		const token = jwt.sign(
			{ id: user.id },
			auth.secret,
			{ expiresIn: 86400 }
		);

		response.send({user, token});
	},

	// Cria um novo usuário no banco.
	async addNewUser(request, response) {
		const hash = await bcript.hash(request.body.password, 10);
		request.body.password = hash;

		await User.create(request.body, (err, user) => {
			if(err) {
				// Retorna um objeto com o erro.
				response.json({_id: 0, name: err.name});
			}
			else {
				const token = jwt.sign(
					{ id: user.id },
					auth.secret,
					{ expiresIn: 86400 }
				);
				// Retorna um objeto com o registro do novo usuário
				// e o token.
				user.password = undefined;
				response.json({user, token});
			}
		})

	},

	// Recupera os registros de todos os usuários cadastrados no banco.
	async getUsers(request, response) {
		await User.find((err, users) => {
			if(err) {
				// Retorna um objeto com o erro
				response.json({_id: 0, name: err.name});
			}
			else {
				// Retorna um objeto com os registros de todos os usuários.
				response.json(users);
			}
		})
	},

	// Recupera o registro de um usuário no banco pelo seu respectivo ID
	async getUserById(request, response) {
		await User.findById(request.params['id'], (err, user) => {
			if(err) {
				// Retorna um objeto com o erro.
				response.json({_id: 0, name: err.name});
			}
			else {
				// Retorna um objeto com o registro do usuário.
				response.json(user);
			}
		});
	},

	// Atualiza os dados do registro de um usuário no banco pelo seu
	// respectivo ID
	async updateUser(request, response) {
		await User.findById(request.params['id'], (err, user) => {
			if(err) {
				// Retorna um objeto com o erro.
				response.json({_id: 0, name: err.name});
			}
			else {
				user.name = request.body.name;
				user.email = request.body.email;
				user.password = request.body.password;

				user.save((err, user) => {
					if(err) {
						// Retorna um objeto com o erro.
						response.json({_id: 0, name: err.name});

					}
					else {
						// Retorna um objeto com o registro atualizado do usuário.
						response.json(user);
					}
				});
			}
		});
	},

	// Exclui o registro de um usuário do banco segundo seu
	// respectivo ID
	async deleteUserById(request, response) {
		await User.findByIdAndDelete(request.params['id'], (err, user) => {
			if(err) {
				// Retorna um objeto com o erro
				response.json({_id: 0, name: err.name});
			}
			else {
				// Retorna um objeto vazio.
				response.json({});
			}
		});
	}

}
