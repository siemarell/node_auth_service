import mongoose from "mongoose";
import { app } from "./app";
import { MONGO_URL, PORT } from "./config";

// Connect to MongoDB
// mongoose.Promise = bluebird;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅  Connected to MongoDB");
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(`❌  MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
  });

app.listen(PORT ?? 5000, () => {
  console.log("🚀 Server ready at: http://localhost:" + PORT);
});
