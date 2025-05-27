import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  message: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Add this
  date: { type: Date, default: Date.now },
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
