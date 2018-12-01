require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Auth = require("./controllers/auth");
const verifyAuthMiddleware = require("./middlewares/verify-auth");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.use("/auth", Auth);

app.get("/privateData", verifyAuthMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Token is verified"
  });
});
app.listen(PORT, () => {
  console.log("listening on ", PORT);
});
