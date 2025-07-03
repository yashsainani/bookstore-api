const route = require("express").Router();

const { addBook, getBooksList, getBookById, updateBook, deleteBook, searchBook } = require("../controllers/booksController");

route.get("/", getBooksList);

route.get("/search", searchBook);

route.get("/:id", getBookById);

route.post("/", addBook);

route.put("/:id", updateBook);

route.delete("/:id", deleteBook);

module.exports = route