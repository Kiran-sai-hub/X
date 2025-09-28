import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "Post must have a text or an Image" });
    }

    if (img) {
      const uploadResponse = await cloudinary.uploader.upload(img);
      img = uploadResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(`Error in createPost Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgPublicId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgPublicId);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(`Error in deletePost Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({
        error: "You need to write something to comment",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: "Post not Found",
      });
    }

    const comment = { user: userId, text };
    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log(`Error in commentOnPost Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not Found" });
    }

    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      //un-like post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
      res.status(200).json(updatedLikes);
    } else {
      // send a notification for liking!

      await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
      await User.updateOne(
        { _id: userId },
        { $addToSet: { likedPosts: postId } }
      );
      // Create a notification

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "like",
      });
      await notification.save();

      const updatedLikes = [...post.likes, userId];
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log(`Error in likeUnlikePost Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    console.log(`Error in getAllPosts Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log(`Error in getLikedPosts Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followingIds = user.following;

    const feedPosts = await Post.find({ user: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(feedPosts);
  } catch (error) {
    console.log(`Error in getFollowingPosts Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userPosts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    res.status(200).json(userPosts);
  } catch (error) {
    console.log(`Error in getUserPosts Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getUserPosts,
  getAllPosts,
  getLikedPosts,
  getFollowingPosts,
};
