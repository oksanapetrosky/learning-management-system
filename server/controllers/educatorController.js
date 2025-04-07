import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from "../models/Purchase.js";
import User from '../models/User.js'

//update role to educator
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
    const parseCourseData = await JSON.parse(courseData);
    parseCourseData.educator = educatorId;
    const newCourse = await Course.create(parseCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: "Course Added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get Educator Dashnoard Data (Total earning, enrolled students, No of courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map(course => course._id );

//calculate total earnings from purchases
const purchases = await Purchase.find({
  courseId: {$in: courseIds},
  status: 'completed'
});

const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0)

//Collect unique enrolled student IDs with their course titles
const enrolledStudentsData = [];
for(const course of courses){
  const students = await User.find({
    _id: {$in: course.enrolledStudents}
  }, 'name imageUrl')

  students.forEach(student => {
    enrolledStudentsData.push({
      courseTitle: course.courseTitle,
      student
    });
  });
}
res.json({ success: true, dashboardData: {
  totalEarnings, enrolledStudentsData, totalCourses
}})

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Update a course information
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseData = JSON.parse(req.body.courseData);
    let updatedData = {
      ...courseData
    };

    // If a new image is uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file); // assuming you have this util
      updatedData.courseThumbnail = result.secure_url;
    }

    const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

    res.json({ success: true, course: updatedCourse, message: 'Course updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id );

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));
    res.json({ success: true, enrolledStudents })

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

//Define the getSingleCourse

export const getSingleCourse = async (req, res) => {
  try {
    console.log("Request for course:", req.params.id);
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, courseData: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};