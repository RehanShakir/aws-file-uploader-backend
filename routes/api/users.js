import express from "express";
const router = express.Router();
import _ from "lodash";
import bcrypt from "bcrypt";
import UserModel from "../../models/User.js";

router.get("/", async (req, res) => {
  try {
    let users = await UserModel.find();

    res.send(users);
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
  try {
    let { email, password, confirmPassword } = req.body;

    console.log(confirmPassword);

    let user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).send("User with this username already exists.");
    }

    if (!email || !password || !confirmPassword) {
      return res.send("All Feilds are Required");
    }

    if (password === confirmPassword) {
      const hashPassword = await bcrypt.hash(password, 10);

      let user = new UserModel();
      user.email = email;
      user.password = hashPassword;
      await user.save();

      const token = user.generateAuthToken();
      return res
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id", "email"]));
    } else {
      return res.status(400).send("Password Not Matached");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).send("Invalid Email or Password");
    }
    await bcrypt.compare(password, user.password, (err, valid) => {
      if (valid) {
        const token = user.generateAuthToken();

        return res.status(200).header("x-auth-token", token).send(token);
      }
      if (!valid) {
        return res.status(400).send("Invalid Email or Password");
      }
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
