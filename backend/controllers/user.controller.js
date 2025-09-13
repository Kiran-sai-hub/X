import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";

import { v2 as cloudinary } from "cloudinary";

const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({
        error: "User not Found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getProfile Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }
    if (!currentUser || !userToModify) {
      return res.status(404).json({ error: "User not Found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //un-follow
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      return res.status(200).json({ message: "User Unfollowed successfully" });
    } else {
      //follow
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();
      // TODO: return the id of the user to send notification in response..
      return res.status(200).json({ message: "User Followed successfully" });
    }
  } catch (error) {
    console.log(`Error in followUnfollow Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const getSuggetedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error in getSuggestedUsers Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

const updateUser = async (req, res) => {
  const { username, fullname, email, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImage } = req.body;

  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not Found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({
        error: "Both current and new passwords are required to update password",
      });
    }

    if (newPassword && currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current Password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(404)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }
      const uploadRes = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadRes.secure_url;
    }

    if (coverImage) {
      if (user.coverImage) {
        await cloudinary.uploader.destroy(
          user.coverImage.split("/").pop().split(".")[0]
        );
      }
      const uploadRes = await cloudinary.uploader.upload(coverImage);
      coverImage = uploadRes.secure_url;
    }

    user.username = username || user.username;
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImage = coverImage || user.coverImage;

    user = await user.save();
    user.password = null;

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in updateUser Controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server error" });
  }
};

export { getUserProfile, followUnfollowUser, getSuggetedUsers, updateUser };
