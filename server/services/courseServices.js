import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";

export async function getEducatorCoursesAndPurchases(educatorId) {
  const courses = await Course.find({ educator: educatorId });
  const courseIds = courses.map(course => course._id);

  const purchases = await Purchase.find({
    courseId: { $in: courseIds },
    status: 'completed'
  });

  return { courses, courseIds, purchases };
}
