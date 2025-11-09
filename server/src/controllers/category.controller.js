import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name, parent } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ message: "Category already exists" });
  }

  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return res.status(404).json({ message: "Parent category not found" });
    }
  }

  const categoryData = {
    name,
    slug,
    parent: parent || null,
  };

  if (req.files) {
    if (req.files.image) {
      const imageResult = await uploadToCloudinary(
        req.files.image[0].buffer,
        "categories"
      );
      categoryData.image = imageResult;
    }

    if (req.files.banner) {
      const bannerResult = await uploadToCloudinary(
        req.files.banner[0].buffer,
        "categories/banners"
      );
      categoryData.banner = bannerResult;
    }

    if (req.files.icon) {
      const iconResult = await uploadToCloudinary(
        req.files.icon[0].buffer,
        "categories/icons"
      );
      categoryData.icon = iconResult;
    }
  }

  const category = await Category.create(categoryData);

  res.status(201).json({
    success: true,
    message: "Category added successfully",
    category,
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  let { search, sortBy, order, page, limit, parent } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  sortBy = sortBy || "createdAt";
  order = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (parent === "null" || parent === "undefined") {
    query.parent = null;
  } else if (parent) {
    query.parent = parent;
  }

  const total = await Category.countDocuments(query);

  const categories = await Category.find(query)
    .populate("parent", "name")
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
  const category = await Category.findById(req.params.id).populate(
    "parent",
    "name"
  );
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ success: true, category });
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate(
    "parent",
    "name"
  );
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.status(200).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, parent } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory && existingCategory._id.toString() !== req.params.id) {
    return res.status(400).json({ message: "Category name already in use" });
  }

  if (parent) {
    const parentCategory = await Category.findById(parent);
    if (!parentCategory) {
      return res.status(404).json({ message: "Parent category not found" });
    }
  }

  if (name !== category.name) {
    category.slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  category.name = name;
  category.parent = parent || null;

  if (req.files) {
    if (req.files.image) {
      if (category.image?.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }
      const imageResult = await uploadToCloudinary(
        req.files.image[0].buffer,
        "categories"
      );
      category.image = imageResult;
    }

    if (req.files.banner) {
      if (category.banner?.public_id) {
        await deleteFromCloudinary(category.banner.public_id);
      }
      const bannerResult = await uploadToCloudinary(
        req.files.banner[0].buffer,
        "categories/banners"
      );
      category.banner = bannerResult;
    }

    if (req.files.icon) {
      if (category.icon?.public_id) {
        await deleteFromCloudinary(category.icon.public_id);
      }
      const iconResult = await uploadToCloudinary(
        req.files.icon[0].buffer,
        "categories/icons"
      );
      category.icon = iconResult;
    }
  }

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

  const subcategories = await Category.find({ parent: req.params.id });
  if (subcategories.length > 0) {
    return res.status(400).json({
      message:
        "Cannot delete category with subcategories. Please delete subcategories first.",
    });
  }

  const Product = (await import("../models/product.model.js")).Product;
  const productsCount = await Product.countDocuments({
    category: req.params.id,
  });
  if (productsCount > 0) {
    return res.status(400).json({
      message:
        "Cannot delete category with products. Please reassign or delete products first.",
    });
  }

  if (category.image?.public_id) {
    await deleteFromCloudinary(category.image.public_id);
  }
  if (category.banner?.public_id) {
    await deleteFromCloudinary(category.banner.public_id);
  }
  if (category.icon?.public_id) {
    await deleteFromCloudinary(category.icon.public_id);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
