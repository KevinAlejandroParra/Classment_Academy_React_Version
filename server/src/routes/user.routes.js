const { Router } = require("express");
const UserController = require("../controllers/userController.js");

const userRoutes = Router();

//obtener todos los usuarios
userRoutes.get("/users", UserController.getUsers);

//filtrar por id
userRoutes.get("/users/:id", UserController.getUser);

//register
userRoutes.post("/users", UserController.createUser);

//update and delete
userRoutes.put("/users/:id", UserController.updateUser);
userRoutes.delete("/users/:id", UserController.deleteUser);

//login
userRoutes.post("/login", UserController.login);



module.exports = userRoutes;
