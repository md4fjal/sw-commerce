import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const AddressSchema = new Schema({
  country: { type: String, required: true, default: "India" },
  streetAddress: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  phone: { type: String },
});

const CartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
});

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    acceptTermsAndCond: { type: Boolean, required: true },
    phone: { type: String },
    billingAddress: { type: AddressSchema },
    shippingAddress: { type: AddressSchema },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    cart: [CartItemSchema],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
