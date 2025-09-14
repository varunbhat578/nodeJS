const mongoose = require("mongoose");
const connectionRequestschema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      require: true,
      ref: "User",
    },
    status: {
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

connectionRequestschema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(" cannot send request to yourself");
  }
  next();
});
const connectionSchemaRequest = mongoose.model(
  "connectionRequest",
  connectionRequestschema
);
module.exports = { connectionSchemaRequest };
