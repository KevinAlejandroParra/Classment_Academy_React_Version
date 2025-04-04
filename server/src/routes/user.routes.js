const { Router } = require("express");
const UserController = require("../controllers/userController.js");

const userRoutes = Router();

userRoutes.get("/users", UserController.getUsers);
userRoutes.get("/users/:id", UserController.getUser);
userRoutes.post("/users", UserController.createUser);
userRoutes.put("/users/:id", UserController.updateUser);
userRoutes.delete("/users/:id", UserController.deleteUser);
userRoutes.post("/login", UserController.login);



module.exports = userRoutes;
