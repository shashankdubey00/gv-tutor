import ContactMessage from "../models/ContactMessage.js";

/* ---------------- CREATE CONTACT MESSAGE ---------------- */
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Create new contact message
    const contactMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      message: message.trim(),
    });

    console.log(`📨 New contact message from ${name} (${email})`);

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully! We'll get back to you soon.",
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        message: contactMessage.message,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating contact message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

/* ---------------- GET ALL CONTACT MESSAGES (Admin) ---------------- */
export const getAllContactMessages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    // Get messages with pagination
    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-__v");

    // Get total count for pagination
    const totalMessages = await ContactMessage.countDocuments(query);

    // Get counts by status
    const unreadCount = await ContactMessage.countDocuments({ status: "unread" });
    const readCount = await ContactMessage.countDocuments({ status: "read" });
    const repliedCount = await ContactMessage.countDocuments({ status: "replied" });

    return res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / limit),
          totalMessages,
          messagesPerPage: parseInt(limit),
        },
        stats: {
          unread: unreadCount,
          read: readCount,
          replied: repliedCount,
          total: totalMessages,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

/* ---------------- UPDATE MESSAGE STATUS (Admin) ---------------- */
export const updateMessageStatus = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["unread", "read", "replied"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Update message
    const updateData = { status };
    if (status === "read") {
      updateData.readAt = new Date();
    } else if (status === "replied") {
      updateData.repliedAt = new Date();
    }

    const message = await ContactMessage.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    console.log(`📝 Contact message ${messageId} status updated to ${status}`);

    return res.status(200).json({
      success: true,
      message: "Message status updated successfully",
      data: message,
    });
  } catch (error) {
    console.error("Error updating message status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update message status",
    });
  }
};

/* ---------------- DELETE MESSAGE (Admin) ---------------- */
export const deleteContactMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await ContactMessage.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    console.log(`🗑️ Contact message ${messageId} deleted`);

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};
