// controllers/contactController.js
const Contact = require("../models/Contact");

// Get all contacts (for admin)
exports.getAllContacts = async (req, res) => {
  try {
    console.log("Getting all pending contacts...");
    const contacts = await Contact.find({ status: "pending" })
      .populate("userId", "name email avatar")
      .sort({ createdAt: -1 });

    console.log("Found contacts:", contacts);

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get approved contacts (for home page)
exports.getApprovedContacts = async (req, res) => {
  try {
    console.log("Getting all approved contacts...");
    const contacts = await Contact.find({ status: "approved" })
      .populate("userId", "name email avatar")
      .sort({ createdAt: -1 });

    console.log("Found contacts:", contacts);

    res.status(200).json({
      success: true,
      data: contacts,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("user", "name email"); // Ensure contact belongs to the authenticated user
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new contact
exports.createContact = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id; // Get user ID from authenticated request

    // Check last contact from this user
    const lastContact = await Contact.findOne({ userId }).sort({
      createdAt: -1,
    });

    if (lastContact) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      if (lastContact.createdAt > threeMonthsAgo) {
        const nextDate = new Date(
          lastContact.createdAt.getTime() + 90 * 24 * 60 * 60 * 1000
        );
        return res.status(400).json({
          message: "Bạn chỉ có thể gửi phản hồi một lần trong 3 tháng",
          nextAvailableDate: nextDate,
        });
      }
    }

    const newContact = new Contact({ userId, message });
    await newContact.save();

    res.status(201).json({
      message: "Phản hồi đã được gửi thành công",
      contact: newContact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Approve contact
exports.approveContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).populate("userId", "name email avatar");

    if (!contact) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    }

    res.status(200).json({
      message: "Phản hồi đã được phê duyệt",
      contact,
    });
  } catch (error) {
    console.error("Error approving contact:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const { message } = req.body;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure contact belongs to the authenticated user
      { message },
      { new: true }
    ).populate("user", "name email");

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res
      .status(200)
      .json({ message: "Contact updated successfully", updatedContact });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Không tìm thấy phản hồi" });
    }

    res.status(200).json({ message: "Đã xóa phản hồi thành công" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
