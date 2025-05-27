// // // // import React from "react";
// // // import { assets, dummyTestimonial } from "../../assets/assets";

// // // const TestimonialSection = () => {
// // //   return (
// // //     <div className="pb-14 px-8 md:px-0">
// // //       <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
// // //       <p className="md:text-base text-gray-500 mt-3">
// // //         Hear from our learners as they share their journeys of transformation,
// // //         success, and how our <br /> platform has made a difference in their
// // //         lives
// // //       </p>
// // //       <div className="grid grid-cols-auto gap-8 mt-14">
// // //         {dummyTestimonial.map((testimonial, index) => (
// // //           <div
// // //             key={index}
// // //             className="text-sm text-left border border-gray-500/30 pb-6 rounded-lg bg-white shadow-[0px_4px_15px_0px] shadow-black/5 overflow-hidden"
// // //           >
// // //             <div className="flex items-center gap-4 px-5 py-4 bg-gray-500/10">
// // //               <img
// // //                 className="h-12 w-12 rounded-full"
// // //                 src={testimonial.image}
// // //                 alt={testimonial.name}
// // //               />
// // //               <div>
// // //                 <h1 className="text-lg font-medium text-gray-800">
// // //                   {testimonial.name}
// // //                 </h1>
// // //                 <p className="text-gray-800/80">{testimonial.role}</p>
// // //               </div>
// // //             </div>
// // //             <div className="p-5 pb-7">
// // //               <div className="flex gap-0.5">
// // //                 {[...Array(5)].map((_, i) => (
// // //                   <img
// // //                     className="h-5"
// // //                     key={i}
// // //                     src={
// // //                       i < Math.floor(testimonial.rating)
// // //                         ? assets.star
// // //                         : assets.star_blank
// // //                     }
// // //                     alt="star"
// // //                   />
// // //                 ))}
// // //               </div>
// // //               <p className="text-gray-500 mt-5">{testimonial.feedback}</p>
// // //             </div>
// // //             <a href="#" className="text-blue-500 underline px-5">
// // //               Read more
// // //             </a>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default TestimonialSection;

// // import { useContext, useEffect, useState } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import PropTypes from "prop-types";
// // import { AppContext } from "../../context/AppContext"; 

// //  const TestimonialSection = ({ courseId }) => {
// //   const [testimonials, setTestimonials] = useState([]);
// //   const { backendUrl } = useContext(AppContext);

// //   // useEffect(() => {
// //   //   const fetchTestimonials = async () => {
// //   //     try {
// //   //       const { data } = await axios.get("/api/testimonials/get-testimonials");
// //   //       if (data.success) {
// //   //         console.log("✅ All testimonials from DB:", data.testimonials);
// //   //         // If courseId is provided, filter testimonials
// //   //         const filtered = courseId
// //   //           ? data.testimonials.filter((t) => t.courseId === courseId)
// //   //           : data.testimonials;
// //   //           console.log("📌 Filtered testimonials for courseId:", courseId, filtered);

// //   //         setTestimonials(filtered);
// //   //       } else {
// //   //         console.warn("⚠️ Fetch success false:", data.message);
// //   //       }
// //   //     } catch (error) {
// //   //       console.error("❌ Fetch testimonial error:", error);
// //   //       toast.error("Failed to fetch testimonials.");
// //   //     }
// //   //   };

// //   //   fetchTestimonials();
// //   // }, [courseId]);

// //   useEffect(() => {
// //     const fetchTestimonials = async () => {
// //       try {
// //         const { data } = await axios.get(
// //           `${backendUrl}/api/testimonials/get-testimonials`
// //         );

// //         console.log("✅ Testimonials response:", data);

// //         if (data.success) {
// //           // const filtered = courseId
// //           //   ? data.testimonials.filter((t) => t.courseId === courseId)
// //           //   : data.testimonials;

// //           const filtered = data.testimonials;
// //           setTestimonials(filtered);
// //         } else {
// //           console.warn("⚠️ Fetch success false:", data.message);
// //         }
// //       } catch (error) {
// //         console.error("❌ Fetch testimonial error:", error);
// //         toast.error("Failed to fetch testimonials.");
// //       }
// //     };

// //     fetchTestimonials();
// //   }, [courseId, backendUrl]);

// //   return (
// //     <div className="pb-14 px-8 md:px-0">
// //       {/* <h2 className="text-3xl font-medium text-gray-800">
// //         {courseId ? "Student Feedback" : "Testimonials"}
// //       </h2> */}
  
// //       {testimonials.length > 0 ? (
// //           <div className="grid grid-cols-auto gap-8 mt-14">
// //             {testimonials.map((testimonial, index) => (
// //               <div
// //                 key={index}
// //                 className="text-sm text-left border border-gray-300 pb-6 rounded-lg bg-white shadow-md overflow-hidden p-5"
// //               >
// //                 <p className="text-gray-700">{testimonial.message}</p>
// //               </div>
// //             ))}
// //           </div>
// //         ) : (
// //           <p className="text-gray-500 mt-3 italic">No feedback yet for this course.</p>
// //         )}
// //     </div>
// //   );
// //  }  

// //ATTEMPT TO GET TESTIMONIALS BY COURSE ID
// import { useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AppContext } from "../../context/AppContext";

// const TestimonialsSection = ({ courseId }) => {
//   const [testimonials, setTestimonials] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const { backendUrl } = useContext(AppContext);

//   useEffect(() => {
//     const fetchTestimonials = async () => {
//       try {
//         const { data } = await axios.get(
//           `${backendUrl}/api/testimonials/get-testimonials`
//         );
//         if (data.success) {
//           const filtered = courseId
//             ? data.testimonials.filter((t) => t.courseId === courseId)
//             : data.testimonials;
//           setTestimonials(filtered);
//         } else {
//           console.warn("⚠️ Fetch success false:", data.message);
//         }
//       } catch (error) {
//         console.error("❌ Fetch testimonial error:", error);
//         toast.error("Failed to fetch testimonials.");
//       }
//     };

//     fetchTestimonials();
//   }, [backendUrl, courseId]);

//   const displayTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

//   return (
//     <div className="pb-14 px-8 md:px-0">
//       <h2 className="text-3xl font-medium text-gray-800">
//         {courseId ? "Student Feedback" : "Testimonials"}
//       </h2>

//       {testimonials.length === 0 ? (
//         <p className="text-gray-500 mt-3 italic">
//           No feedback yet for this course.
//         </p>
//       ) : (
//         <>
//           <div className="grid grid-cols-auto gap-8 mt-14">
//             {displayTestimonials.map((testimonial, index) => (
//               <div
//                 key={index}
//                 className="text-sm text-left border border-gray-300 pb-6 rounded-lg bg-white shadow-md overflow-hidden p-5"
//               >
//                 <p className="font-medium text-gray-800 mb-2">
//                   {testimonial.userId?.name || "Anonymous"}
//                 </p>
//                 <p className="text-gray-700">{testimonial.message}</p>
//               </div>
//             ))}
//           </div>

//           {testimonials.length > 0 && (
//             <button
//               onClick={() => setShowAll(!showAll)}
//               className="mt-6 text-blue-600 underline"
//             >
//               {showAll ? "Show Less" : "Show More"}
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// TestimonialsSection.propTypes = {
//   courseId: PropTypes.string,
// };


// export default TestimonialsSection;