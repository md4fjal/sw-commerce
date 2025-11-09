import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },

    image: {
      url: { type: String },
      public_id: { type: String },
    },

    banner: {
      url: { type: String },
      public_id: { type: String },
    },

    icon: {
      url: { type: String },
      public_id: { type: String },
    },

    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

export const Category = model("Category", CategorySchema);
