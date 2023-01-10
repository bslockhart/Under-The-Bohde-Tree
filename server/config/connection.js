const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb://192.168.1.11:3000/under-the-bohde-tree",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,clea
    }
  )
  .catch((err) => {
    console.error(err);
  });

module.exports = mongoose.connection;
