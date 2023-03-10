const { Reader } = require("../models");

exports.create = async (req, res) => {
  const reader = req.body;

  console.log(reader);
  const newReader = await Reader.create(reader);

  res.status(201).json(newReader);
};
