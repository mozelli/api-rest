const express = require('express');
const router = express.Router();

// Middlewares
const Auth = require('../app/middlewares/auth');

// Controllers
const UserController = require('../app/controllers/UserController');
const MailController = require('../app/controllers/MailController');

router.post('/user', UserController.addNewUser);
router.get('/user', UserController.getUsers);
router.get('/user/:id', UserController.getUserById);
router.post('/user/authenticate', UserController.authenticate);
router.post('/recover_password', MailController.recoverPassword);
router.post('/reset_password', MailController.reset_password);

// Rotas que requerem autenticação
router.put('/user/:id', Auth, UserController.updateUser);
router.delete('/user/:id', Auth, UserController.deleteUserById);

module.exports = router;