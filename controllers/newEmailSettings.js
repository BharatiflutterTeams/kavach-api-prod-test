const EmailSettings = require("../models/newEmailSettings");

// Controller to create a new EmailSettings entry
exports.createEmailSettings = async (req, res) => {
  try {
    const { senderEmail, receiverEmail, password, ccEmail } = req.body;

    const newSettings = new EmailSettings({
      senderEmail,
      receiverEmail,
      password,
      ccEmail
    });

    const savedSettings = await newSettings.save();
    res.status(201).json({ message: "Email settings created successfully", data: savedSettings });
  } catch (error) {
    res.status(500).json({ message: "Error creating email settings", error: error.message });
  }
};

// Controller to get EmailSettings by ID
exports.getEmailSettings = async (req, res) => {
  try {
    const emailSettings = await EmailSettings.find();

    if (!emailSettings) {
      return res.status(404).json({ message: "Email settings not found" });
    }

    res.status(200).json({ data: emailSettings });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving email settings", error: error.message });
  }
};

// Controller to update EmailSettings by ID
exports.updateEmailSettings = async (req, res) => {
  try {
    const { senderEmail, receiverEmail, password, ccEmail } = req.body;

    const updatedSettings = await EmailSettings.findByIdAndUpdate(
      req.params.id,
      { senderEmail, receiverEmail, password, ccEmail },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Email settings not found" });
    }

    res.status(200).json({ message: "Email settings updated successfully", data: updatedSettings });
  } catch (error) {
    res.status(500).json({ message: "Error updating email settings", error: error.message });
  }
};
