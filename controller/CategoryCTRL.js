import asyncHandler from "express-async-handler";
import Categories from "../models/CategoryModel.js";

// * get All cate
// ! public
const getCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Categories.find({});

    res.json(categories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ? create
// ! private
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { title } = req.body;

    const category = new Categories({
      title,
    });

    const createdCategory = await category.save();

    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ? update
// ! private
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);

    if (category) {
      category.title = req.body.title || category.title;

      const updatedCategory = await category.save();

      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ? delete
// ! private
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);

    if (category) {
      await category.remove();

      res.json({ message: "Category removed" });
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export { getCategories, createCategory, deleteCategory, updateCategory };
