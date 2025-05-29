// utils/index.js
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";


// 1. Educator populate config (used in .populate)
export const populateEducator = {
  path: "educator",
  select: "-password",
};

// 2. Remove private lecture URLs if isPreviewFree is false
export const filterLecturePreviews = (courseData) => {
  courseData.courseContent.forEach((chapter) => {
    chapter.chapterContent.forEach((lecture) => {
      if (!lecture.isPreviewFree) {
        lecture.lectureUrl = "";
      }
    });
  });
  return courseData;
};

// 3. Wrap async route handlers (to avoid try/catch repetition)
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ✅ Add to utils/index.js

export const getEducatorId = (req) => req.auth?.userId;

export const uploadImageToCloudinary = async (filePath) => {
  const uploadResult = await cloudinary.uploader.upload(filePath);
  return uploadResult.secure_url;
};

export const getEducatorCoursesAndPurchases = async (educatorId) => {
  const courses = await Course.find({ educator: educatorId });
  const courseIds = courses.map(course => course._id);
  const purchases = await Purchase.find({
    courseId: { $in: courseIds },
    status: 'completed'
  });
  return { courses, courseIds, purchases };
};

