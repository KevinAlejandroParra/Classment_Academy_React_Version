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
                data: error,
                message: "Error al obtener los usuarios",
            });
        }
    }

    static async getUser(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findByPk(userId);

            if (!user) throw new Error("Usuario no encontrado.");

            res.status(200).json({
                success: true,
                data: user,
                message: "Usuario obtenido correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error,
                message: "Error al obtener el usuario",
            });
        }
    }

    static async createUser(req, res) {
        try {
            const { user: userJSON } = req.body;

            const user = await User.create(userJSON);

            res.status(200).json({
                success: true,
                data: user,
                message: "Usuario creado correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error,
                message: "Error al crear el usuario",
            });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { user: userJSON } = req.body;

            const user = await User.findByPk(userId);

            if (!user) throw new Error("Usuario no encontrado.");

            await user.update(userJSON);

            res.status(200).json({
                success: true,
                data: user,
                message: "Usuario actualizado correctamente",
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: error,
                message: "Error al actualizar el usuario",
            });
        }
    }
}
module.exports = UserController;
