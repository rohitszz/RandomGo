
const Messages = require("../models/Messages");

exports.deleteMessage = async (req, res) => {
    try{
        const { messageId } = req.body;
        await Messages.findOneAndDelete({ _id: messageId})

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully",

        })

    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:error.message
            })
    }
}