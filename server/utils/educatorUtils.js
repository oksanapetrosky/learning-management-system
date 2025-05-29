// utils/educatorUtils.js
import User from "../models/User.js";
import { getEducatorCoursesAndPurchases } from "../services/courseServices.js";

export async function getEducatorDashboardData(educatorId) {
  const { courses, purchases } = await getEducatorCoursesAndPurchases(educatorId);

  const totalCourses = courses.length;
  const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  const enrolledStudentsData = await Promise.all(
    courses.map(async (course) => {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );
      return students.map((student) => ({
        courseTitle: course.courseTitle,
        student,
      }));
    })
  );

  return {
    totalCourses,
    totalEarnings,
    enrolledStudentsData: enrolledStudentsData.flat(),
  };
}
