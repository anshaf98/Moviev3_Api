import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../middleware/Auth.js";

// ? public
// ! register
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, image } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // ? hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ? create db
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      image,
    });

    // ! if user created successfully send data and token to client
    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ? public
// ! login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        image: user.image,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email and password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * private
// ! update
const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, image } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.image = image || user.image;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        image: updatedUser.image,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(401);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * private
// ! delete
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can't delete admin user");
      }

      await user.remove();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * private
// ! change password
const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      // * hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Password Changed" });
    } else {
      res.status(401);
      throw new Error("Invalid old password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * private
// ! get Like
const getLikedMovies = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("likedMovies");

    if (user) {
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * private
// ! add movie
const addLikedMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      //   const isMovieLiked = user.likedMovies.find(
      //     (movie) => movie.toString() === movieId
      //   );

      if (user.likedMovies.includes(movieId)) {
        res.status(400);
        throw new Error("Movie already liked");
      }
      user.likedMovies.push(movieId);
      await user.save();
      res.json(user.likedMovies);
    } else {
      res.status(404);
      throw new Error("Movie not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * private
// ! delete movie
const deleteLikedMovie = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.likedMovies = [];
      await user.save();
      res.json({ message: "Your liked movies deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ? admin  private
// ! get All users
const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});

    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ? admin  private
// ! delete user
const deleteUserAdmin = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        res.status(400);
        throw new Error("Can't delete admin user");
      }

      await user.remove();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLikedMovies,
  addLikedMovie,
  deleteLikedMovie,
  getUsers,
  deleteUserAdmin,
};
