// import { clerkClient } from "@clerk/express";
// import Course from "../models/Course.js";
// import { v2 as cloudinary } from "cloudinary";
// import { Purchase } from "../models/Purchase.js";
// import User from '../models/User.js'
// import { getEducatorId, uploadImageToCloudinary, getEducatorCoursesAndPurchases } from "../utils/index.js";
// import { getEducatorDashboardData } from "../utils/educatorUtils.js";


// //update role to educator
// export const updateRoleEducator = async (req, res) => {
//   try {
//     const userId = req.auth.userId;

//     await clerkClient.users.updateUserMetadata(userId, {
//       publicMetadata: {
//         role: "educator",
//       },
//     });

//     res.json({ success: true, message: "You can publish a course now" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // Add new Course

// export const addCourse = async (req, res) => {
//   try {
//     const { courseData } = req.body;
//     const imageFile = req.file;
//     const educatorId = req.auth.userId;

//     if (!imageFile) {
//       return res.json({ success: false, message: "Thumbnail Not Attached" });
//     }
//     const parseCourseData = await JSON.parse(courseData);
//     parseCourseData.educator = educatorId;
//     const newCourse = await Course.create(parseCourseData);

//     // const imageUpload = await cloudinary.uploader.upload(imageFile.path);
//     // newCourse.courseThumbnail = imageUpload.secure_url;

//     newCourse.courseThumbnail = await uploadImageToCloudinary(imageFile.path);

//     await newCourse.save();

//     res.json({ success: true, message: "Course Added" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
// // server/controllers/courseController.js

// // export const editCourse = async (req, res) => {
// //   const { id } = req.body;

// //   try {
// //     const updateFields = {
// //       courseTitle: req.body.courseTitle,
// //       coursePrice: req.body.coursePrice,
// //       discount: req.body.discount,
// //       courseDescription: req.body.courseDescription,
// //     };

// //     if (req.file) {
// //       updateFields.image = req.file.filename;
// //     }

// //     const updatedCourse = await Course.findByIdAndUpdate(id, updateFields, {
// //       new: true,
// //     });

// //     if (!updatedCourse) {
// //       return res.status(404).json({ success: false, message: "Course not found" });
// //     }

// //     res.json({ success: true, message: "Course updated successfully", course: updatedCourse });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: "Error updating course", error: error.message });
// //   }
// // };

// export const editCourse = async (req, res) => {
//   const { id } = req.params;
//   const { courseTitle, coursePrice, discount, courseDescription } = req.body;
//   const imageFile = req.file;

//   if (!courseTitle && !coursePrice && !discount && !courseDescription && !req.file) {
//     return res.status(400).json({ success: false, message: "No changes provided" });
//   }

//   try {
//     const course = await Course.findById(id).populate({ path: "educator" });

//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     if (courseTitle) course.courseTitle = courseTitle;
//     if (coursePrice) course.coursePrice = coursePrice;
//     if (discount) course.discount = discount;
//     if (courseDescription) course.courseDescription = courseDescription;
//     if (req.file) course.courseThumbnail = req.file.path;

//     await course.save();

//     res.json({ success: true, message: "Course updated successfully" });
//   } catch (error) {
//     console.error("Edit error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // Delete course
// export const deleteCourse = async (req, res) => {
//   try {
//     await Course.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Course deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // Get Educator Courses
// export const getEducatorCourses = async (req, res) => {
//   try {
//     // const educator = req.auth.userId;
//     // const courses = await Course.find({ educator });

// //refactoring to use utility function
// const educator = getEducatorId(req);
// const courses = await Course.find({ educator });

//     console.log("No educator route matched:", req.method, req.originalUrl);
//     res.json({ success: true, courses });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// //Get Educator Dashnoard Data (Total earning, enrolled students, No of courses)
// // export const educatorDashboardData = async (req, res) => {
// //   try {
// //     const educator = req.auth.userId;
// //     const courses = await Course.find({ educator });
// //     const totalCourses = courses.length;

// //     const courseIds = courses.map(course => course._id );

// // //calculate total earnings from purchases
// // const purchases = await Purchase.find({
// //   courseId: {$in: courseIds},
// //   status: 'completed'
// // });

// // const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

// //refactoring to use utility function
// export const educatorDashboardData = async (req, res) => {
//   try {
//     const educator = getEducatorId(req); // assume this is already defined
//     const dashboardData = await getEducatorDashboardData(educator);

//     res.json({
//       success: true,
//       dashboardData,
//     });
//   } catch (error) {
//     console.error("Error loading educator dashboard:", error);
//     res.status(500).json({ success: false, message: "Server error loading dashboard" });
//   }
// };


// //Collect unique enrolled student IDs with their course titles
// import { clerkClient } from "@clerk/express";
// import Course from "../models/Course.js";
// import { v2 as cloudinary } from "cloudinary";
// import { Purchase } from "../models/Purchase.js";
// import User from '../models/User.js'
// import { getEducatorId, uploadImageToCloudinary, getEducatorCoursesAndPurchases } from "../utils/index.js";
// import { getEducatorDashboardData } from "../utils/educatorUtils.js";


// //update role to educator
// export const updateRoleEducator = async (req, res) => {
//   try {
//     const userId = req.auth.userId;

//     await clerkClient.users.updateUserMetadata(userId, {
//       publicMetadata: {
//         role: "educator",
//       },
//     });

//     res.json({ success: true, message: "You can publish a course now" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // Add new Course

// export const addCourse = async (req, res) => {
//   try {
//     const { courseData } = req.body;
//     const imageFile = req.file;
//     const educatorId = req.auth.userId;

//     if (!imageFile) {
//       return res.json({ success: false, message: "Thumbnail Not Attached" });
//     }
//     const parseCourseData = await JSON.parse(courseData);
//     parseCourseData.educator = educatorId;
//     const newCourse = await Course.create(parseCourseData);

//     // const imageUpload = await cloudinary.uploader.upload(imageFile.path);
//     // newCourse.courseThumbnail = imageUpload.secure_url;

//     newCourse.courseThumbnail = await uploadImageToCloudinary(imageFile.path);

//     await newCourse.save();

//     res.json({ success: true, message: "Course Added" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };
// // server/controllers/courseController.js

// // export const editCourse = async (req, res) => {
// //   const { id } = req.body;

// //   try {
// //     const updateFields = {
// //       courseTitle: req.body.courseTitle,
// //       coursePrice: req.body.coursePrice,
// //       discount: req.body.discount,
// //       courseDescription: req.body.courseDescription,
// //     };

// //     if (req.file) {
// //       updateFields.image = req.file.filename;
// //     }

// //     const updatedCourse = await Course.findByIdAndUpdate(id, updateFields, {
// //       new: true,
// //     });

// //     if (!updatedCourse) {
// //       return res.status(404).json({ success: false, message: "Course not found" });
// //     }

// //     res.json({ success: true, message: "Course updated successfully", course: updatedCourse });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: "Error updating course", error: error.message });
// //   }
// // };

// export const editCourse = async (req, res) => {
//   const { id } = req.params;
//   const { courseTitle, coursePrice, discount, courseDescription } = req.body;
//   const imageFile = req.file;

//   if (!courseTitle && !coursePrice && !discount && !courseDescription && !req.file) {
//     return res.status(400).json({ success: false, message: "No changes provided" });
//   }

//   try {
//     const course = await Course.findById(id).populate({ path: "educator" });

//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     if (courseTitle) course.courseTitle = courseTitle;
//     if (coursePrice) course.coursePrice = coursePrice;
//     if (discount) course.discount = discount;
//     if (courseDescription) course.courseDescription = courseDescription;
//     if (req.file) course.courseThumbnail = req.file.path;

//     await course.save();

//     res.json({ success: true, message: "Course updated successfully" });
//   } catch (error) {
//     console.error("Edit error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // Delete course
// export const deleteCourse = async (req, res) => {
//   try {
//     await Course.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: "Course deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };


// // Get Educator Courses
// export const getEducatorCourses = async (req, res) => {
//   try {
//     // const educator = req.auth.userId;
//     // const courses = await Course.find({ educator });

// //refactoring to use utility function
// const educator = getEducatorId(req);
// const courses = await Course.find({ educator });

//     console.log("No educator route matched:", req.method, req.originalUrl);
//     res.json({ success: true, courses });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// //Get Educator Dashnoard Data (Total earning, enrolled students, No of courses)
// // export const educatorDashboardData = async (req, res) => {
// //   try {
// //     const educator = req.auth.userId;
// //     const courses = await Course.find({ educator });
// //     const totalCourses = courses.length;

// //     const courseIds = courses.map(course => course._id );

// // //calculate total earnings from purchases
// // const purchases = await Purchase.find({
// //   courseId: {$in: courseIds},
// //   status: 'completed'
// // });

// // const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

// //refactoring to use utility function
// export const educatorDashboardData = async (req, res) => {
//   try {
//     const educator = getEducatorId(req); // assume this is already defined
//     const dashboardData = await getEducatorDashboardData(educator);

//     res.json({
//       success: true,
//       dashboardData,
//     });
//   } catch (error) {
//     console.error("Error loading educator dashboard:", error);
//     res.status(500).json({ success: false, message: "Server error loading dashboard" });
//   }
// };


// //Collect unique enrolled student IDs with their course titles
// const enrolledStudentsData = [];
// for(const course of courses){
//   const students = await User.find({
//     _id: {$in: course.enrolledStudents}
//   }, 'name imageUrl')

//   students.forEach(student => {
//     enrolledStudentsData.push({
//       courseTitle: course.courseTitle,
//       student
//     });
//   });
// }
// res.json({ success: true, dashboardData: {
//   totalEarnings, enrolledStudentsData, totalCourses
// }})

//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };


// //Get Enrolled Students Data with Purchase Data
// export const getEnrolledStudentsData = async (req, res) => {
//   try {
//     const educator = req.auth.userId;
//     const courses = await Course.find({ educator });
//     const courseIds = courses.map(course => course._id );

//     const purchases = await Purchase.find({
//       courseId: { $in: courseIds },
//       status: 'completed'
//     }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

//     const enrolledStudents = purchases.map(purchase => ({
//       student: purchase.userId,
//       courseTitle: purchase.courseId.courseTitle,
//       purchaseDate: purchase.createdAt
//     }));
//     res.json({ success: true, enrolledStudents })

//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// }

// //Define the getSingleCourse
// const enrolledStudentsData = [];
// for(const course of courses){
//   const students = await User.find({
//     _id: {$in: course.enrolledStudents}
//   }, 'name imageUrl')

//   students.forEach(student => {
//     enrolledStudentsData.push({
//       courseTitle: course.courseTitle,
//       student
//     });
//   });
// }
// res.json({ success: true, dashboardData: {
//   totalEarnings, enrolledStudentsData, totalCourses
// }})

//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };



// //Define the getSingleCourse

// export const getSingleCourse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const course = await Course.findById(id);

//     if (!course) {
//       return res.status(404).json({ success: false, message: "Course not found" });
//     }

//     res.status(200).json({ success: true, course });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

//refactoring to use utility function
import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from '../models/User.js';
import { getEducatorId, uploadImageToCloudinary, getEducatorCoursesAndPurchases } from "../utils/index.js";
import { getEducatorDashboardData } from "../utils/educatorUtils.js";

// Update role to educator
export const updateRoleEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add new Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parseCourseData = JSON.parse(courseData);
    parseCourseData.educator = educatorId;
    const newCourse = await Course.create(parseCourseData);

    newCourse.courseThumbnail = await uploadImageToCloudinary(imageFile.path);
    await newCourse.save();

    res.json({ success: true, message: "Course Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Edit Course
export const editCourse = async (req, res) => {
  const { id } = req.params;
  const { courseTitle, coursePrice, discount, courseDescription } = req.body;
  const imageFile = req.file;

  if (!courseTitle && !coursePrice && !discount && !courseDescription && !req.file) {
    return res.status(400).json({ success: false, message: "No changes provided" });
  }

  try {
    const course = await Course.findById(id).populate({ path: "educator" });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (courseTitle) course.courseTitle = courseTitle;
    if (coursePrice) course.coursePrice = coursePrice;
    if (discount) course.discount = discount;
    if (courseDescription) course.courseDescription = courseDescription;
    if (req.file) course.courseThumbnail = req.file.path;

    await course.save();

    res.json({ success: true, message: "Course updated successfully" });
  } catch (error) {
    console.error("Edit error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = getEducatorId(req);
    const courses = await Course.find({ educator });

    console.log("No educator route matched:", req.method, req.originalUrl);
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = getEducatorId(req);
    const dashboardData = await getEducatorDashboardData(educator);

    res.json({
      success: true,
      dashboardData,
    });
  } catch (error) {
    console.error("Error loading educator dashboard:", error);
    res.status(500).json({ success: false, message: "Server error loading dashboard" });
  }
};

// Get Enrolled Students Data with Purchase Info
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    })
      .populate('userId', 'name imageUrl')
      .populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Single Course
export const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
