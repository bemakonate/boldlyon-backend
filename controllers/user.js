const User = require('../models/user');

exports.getUsers = (req, res, next) => {
    User.find()
        .select("-__v")
        .then(users => {
            const usersJSON = users.map(user => {
                return {
                    _id: user._id,
                    email: user.email,
                    password: user.password,
                    todos: user.todos.map(todo => {
                        return {
                            isCompleted: todo.isCompleted,
                            title: todo.title,
                        }
                    })
                }

            })
            res.status(200).json(usersJSON)
        })
        .catch(err => {
            next(err)
        })
}


exports.getUserTodos = (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .then(user => {
            if (user._id.toString() !== req.userId) {
                const err = new Error('Not authorized!')
                throw err;
            }
            const userTodos = user.todos.map(todo => {
                return {
                    isCompleted: todo.isCompleted,
                    title: todo.title,
                }
            })
            res.status(200).json(userTodos)
        })
        .catch(err => {
            next(err);
        })
}
exports.editUserTodos = (req, res, next) => {
    const userId = req.params.userId;
    const todos = req.body.todos;
    User.findById(userId)
        .then(user => {
            if (user._id.toString() !== req.userId) {
                const err = new Error('Not authorized!')
                throw err;
            }
            if (!user) {
                const err = new Error("The user doesn't exist");
                throw err;
            }
            if (!todos) {
                const err = new Error("Todos keyword must be defined");
                throw err;
            }
            user.todos = todos;
            return user.save()
        })
        .then(result => {
            res.status(200).json({
                message: "Updated todos successfully",
                result: result,
            })
        })
        .catch(err => {
            next(err);
        })
}