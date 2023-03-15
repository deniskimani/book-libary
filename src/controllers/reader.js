const { Reader } = require("../models");

exports.create = async (req, res) => {
  try {
    const reader = req.body;

    const newReader = await Reader.create(reader);
    res.status(201).json(newReader);
  } catch (error) {
    console.log(error.message);
    if (error.message === "notNull Violation: Reader.name cannot be null") {
      res
        .status(400)
        .json({ message: "Name and email fields cannot be empty" });
    }
    if (error.message === "notNull Violation: Reader.email cannot be null") {
      res
        .status(400)
        .json({ message: "Name and email fields cannot be empty" });
    }
    if (
      error.message === "Validation error: Validation isEmail on email failed"
    ) {
      res
        .status(400)
        .json({ message: "Please check if your email format is correct" });
    }
    if (
      error.message ===
      "Validation error: Password should be 8 or more characters"
    ) {
      res
        .status(400)
        .json({ message: "Password must be 8 characters or more" });
    }
  }
};

exports.readAll = async (req, res) => {
  const readers = await Reader.findAll();
  res.status(200).json(readers);
};

exports.getReaderById = async (req, res) => {
  const readerId = req.params.id;
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
