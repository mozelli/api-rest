const jwt = require('jsonwebtoken');
const auth = require('../../config/auth');

module.exports = (request, response, next) => {
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		return response.status(401).json({ _id: 0, name: 'No token provided.' });
	}

	const parts = authHeader.split(' ');

	if (!parts.length === 2) {
		return response.status(401).json({ _id: 0, name: 'Token error.' });
	}

	const [ scheme, token ] = parts;

	if (!/^Bearer$/i.test(scheme)) {
		return response.status(401).json({ _id: 0, name: 'Bad formatted token.' });
	}

	jwt.verify(token, auth.secret, (err, decoded) => {
		if (err) {
			return response.status(401).json({ _id: 0, name: 'Invalid token.' })
		}

		//request.body.id = decoded.id;

		return next();
	})
}
