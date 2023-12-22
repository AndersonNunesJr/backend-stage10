const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");


const UsersController = require("../controllers/UserController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const UsersAvatarController = require("../controllers/UserAvatarController");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const userController =  new UsersController();
const usersAvatarController = new UsersAvatarController();

usersRoutes.post("/",userController.create);
usersRoutes.put("/", ensureAuthenticated ,userController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"),usersAvatarController.update)


module.exports = usersRoutes;