const { Book } = require("../models");

exports.createBook = async (req, res) => {
  try {
    const book = req.body;
    const newBook = await Book.create(book);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.readAll = async (req, res) => {
  const book = await Book.findAll();
  res.status(200).json(book);
};

exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    // console.log(`ID from getBook ${bookId}`);
    const book = await Book.findByPk(bookId);

    if (book === null) {
      return res.status(404).json({ error: `The book could not be found.` });
    } else {
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    // console.log(`ID from updateBook ${bookId}`);
    const updateData = {
      author: req.body.author,
    };
    const [updatedRows] = await Book.update(updateData, {
      where: { id: bookId },
    });
    if (!updatedRows) {
      return res.status(404).json({ error: `The book could not be found.` });
    }
    res.status(200).json(updatedRows);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedRows = await Book.destroy({ where: { id: bookId } });
    if (!deletedRows) {
      return res.status(404).json({ error: `The book could not be found.` });
    }
    res.status(204).json(deletedRows);
  } catch (error) {
    res.status(500).json(error);
  }
};
