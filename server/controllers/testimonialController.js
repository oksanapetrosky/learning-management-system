// import Testimonial from "../models/Testimonials.js";

// const getTestimonials = async (req, res) => {
//   try {
//     const testimonials = await Testimonial.find().populate("userId", "name");
//     res.status(200).json({ success: true, testimonials });
//   } catch (error) {
//     console.error("Error fetching testimonials:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch testimonials",
//     });
//   }
// };

// export const addTestimonial = async (req, res) => {
//   try {
//     const { message, courseId } = req.body;
//     const userId = req.user._id; // ✅ Comes from authenticated user (middleware)

//     const newTestimonial = new Testimonial({
//       message,
//       courseId,
//       userId,
//     });

//     await newTestimonial.save();
//     res.status(201).json({ success: true, testimonial: newTestimonial });
//   } catch (error) {
//     console.error("Error adding testimonial:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// //DELETE A TESTIMONIAL
// export const deleteTestimonial = async (req, res) => {
//     try {
//       const { id } = req.body;
//       await Testimonial.findByIdAndDelete(id);
//       res.json({ success: true, message: "Testimonial deleted successfully." });
//     } catch (error) {
//       console.error("❌ Error deleting testimonial:", error);
//       res.status(500).json({ success: false, message: "Failed to delete testimonial." });
//     }
//   };


// // POST a new testimonial
// export const addTestimonial = async (req, res) => {
//   try {
//     const { message } = req.body;

//     const newTestimonial = new Testimonial({ message });
//     await newTestimonial.save();

//     res.status(201).json({ success: true, testimonial: newTestimonial });
//   } catch (error) {

//     res.status(500).json({ success: false, message: "Failed to add testimonial." });
//   }
// };


