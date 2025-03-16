const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { verifyToken, checkAdmin } = require("../controllers/middleware");

// Public routes
router.post("/", verifyToken, contactController.createContact);
router.get("/approved", contactController.getApprovedContacts);

// Admin routes
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
