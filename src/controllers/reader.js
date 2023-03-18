const {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
} = require("./helper");

exports.create = (req, res) => createItem(res, "reader", req.body);

exports.readAll = (req, res) => getAllItems(res, "reader");

exports.getReaderById = (req, res) => getItemById(res, "reader", req.params.id);

exports.updateReader = (req, res) =>
  updateItem(res, "reader", req.body, req.params.id);

exports.deleteReader = (req, res) => deleteItem(res, "reader", req.params.id);
