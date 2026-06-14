const ConnectionRequest = require("../models/connectionRequestModel");

const USER_SAFE_DATA = "firstName lastName age gender about skills photoUrl";

//Get received connection requests for the logged in user
const requestsReceived = async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Logic to fetch received connection requests
    const receivedRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "Received connection requests fetched successfully",
      data: receivedRequests,
    });
  } catch (err) {
    res.status(400).send("Error fetching received requests" + err.message);
  }
};

const connections = async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Logic to fetch connections
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((connection) => {
      if (
        connection.fromUserId._id.toString() === loggedInUser._id.toString()
      ) {
        return connection.toUserId;
      }

      return connection.fromUserId;
    });

    res.json({
      message: "Connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("Error fetching connections" + err.message);
  }
};

module.exports = {
  requestsReceived,
  connections,
};
