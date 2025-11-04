import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock, images } = req.body;

  if (!name || !price || !category) {
    return res
      .status(400)
      .json({ message: "Name, price, and category are required" });
  }

  const existingProduct = await Product.findOne({ name });
  if (existingProduct) {
    return res.status(400).json({ message: "Product already exists" });
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(404).json({ message: "Category not found" });
  }

  const product = await Product.create({
    name,
    price,
    description,
    category,
    stock,
    images,
  });

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  let { search, sortBy, order, page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  sortBy = sortBy || "createdAt";
  order = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const query = search ? { name: { $regex: search, $options: "i" } } : {};

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate("category", "name")
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name"
  );
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock, images } = req.body;

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (category) {
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }
    product.category = category;
  }

  if (name) product.name = name;
  if (price !== undefined) product.price = price;
  if (description !== undefined) product.description = description;
  if (stock !== undefined) product.stock = stock;
  if (images !== undefined) product.images = images;

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
