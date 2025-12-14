const Messages = require("../models/Messages")

exports.markSeen = async (req, res) => {
    try{

       const { senderId, recieverId } = req.body;
    await Messages.updateMany(
      { senderId, recieverId, seen: false },
      { $set: { seen: true } }
    );
 

       return res.status(200).json({ success: true });
    }

    catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }

}  