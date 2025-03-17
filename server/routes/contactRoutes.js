const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { verifyToken, checkAdmin } = require("../controllers/middleware");

router.post("/", verifyToken, contactController.createContact);
router.get("/approved", contactController.getApprovedContacts);
router.get("/all", [verifyToken, checkAdmin], contactController.getAllContacts);
router.put(
  "/:id/approve",
  [verifyToken, checkAdmin],
  contactController.approveContact
);
router.delete(
  "/:id",
  [verifyToken, checkAdmin],
  contactController.deleteContact
);

module.exports = router;
