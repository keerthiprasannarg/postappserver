const express = require("express");
const router = express.Router();

const Follow = require("../models/follow");

const followUser = async (req, res) => {
  const { userId } = req.params;
  const { idToFollow } = req.body;
  const filter = {
    follower: userId,
    followee: idToFollow,
  };

  try {
    const currFollow = await Follow.findOne(filter);

    if (currFollow) {
      return res
        .status(400)
        .json({ error: "You are already following this user" });
    }

    const newFollow = await new Follow({
      follower: userId,
      followee: idToFollow,
    }).save();

    return res.status(200).json({ message: "Successfully followed the user" });
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "" });
  }
};

const unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const { idToUnFollow } = req.body;

  try {
    const currFollow = await Follow.findOneAndDelete({
      follower: userId,
      followee: idToUnFollow,
    });

    if (!currFollow) {
      return res.status(400).json({ error: "You are not following this user" });
    }

    return res
      .status(200)
      .json({ message: "Successfully unfollowed the user" });
  } catch (error) {
    return res.status(500).json({ error: error?.message ?? "" });
  }
};

const getUserFollowers = async (req, res) => {
  try {
    const currUserFollowers = await Follow.find({
      followee: req.params.userId,
    }).populate("follower");

    return res.status(200).json(currUserFollowers);
  } catch (error) {
    return res.status(500).json({
      error: error?.message,
    });
  }
};

const getUserFollowing = async (req, res) => {
  try {
    const following = await Follow.find({
      follower: req.params.userId,
    }).populate("followee");

    return res.status(200).json(following);
  } catch (error) {
    return res.status(500).json({
      error: error?.message ?? "",
    });
  }
};

router.post("/follow/:userId", followUser);
router.post("/unfollow/:userId", unfollowUser);
router.post("/getUserFollowers/:userId", getUserFollowers);
router.post("/getUserFollowing/:userId", getUserFollowing);

module.exports = router;
