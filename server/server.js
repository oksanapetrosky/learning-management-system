import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

// import testimonialRouter from "./routes/testimonialRoute.js";

//initialize express
const app = express();



// startServer();
connectDB();
connectCloudinary();

//Middleware
// app.use(cors());
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:5173'],  // or your frontend URL
  credentials: true
}));

app.post('/webhook', express.raw({type: 'application/json'}), stripeWebhooks)
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Route
app.get("/", (req, res) => res.send("API working"));
// app.post("/clerk", express.json(), clerkWebhooks);
app.post("/api/webhooks/clerk", express.json({ type: "*/*" }), clerkWebhooks);

// app.use("/api/educator", express.json(), educatorRouter);
// app.use('/api/course', express.json(), courseRouter);
// app.use('/api/user', express.json(), userRouter); 
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);


// app.use("/api/testimonials", express.json(), testimonialRouter);
// app.use("/api/testimonials", testimonialRouter);

//Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
