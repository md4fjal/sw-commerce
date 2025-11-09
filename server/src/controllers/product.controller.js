import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const addProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    stock,
    brand,
    salePrice,
    sku,
    colors,
    sizes,
    tags,
    weight,
    dimensions,
    gender,
    isFeatured,
    isNewArrival,
    isTrending,
    returnPolicyDays,
    warranty,
  } = req.body;

  if (!name || !price || !category || !brand) {
    return res.status(400).json({
      message: "Name, price, category, and brand are required",
    });
  }

  const existingProduct = await Product.findOne({
    $or: [{ name }, { sku: sku || null }].filter(
      (condition) => Object.values(condition)[0] !== null
    ),
  });

  if (existingProduct) {
    return res.status(400).json({
      message: "Product with this name or SKU already exists",
    });
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return res.status(404).json({ message: "Category not found" });
  }

  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const productData = {
    name,
    slug,
    price,
    description,
    category,
    brand,
    stock: stock || 0,
    salePrice,
    sku,
    colors: colors ? (Array.isArray(colors) ? colors : JSON.parse(colors)) : [],
    sizes: sizes ? (Array.isArray(sizes) ? sizes : JSON.parse(sizes)) : [],
    tags: tags ? (Array.isArray(tags) ? tags : JSON.parse(tags)) : [],
    weight,
    dimensions: dimensions
      ? typeof dimensions === "string"
        ? JSON.parse(dimensions)
        : dimensions
      : undefined,
    gender: gender || "unisex",
    isFeatured: isFeatured === "true",
    isNewArrival: isNewArrival === "true",
    isTrending: isTrending === "true",
    returnPolicyDays: returnPolicyDays || 7,
    warranty: warranty || "No Warranty",
  };

  if (req.files && req.files.images) {
    const imageUploads = await uploadMultipleToCloudinary(
      req.files.images,
      "products"
    );
    productData.images = imageUploads.map((upload, index) => ({
      url: upload.url,
      public_id: upload.public_id,
      alt: req.body.imageAlts
        ? Array.isArray(req.body.imageAlts)
          ? req.body.imageAlts[index]
          : JSON.parse(req.body.imageAlts)[index]
        : name,
    }));
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product,
  });
});

export const getAllProducts = asyncHandler(async (req, res) => {
  let {
    search,
    sortBy,
    order,
    page,
    limit,
    category,
    brand,
    gender,
    minPrice,
    maxPrice,
    inStock,
    isFeatured,
    isNewArrival,
    isTrending,
  } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  sortBy = sortBy || "createdAt";
  order = order === "asc" ? 1 : -1;
  const skip = (page - 1) * limit;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = { $regex: brand, $options: "i" };
  }

  if (gender && gender !== "all") {
    query.gender = gender;
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (inStock === "true") {
    query.stock = { $gt: 0 };
  }

  if (isFeatured === "true") {
    query.isFeatured = true;
  }

  if (isNewArrival === "true") {
    query.isNewArrival = true;
  }

  if (isTrending === "true") {
    query.isTrending = true;
  }

  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate("category", "name slug")
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
    "name slug"
  );
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ success: true, product });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "category",
    "name slug"
  );
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    stock,
    brand,
    salePrice,
    sku,
    colors,
    sizes,
    tags,
    weight,
    dimensions,
    gender,
    isFeatured,
    isNewArrival,
    isTrending,
    returnPolicyDays,
    warranty,
    status,
  } = req.body;

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

  if (name && name !== product.name) {
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product name already exists" });
    }
    product.name = name;
    product.slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  if (sku && sku !== product.sku) {
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ message: "SKU already exists" });
    }
    product.sku = sku;
  }

  if (price !== undefined) product.price = price;
  if (description !== undefined) product.description = description;
  if (stock !== undefined) product.stock = stock;
  if (brand !== undefined) product.brand = brand;
  if (salePrice !== undefined) product.salePrice = salePrice;
  if (colors !== undefined)
    product.colors = Array.isArray(colors) ? colors : JSON.parse(colors);
  if (sizes !== undefined)
    product.sizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
  if (tags !== undefined)
    product.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
  if (weight !== undefined) product.weight = weight;
  if (dimensions !== undefined)
    product.dimensions =
      typeof dimensions === "string" ? JSON.parse(dimensions) : dimensions;
  if (gender !== undefined) product.gender = gender;
  if (isFeatured !== undefined) product.isFeatured = isFeatured === "true";
  if (isNewArrival !== undefined)
    product.isNewArrival = isNewArrival === "true";
  if (isTrending !== undefined) product.isTrending = isTrending === "true";
  if (returnPolicyDays !== undefined)
    product.returnPolicyDays = returnPolicyDays;
  if (warranty !== undefined) product.warranty = warranty;
  if (status !== undefined) product.status = status;

  if (req.files && req.files.images) {
    const newImageUploads = await uploadMultipleToCloudinary(
      req.files.images,
      "products"
    );
    const newImages = newImageUploads.map((upload, index) => ({
      url: upload.url,
      public_id: upload.public_id,
      alt: req.body.imageAlts
        ? Array.isArray(req.body.imageAlts)
          ? req.body.imageAlts[index]
          : JSON.parse(req.body.imageAlts)[index]
        : product.name,
    }));

    if (req.body.replaceImages === "true") {
      for (const image of product.images) {
        await deleteFromCloudinary(image.public_id);
      }
      product.images = newImages;
    } else {
      product.images.push(...newImages);
    }
  }

  if (req.body.deleteImages) {
    const imagesToDelete = Array.isArray(req.body.deleteImages)
      ? req.body.deleteImages
      : JSON.parse(req.body.deleteImages);

    for (const publicId of imagesToDelete) {
      await deleteFromCloudinary(publicId);
    }
    product.images = product.images.filter(
      (img) => !imagesToDelete.includes(img.public_id)
    );
  }

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

  for (const image of product.images) {
    await deleteFromCloudinary(image.public_id);
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
