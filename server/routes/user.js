const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserTable = require("../models/user");

const hashSalt = process.env.password_salt;

router.get("/get-user/:id", async (req, res) => {
  const user = await UserTable.findById(req.params.id, { password: 0 });
  if (user) res.status(200).json(user);
  else res.status(500).json({ message: "User not found" });
});
router.post("/add-user", async (req, res) => {
  const { username, password, name, email } = req.body;
  console.log("username: ", username);
  let userData = {
    username,
    name,
    email,
    password,
  };
  bcrypt.hash(password, hashSalt, async function (err, hash) {
    if (!err) {
      userData.password = hash;
      const currUser = await UserTable.find({ username });
      if (currUser.length > 0) {
        res.status(500).json({ message: "User already exists" });
      } else {
        let user = new UserTable(userData).save();
        res.status(200).json({ message: "User added sucessfully", data: user });
      }
    } else {
      res.status(500).json(err.message);
    }
  });
});
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const currUser = await UserTable.find({ username });
    if (!(currUser.length > 0)) {
      res.status(404).json({ message: "User not found" });
    } else {
      bcrypt.compare(password, currUser[0]?.password, function (err, result) {
        if (result) {
          currUser[0].password = "";
          res.status(200).json(currUser?.[0]);
        } else {
          res.status(500).json({ message: "Password mismatch" });
        }
      });
    }
  } catch (error) {}
});
router.delete("/delete-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserTable.findByIdAndDelete(id);
    res.status(200).json({ message: "deleted user successfully" });
  } catch (error) {}
});
router.put("/update-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const updateUser = await UserTable.findByIdAndUpdate(id, req.body);
    // const latestUser = await UserTable.findById(id);
    const { username, password, name, email } = req.body;
    console.log("username: ", username);
    let userData = {
      username,
      name,
      email,
      password,
    };

    bcrypt.hash(password, hashSalt, async function (err, hash) {
      if (!err) {
        userData.password = hash;
        const currUser = await UserTable.find({ username });
        if (currUser.length > 0) {
          res.status(500).json({ message: "User already exists" });
        } else {
          const updateUser = await UserTable.findByIdAndUpdate(id, userData);
          const latestUser = await UserTable.findById(id);
          res
            .status(200)
            .json({ message: "User added sucessfully", data: latestUser });
        }
      } else {
        res.status(500).json(err.message);
      }
    });

    res
      .status(200)
      .json({ message: "User updated successfully", data: latestUser });
  } catch (error) {}
});

module.exports = router;
