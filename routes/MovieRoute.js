import express from "express";
import {
  createMovie,
  createMovieReview,
  deleteAllMovie,
  deleteMovie,
  getMovieById,
  getMovies,
  getRandomMovies,
  getTopRatedMovies,
  importMovies,
  updateMovie,
} from "../controller/MovieCTRL.js";
import { admin, protect } from "../middleware/Auth.js";

const router = express.Router();

// ! public
router.post("/import", importMovies);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.get("/rated/top", getTopRatedMovies);
router.get("/random/all", getRandomMovies);

// ? private
router.post("/:id/reviews", protect, createMovieReview);

// * admin
router.put("/:id", protect, admin, updateMovie);
router.delete("/:id", protect, admin, deleteMovie);
router.delete("/", protect, admin, deleteAllMovie);
router.post("/", protect, admin, createMovie);

export default router;
