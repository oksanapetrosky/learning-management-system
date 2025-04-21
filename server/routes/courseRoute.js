import express from 'express';
import { getAllCourses, getCourseId } from '../controllers/CourseController.js'
const router = express.Router();
import { protectEducator } from '../middlewares/authMiddleware.js';

const courseRouter = express.Router()


courseRouter.get('/all', getAllCourses)
courseRouter.get('/:id', getCourseId)


export default courseRouter;