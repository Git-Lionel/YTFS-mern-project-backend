const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.vojf7ne.mongodb.net/mern-project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // MODIF : Ci dessous mis en commentaire car ne marche pas sinon...
      //   useCreateIndex: true,
      //   useFindAndModify: false,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB" + err));
