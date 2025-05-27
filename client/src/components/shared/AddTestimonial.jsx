// import { useContext, useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom";
// import { AppContext } from '../../context/AppContext';


// const AddTestimonial = ({ testimonials, setTestimonials, courseId }) => {
//     const navigate = useNavigate();
//     const { backendUrl } = useContext(AppContext)
//     // const [form, setForm] = useState({
//     //     name: "",
//     //     message: "",
//     //     rating: 5,
//     //     avatar: "",
//     // });

//     const [form, setForm] = useState({
//         message: "",
//     });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         try {
//           const { data } = await axios.post(backendUrl + "/api/testimonials/add-testimonial", form);
    
//           if (data.success) {
//             toast.success("✅ Testimonial submitted!");
//             setTestimonials([data.testimonial, ...testimonials]); // add to top
//             setForm({ message: "" });
//             navigate(`/course/${courseId}`);// Redirect to home page after submission
//           } else {
//             toast.error("Something went wrong!");
//           }
//         } catch (error) {
//           console.error("❌ Fetch testimonial error:", error);
//           toast.error("❌ Failed to submit testimonial.");
//         }
//       };

//   return (
//     <div>
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-5 rounded-lg shadow-md mt-10 space-y-4 max-w-xl"
//       >
//         {/* <input
//           type="text"
//           placeholder="Your name"
//           className="w-full border px-4 py-2 rounded"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           required
//         /> */}
//         {/* <input
//           type="url"
//           placeholder="Avatar URL (optional)"
//           className="w-full border px-4 py-2 rounded"
//           value={form.avatar}
//           onChange={(e) => setForm({ ...form, avatar: e.target.value })}
//         /> */}
//         <textarea
//           placeholder="Your feedback"
//           className="w-full border px-4 py-2 rounded"
//           value={form.message}
//           onChange={(e) => setForm({ ...form, message: e.target.value })}
//           required
//         />
//         {/* <input
//           type="number"
//           min="1"
//           max="5"
//           placeholder="Rating (1–5)"
//           className="w-full border px-4 py-2 rounded"
//           value={form.rating}
//           onChange={(e) => setForm({ ...form, rating: e.target.value })}
//           required
//         /> */}
//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Submit Testimonial
//         </button>
//       </form>
//     </div>
//   )
// }
// AddTestimonial.propTypes = {
//   testimonials: PropTypes.array.isRequired,
//   setTestimonials: PropTypes.func.isRequired,
//   courseId: PropTypes.string.isRequired,
// };

// export default AddTestimonial

