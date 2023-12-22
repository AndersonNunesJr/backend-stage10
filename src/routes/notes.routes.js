const { Router } = require("express");

const NotesController = require("../controllers/NotesController")

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();

const notesController =  new NotesController();

notesRoutes.get("/:id",ensureAuthenticated,notesController.index);
notesRoutes.post("/:user_id",ensureAuthenticated,notesController.create);
notesRoutes.get("/", ensureAuthenticated, notesController.show);
notesRoutes.delete("/:id",ensureAuthenticated,notesController.delete);

module.exports = notesRoutes;