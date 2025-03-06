const express = require("express");
const levelController = require("../controllers/levelController");

const router = express.Router();

router.get("/", levelController.getAllLevels);
router.get("/:id", levelController.getLevelById);
router.post("/", levelController.createLevel);
router.put("/:id", levelController.updateLevel);
router.delete("/:id", levelController.deleteLevel);

module.exports = router;
