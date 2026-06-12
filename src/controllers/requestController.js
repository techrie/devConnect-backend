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

    //pre save middleware in the model will be called here just before saving to the database
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

const reviewRequestReceived = async (req, res) => {
  try {
    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(req.params.status)) {
      throw new Error(
        "Invalid status. Allowed statuses are: accepted, rejected",
      );
    }

    const loggedInUser = req.user;
    const status = req.params.status;
    const requestId = req.params.requestId;

    //check if requestId is present in the database
    const connectionRequestExists = await ConnectionRequest.findById({
      _id: requestId,
    });
    if (!connectionRequestExists) {
      throw new Error("Connection request not found");
    }

    //check if logged in user is the recipient of the connection request , status should be interested

    // Logic to review the connection request

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });
    if (!connectionRequest) {
      throw new Error("Connection request not found");
    }

    // Update the connection request status
    connectionRequest.status = status;
    const data = await connectionRequest.save();

    //how to see who sent the request

    res.json({
      message: `${loggedInUser.firstName} ${status} the connection request.`,
      data,
    });
  } catch (err) {
    res.status(400).send("Error reviewing connection request : " + err.message);
  }
};

module.exports = { sendOrIgnoreConnectionRequest, reviewRequestReceived };
