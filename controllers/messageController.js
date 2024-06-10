const mongoose = require("mongoose");
const Message = require("../models/message");

exports.getMessagesBetweenUsers = async (req, res) => {
    const { senderId, reciverId } = req.body;
    console.log(`reciverId: ${reciverId}, senderId: ${senderId}`);

    if (!senderId || !reciverId) {
        return res
            .status(400)
            .json({ error: "senderId and reciverId are required" });
    }

    try {
        const messages = await Message.find({
            $or: [
                { senderId: senderId, reciverId: reciverId },
                { senderId: reciverId, reciverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        if (!messages || messages.length === 0) {
            console.log("No messages found");
            return res.status(404).json({ msg: "No messages found" });
        } else {
            console.log("Messages found:", messages);
            return res.status(200).json(messages);
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({
            msg: "An error occurred while fetching messages",
            error: error.message,
        });
    }
};
