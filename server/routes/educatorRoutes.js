import express from 'express';
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleEducator, updateCourse, getSingleCourse } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

//Add Educator Role

educatorRouter.get('/update-role', updateRoleEducator);
educatorRouter.post('/add-course', upload.single('image'), 
protectEducator, addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)
educatorRouter.put('/update-course/:id', upload.single('image'), protectEducator, updateCourse);
educatorRouter.get('/course/:id', protectEducator, getSingleCourse);

export default educatorRouter;