const express = require("express");
const readerController = require("../controllers/reader");

const router = express.Router();

router.post("/", readerController.create);
router.get("/", readerController.readAll);
router.get("/:id", readerController.getReaderById);
router.patch("/:id", readerController.updateReader);
router.delete("/:id", readerController.deleteReader);

module.exports = router;
