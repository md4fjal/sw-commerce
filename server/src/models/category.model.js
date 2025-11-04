import { Schema, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = model("Category", CategorySchema);
