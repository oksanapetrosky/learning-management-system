// import { populateEducator, filterLecturePreviews, asyncHandler } from "../utils/index.js";
import Course from "../models/Course.js";


//Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator", select: "-password" });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// export const getAllCourses = asyncHandler(async (req, res) => {
//   const courses = await Course.find({ isPublished: true })
//     .select(["-courseContent", "-enrolledStudents"])
//     .populate(populateEducator);

//   res.json({ success: true, courses });
// });


//Get Course by Id
export const getCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    //Remove lectureUrl if isPreviewFree is false
    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });
    res.json({ success: true, courseData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// export const getCourseId = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const courseData = await Course.findById(id).populate({ path: "educator" });

//   filterLecturePreviews(courseData); // apply helper
//   res.json({ success: true, courseData });
// });
