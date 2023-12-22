const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class NotesController {
  async create(request, response) {
    const { title, description,rating, tags } = request.body;
    const { user_id } = request.params;
    const database = await sqliteConnection();
   
    const checkNotesExists = await database.get(
      "SELECT * FROM notes WHERE title = (?) AND user_id = (?)",
      [title, user_id]
    )

    if (checkNotesExists) {
      throw new AppError("Já existe uma observação sobre filme.");
    }
   
   const ratingMovies = rating;

   if(ratingMovies > 5 || ratingMovies < 1 ){
    throw new AppError("A nota deve ser de 1 a 5");
   }

    const [note_id] = await knex("notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        name,
        user_id,
      };
    });
    await knex("tags").insert(tagsInsert);

   return response.json();
  }

  async show(request, response) {

    const { title } = request.query;

    const notes = await knex("notes").where({ user_id: request.user.id });

    const filteredNotes = notes.filter(e => e.title.toLowerCase().includes(title.toLowerCase()))

    const tagsPromises = filteredNotes.map(note => {
      return knex("tags").where({ note_id: note.id }).orderBy("name");
    });
  
    const tagsArray = await Promise.all(tagsPromises);
  
    const notesWithTags = filteredNotes.map((note, index) => {
      return {
        ...note,
        tags: tagsArray[index]
      };
    });
  
    return response.json(notesWithTags);
  } 

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete();
    return response.json();
  }

  async index(request, response) {

      const { id } = request.params;
  
      const note = await knex("notes").where({ id }).first();
      const tags = await knex("tags").where({ note_id: id }).orderBy("name");
      return response.json({
        ...note,
        tags
      });
    }
}

module.exports = NotesController;
