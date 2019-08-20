const path = require('path');
const User = require('../models/UserModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mailer = require('../../modules/mailer');

module.exports = {
	async recoverPassword(request, response) {
		const { email } = request.body;

		await User.findOne({email: email}, (err, user) => {
			if(err) {
				// Retorna um objeto com o erro.
				response.json({_id: 0, name: err.name});
			}
			else {
				const token = crypto.randomBytes(20).toString('hex');
				const now = new Date();
				now.setHours(now.getHours() + 1);

				user.passwordResetToken = token;
				user.passwordResetExpires = now;
				
				user.save((err, user) => {
					if(err) {
						// Retorna um objeto com o erro.
						response.json({_id: 0, name: err.name});

					}
					else {
						mailer.sendMail({
							to: email,
							from: "joaomozelli@hotmail.com",
							template: "/auth/recover_password",
							context: { token, user }

						}, (err) => {
							if (err) {
								return response.status(400).json({ _id: 0, name: err });
							}
							else {
								return response.status(200).json({ ok: true });
							}
						});
					}
				});
			}
		});
	},

	async reset_password(request, response) {
		const { email, token, password } = request.body;

		try {
			const user = await User.findOne({email: email}).select('+passwordResetToken passwordResetExpires');

			if (!user) {
				return response.json({_id: 0, name: "User don't found."});
			}

			if (token !== user.passwordResetToken) {
				return response.status(400).json({ _id: 0, name: 'Invalid token.' });
			}

			const now = new Date();

			if (now > user.passwordResetExpires) {
				return response.status(400).json({ _id: 0, name: 'Token expired. Generate a new one.' });
			}

			user.password = await bcrypt.hash(password, 10);

			user.save((err, user) => {
				if(err) {
					// Retorna um objeto com o erro.
					response.json({_id: 0, name: err.name});
				}
				else {
					return response.json(user);
				}
			});
		} catch (err) {
			console.log(err);
		}
	}
}