const express = require('express');
const router = express.Router();

// Middlewares
const Auth = require('../middlewares/auth');

// Controllers
const UserController = require('../controllers/UserController');

router.get('/user', UserController.getUsers);
router.get('/user/:id', UserController.getUserById);
router.post('/user/authenticate', UserController.authenticate);

// Rotas que requerem autenticação
router.post('/user', Auth, UserController.addNewUser);
router.put('/user/:id', Auth, UserController.updateUser);
router.delete('/user/:id', Auth, UserController.deleteUserById);

module.exports = router;