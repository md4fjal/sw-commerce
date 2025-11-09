import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },

    description: { type: String },
    brand: { type: String, required: true },

    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },

    price: { type: Number, required: true },
    salePrice: { type: Number },

    stock: { type: Number, default: 0 },

    sku: { type: String, unique: true },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        alt: { type: String },
      },
    ],

    colors: [{ type: String }],
    sizes: [{ type: String }],

    tags: [{ type: String }],

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    weight: { type: Number },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    gender: {
      type: String,
      enum: ["men", "women", "kids", "unisex"],
      default: "unisex",
    },

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },

    returnPolicyDays: { type: Number, default: 7 },
    warranty: { type: String, default: "No Warranty" },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Product = model("Product", ProductSchema);
