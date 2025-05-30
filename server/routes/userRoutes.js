import express from 'express';
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js';
// import { protectRoute } from "../middlewares/authMiddleware.js";
// import { requireAuth } from '@clerk/express';

const userRouter = express.Router()

//additional step for creating a new user
// userRouter.get("/init", protectRoute, initUserIfMissing);

userRouter.get('/data', getUserData)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)
// Apply to route
// userRouter.post('/api/user/purchase', requireAuth(), purchaseCourse);
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)


export default userRouter;