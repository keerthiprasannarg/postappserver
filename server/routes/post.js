const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const createPost = async (req, res) => {
  const addPost = new Post(req.body).save();
  res.status(200).json({ message: "Post added successfully", data: addPost });
};

const readPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.status(200).json(posts);
};
const readPost = async (req, res) => {
  const posts = await Post.findById(req.params.id);
  res.status(200).json(posts);
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const ediitingPost = req.body;
  const ediitedPost = await Post.findByIdAndUpdate(id, ediitingPost);
  const latestPost = await Post.findById(id);
  res
    .status(200)
    .json({ message: "Post updated successfully", data: latestPost });
};
const deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.status(200).json({ message: "Post deleted successfully" });
};
router.get("/get-posts/", readPosts);
router.get("/get-post/:id", readPost);
router.post("/add-post", createPost);
router.put("/update-post/:id", updatePost);
router.delete("/delete-post/:id", deletePost);

module.exports = router;
