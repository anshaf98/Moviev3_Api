import express from "express";
import {
  addLikedMovie,
  changeUserPassword,
  deleteLikedMovie,
  deleteUser,
  deleteUserAdmin,
  getLikedMovies,
  getUsers,
  loginUser,
  registerUser,
  updateUser,
} from "../controller/UserCTRL.js";
import { admin, protect } from "../middleware/Auth.js";
const router = express.Router();

// ! public
router.post("/", registerUser);
router.post("/login", loginUser);

// ! private
router.put("/", protect, updateUser);
router.delete("/", protect, deleteUser);
router.put("/password", protect, changeUserPassword);

// ! addToMovie
router.get("/favorites", protect, getLikedMovies);
router.post("/favorites", protect, addLikedMovie);
router.delete("/favorites", protect, deleteLikedMovie);

// ! admin
router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUserAdmin);

export default router;
