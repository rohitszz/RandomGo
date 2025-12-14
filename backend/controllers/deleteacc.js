const Messages = require("../models/Messages");
const User = require("../models/user")

exports.deleteAccount = async (req, res) => {
    try{ 

        const { email } = req.body;

         if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
          }

        const deletedUser = await User.findOneAndDelete({email: email});
       
        await Messages.deleteMany(
            { $or: [  {
                        senderId: email,
                    },
                    {
                        recieverId: email
                    } ] }  )

        return res.status(200).json({
            success:true,
        })
    }
    catch(error){
        
        return res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}