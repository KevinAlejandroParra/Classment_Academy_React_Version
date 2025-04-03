const { User } = require("../models");

class UserController {
    static async getUsers(req, res) {
        try {
            const page = req.query.page || 1;
            const limit = 10;
            const offset = (page - 1) * limit;

            const { rows, count } = await User.findAndCountAll({
                limit,
                offset,
            });

            res.status(200).json({
                success: true,
                data: rows,
                total: count,
                message: "usuarios obtenidos correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al obtener los usuarios",
            });
        }
    }

    static async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            res.status(200).json({
                success: true,
                data: user,
                message: "Usuario obtenido correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al obtener el usuario",
            });
        }
    }

    static async createUser(req, res) {
        try {
            const { user: userJSON } = req.body;
            
            // Validación adicional para la contraseña
            if (userJSON.user_password && userJSON.user_password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "La contraseña debe tener al menos 8 caracteres",
                });
            }

            const user = await User.create(userJSON);

            // Eliminar la contraseña de la respuesta
            const userResponse = user.toJSON();
            delete userResponse.user_password;

            res.status(201).json({
                success: true,
                data: userResponse,
                message: "Usuario creado correctamente",
            });
        } catch (error) {
            // Manejo específico para errores de validación de Sequelize
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => err.message);
                return res.status(400).json({
                    success: false,
                    data: validationErrors,
                    message: "Error de validación",
                });
            }

            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al crear el usuario",
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { user: userJSON } = req.body;

            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            // Validación adicional para la contraseña
            if (userJSON.user_password && userJSON.user_password.length < 8) {
                return res.status(400).json({
                    success: false,
                    message: "La contraseña debe tener al menos 8 caracteres",
                });
            }

            await user.update(userJSON);

            // Eliminar la contraseña de la respuesta
            const userResponse = user.toJSON();
            delete userResponse.user_password;

            res.status(200).json({
                success: true,
                data: userResponse,
                message: "Usuario actualizado correctamente",
            });
        } catch (error) {
            // Manejo específico para errores de validación de Sequelize
            if (error.name === 'SequelizeValidationError') {
                const validationErrors = error.errors.map(err => err.message);
                return res.status(400).json({
                    success: false,
                    data: validationErrors,
                    message: "Error de validación",
                });
            }

            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al actualizar el usuario",
            });
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Usuario no encontrado",
                });
            }

            await user.destroy();

            res.status(200).json({
                success: true,
                message: "Usuario eliminado correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error.message,
                message: "Error al eliminar el usuario",
            });
        }
    }
}

module.exports = UserController;