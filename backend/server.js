// import modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// import middleware
const verify = require('./routes/verifyToken');

// instantiate server
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect to db using connection string from MongoDB Atlas
const uri = process.env.ATLAS_URI; // retrieve connection string from ./.env using dotenv
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}); // connect MongoDB db to server
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
}); // monitor connection status

// import routes
const skillsRouter = require("./routes/skills.route.js");
const projectsRouter = require("./routes/projects.route.js");
const certificationsRouter = require("./routes/certifications.route.js");
const answersRouter = require("./routes/answers.route.js");
const flashcardsRouter = require("./routes/flashcards.route.js");
const authRouter = require('./routes/auth.route');
const postsRouter = require('./routes/posts.route');

// middleware
app.use(express.json()); // body parser

// route middleware
app.use("/skills", verify, skillsRouter);
app.use("/projects", verify, projectsRouter);
app.use("/certifications", verify, certificationsRouter);
app.use("/answers", verify, answersRouter);
app.use("/flashcards", verify, flashcardsRouter);
app.use('/user', authRouter);
app.use('/posts', postsRouter);

// useful module: https://github.com/drudge/mongoose-findorcreate

// server.listen
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
