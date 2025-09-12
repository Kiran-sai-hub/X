import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

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

const getSuggetedUsers = async (req, res) => {};

export { getUserProfile, followUnfollowUser, getSuggetedUsers };
