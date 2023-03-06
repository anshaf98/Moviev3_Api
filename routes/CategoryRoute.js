import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controller/CategoryCTRL.js";
import { admin, protect } from "../middleware/Auth.js";

const router = express.Router();

// ! public
router.get("/", getCategories);

// * admin
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);
router.post("/", protect, admin, createCategory);

export default router;
