// const { Book } = require("../models");
const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require("./helper");

exports.createBook = (req, res) => createItem(res, "book", req.body);

exports.readAll = (req, res) => getAllItems(res, "book");

exports.getBookById = (req, res) => getItemById(res, "book", req.params.id);

exports.updateBook = (req, res) =>
  updateItem(res, "book", req.body, req.params.id);

exports.deleteBook = (req, res) => deleteItem(res, "book", req.params.id);
