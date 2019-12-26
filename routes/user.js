const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

router.get('/', isAuth, userController.getUsers);

router.get('/:userId/todos', isAuth, userController.getUserTodos);
router.patch('/:userId/todos', isAuth, userController.editUserTodos);

module.exports = router;