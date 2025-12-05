const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/request.js");
const sendEmail = require("./sendEmail.js");
cron.schedule("11 17 * * *", async () => {
  try {
    console.log("starting");
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequest = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");
    // populate to reference the from and touser id to find list of the user email ids
    // set to find unique values and find toUserId s emaildId using map and ... to convert to array to loop further
    const listOfEmails = [
      ...new Set(pendingRequest.map((req) => req.toUserId.emailId)),
    ];
    console.log(listOfEmails);
    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run(
          "New friend request pending for " + email,
          "Friend request pending please login to the portal"
        );
        console.log(res);
      } catch (error) {
        console.log("Error in email generation", error);
      }
    }
  } catch (error) {
    console.log("Error sending email", error);
  }
});
