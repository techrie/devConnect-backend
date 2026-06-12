const ConnectionRequest = require("../models/connectionRequestModel");
const User = require("../models/userModel");

const sendOrIgnoreConnectionRequest = async (req, res) => {
  try {
    const allowedStatuses = ["interested", "ignored"];
    if (!allowedStatuses.includes(req.params.status)) {
      throw new Error(
        "Invalid status. Allowed statuses are: interested, ignored",
      );
    }
    // const { status, userId } = req.params;
    const loggedInUser = req.user;

    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    //check if toUserId is in DB
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error("User not found");
    }

    if (!toUserId) {
      throw new Error("Invalid toUserId");
    }

    //handled at schema level using pre-save middleware
    // if (fromUserId.toString() === toUserId.toString()) {
    //   throw new Error("Cannot send request to yourself");
    // }

    //Check if there is an existing connection request from the fromUserId to the toUserId
    // or from the toUserId to the fromUserId

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingRequest) {
      throw new Error("Connection request already exists");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();

    // Logic to send connection request
    res.json({
      message: `${loggedInUser.firstName} ${status === "ignored" ? "has ignored" : "is interested in"} ${toUser.firstName}'s profile`,
      data,
    });
  } catch (err) {
    res.status(400).send("Error sending connection request : " + err.message);
  }
};

module.exports = { sendOrIgnoreConnectionRequest };
