import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  if (!name || !image) {
    return res
      .status(400)
      .json({ message: "Category name and Image is required" });
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const category = await Category.create({ name, image });

  res.status(201).json({
    success: true,
    message: "Category added successfully",
    category,
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  let { search, sortBy, order, page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  sortBy = sortBy || "createdAt";
  order = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const total = await Category.countDocuments(query);

  const categories = await Category.find(query)
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    categories,
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  if (!name || !image) {
    return res
      .status(400)
      .json({ message: "Category name and Image is required" });
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory && existingCategory._id.toString() !== req.params.id) {
    return res.status(400).json({ message: "Category name already in use" });
  }

  category.name = name;
  category.image = image;
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
