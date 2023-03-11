const { Reader } = require("../models");

exports.create = async (req, res) => {
  const reader = req.body;

  const newReader = await Reader.create(reader);

  res.status(201).json(newReader);
};

exports.readAll = async (req, res) => {
  const readers = await Reader.findAll();
  res.status(200).json(readers);
};

exports.getReaderById = async (req, res) => {
  const readerId = req.params.id;
  console.log(`ID from getReader ${readerId}`);
  const reader = await Reader.findByPk(readerId);

  if (reader === null) {
    return res.status(404).json({ error: `The reader could not be found.` });
  } else {
    res.status(200).json(reader);
  }
};

exports.updateReader = async (req, res) => {
  try {
    const readerId = req.params.id;
    console.log(`ID from update ${readerId}`);
    const updateData = {
      email: req.body.email,
    };
    const [updatedRows] = await Reader.update(updateData, {
      where: { id: readerId },
    });
    if (!updatedRows) {
      return res.status(404).json({ error: `The reader could not be found.` });
    }
    res.status(200).json(updatedRows);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteReader = async (req, res) => {
  try {
    const readerId = req.params.id;
    const deletedRows = await Reader.destroy({ where: { id: readerId } });
    if (!deletedRows) {
      return res.status(404).json({ error: `The reader could not be found.` });
    }
    res.status(204).json(deletedRows);
  } catch (error) {
    res.status(500).json(error);
  }
};
