const express = require("express");
const router = express.Router();
const User = require("../models/User");

const uid2 = require("uid2"); // Package qui sert à créer des string aléatoires
const SHA256 = require("crypto-js/sha256"); // Sert à encripter une string
const encBase64 = require("crypto-js/enc-base64"); // Sert à transformer l'encryptage en string

router.post("/user/signup", async (req, res) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });

    if (userEmail) {
      return res.status(400).json({ message: "This email is already used" });
    }

    if (!req.body.username) {
      return res.status(400).json({ message: "Missing parameter" });
    }

    const token = uid2(64);
    const salt = uid2(16);
    const hash = SHA256(req.body.password + salt).toString(encBase64);
    const newUser = new User({
      email: req.body.email,
      account: { username: req.body.username, avatar: null },
      newsletter: req.body.newsletter,
      token: token,
      salt: salt,
      hash: hash,
    });
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });
    console.log(userEmail);
    if (!userEmail) {
      return res.status(400).json({ message: "Unauthorized" });
    }
    // calcul du hash
    const salt = userEmail.salt;
    const password = req.body.password;
    const hash = userEmail.hash;
    const stockedHash = SHA256(password + salt).toString(encBase64);

    if (hash === stockedHash) {
      res.status(200).json({
        _id: userEmail._id,
        token: userEmail.token,
        account: { username: userEmail.account.username },
      });
    } else {
      res.status(400).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
