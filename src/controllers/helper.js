const { Book, Reader, Genre } = require("../models");

const getModel = (model) => {
  const models = {
    book: Book,
    reader: Reader,
    genre: Genre,
  };

  return models[model];
};

// const getOptions = (model) => {
//   if (model === "book") return { include: Genre };

//   if (model === "genre") return { include: Book };

//   return {};
// };

const removePassword = (obj) => {
  if (obj.hasOwnProperty("password")) {
    delete obj.password;
  }

  return obj;
};

const getAllItems = async (res, model) => {
  try {
    const Model = getModel(model);
    console.log(Model);

    const items = await Model.findAll();

    const itemsWithoutPassword = items.map((item) => {
      return removePassword(item.get());
    });

    res.status(200).json(itemsWithoutPassword);
  } catch (error) {
    console.log(error);
  }
};

const createItem = async (res, model, item) => {
  const Model = getModel(model);

  try {
    const newItem = await Model.create(item);
    const itemWithoutPassword = removePassword(newItem.get());

    res.status(201).json(itemWithoutPassword);
  } catch (error) {
    // const errorMessages = error.errors?.map((e) => e.message);
    // res.status(400).json({ error: errorMessages });

    if (error.message === "notNull Violation: Reader.name cannot be null") {
      res.status(400).json({ message: "Name fields cannot be empty" });
    }
    if (error.message === "notNull Violation: Reader.email cannot be null") {
      res.status(400).json({ message: "Email fields cannot be empty" });
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
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

const updateItem = async (res, model, item, id) => {
  const Model = getModel(model);

  try {
    const [updatedRows] = await Model.update(item, { where: { id } });
    if (!updatedRows) {
      return res
        .status(404)
        .json({ error: `The ${model} could not be found.` });
    }
    const itemWithoutPassword = removePassword(updatedRows);
    res.status(200).json(itemWithoutPassword);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getItemById = async (res, model, id) => {
  const Model = getModel(model);

  try {
    const item = await Model.findByPk(id);

    if (!item) {
      return res
        .status(404)
        .json({ error: `The ${model} could not be found.` });
    } else {
      const itemWithoutPassword = removePassword(item.dataValues);
      res.status(200).json(itemWithoutPassword);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteItem = async (res, model, id) => {
  const Model = getModel(model);
  try {
    const deletedRows = await Model.destroy({ where: { id } });
    if (!deletedRows) {
      return res
        .status(404)
        .json({ error: `The ${model} could not be found.` });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  getItemById,
  deleteItem,
};
