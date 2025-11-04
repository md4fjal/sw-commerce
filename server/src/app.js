import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import categoryRoute from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";
import wishlistRoute from "./routes/wishlist.route.js";
import cartRoute from "./routes/cart.route.js";
import paymentRoutes from "./routes/payment.routes.js";
import shiprocketRoutes from "./routes/shiprocket.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => res.send("Server running"));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/wishlist", wishlistRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/shiprocket", shiprocketRoutes);
app.use("/api/v1/order", orderRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
