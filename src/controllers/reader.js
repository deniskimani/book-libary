const { Reader } = require("../models");

exports.create = async (req, res) => {
  const reader = req.body;
  const validate = (email) => {
    return String(reader.email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (
    reader.password.length >= 8 &&
    !reader.name === false &&
    !reader.email === false &&
    validate() !== null
  ) {
    const newReader = await Reader.create(reader);

    res.status(201).json(newReader);
  }

  if (
    reader.password.length < 8
    // !reader.name === false &&
    // !reader.email === false
  ) {
    res.status(400).json({ message: "Password must be 8 characters or more" });
  }
  if (validate() === null && !reader.email === false) {
    res
      .status(400)
      .json({ message: "Please check if your email format is correct" });
  }
  if (!reader.email === true || !reader.name === true) {
    res.status(400).json({ message: "Name and email fields cannot be empty" });
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
