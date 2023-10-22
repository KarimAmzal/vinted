const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost/vinted");

cloudinary.config({
  cloud_name: "dlp5aoz6w",
  api_key: "875812485232484",
  api_secret: "cV-q2e9k6eU2WFjBAoivO29857Y",
});

const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");

app.use(userRoutes);
app.use(offerRoutes);

app.all("*", (req, res) => {
  res.status(400).json({ message: "This route does not exist" });
});

app.listen(3000, () => {
  console.log("Server started");
});
