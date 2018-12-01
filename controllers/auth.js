const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyAuthMiddleware = require("../middlewares/verify-auth");

const bcrypt = require("bcrypt");

const router = express.Router();

mongoose.connect(process.env.dbKey);

var db = mongoose.connection;
db.on("error", err => {
  console.error(err);
});
db.once("open", () => {
  console.log("connected");
});

router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.json({ message: "registering failed" });
    }
    const newUser = new User({
      email: req.body.email,
      password: hash
    });
    newUser.save(err => {
      if (err) {
        return res.json({ success: false, message: "User already exists" });
      }
      res.json({ success: true });
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne(
    {
      email: req.body.email
    },
    (err, user) => {
      if (err) throw err;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Authentication failed. Wrong email and password combination"
        });
      }
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (!result) {
            return res.status(401).json({
              success: false,
              message:
                "Authentication failed. Wrong email and password combination"
            });
          }
          if (result) {
            const payload = {
              email: user.email,
              userId: user._id
            };
            const token = jwt.sign(payload, "somesaltypage", {
              expiresIn: "2d"
            });

            res.status(200).json({
              success: true,
              token
            });
          }
        });
      }
    }
  );
});

router.post("/validateToken", verifyAuthMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Token is verified"
  });
});

module.exports = router;
