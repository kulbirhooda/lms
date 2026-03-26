import { Router } from "express";
import {
    postStudentSignup,
    postInstructorSignup,
    postSignin,
    getMe
} from "../controllers/auth.controller.js";
import requireAuth from "../middlewares/requireAuth.js";

const router = Router();

// Signup
router.post('/signup', postStudentSignup);
router.post('/signup/instructor', postInstructorSignup);

// Single Signin
router.post('/signin', postSignin);

// Me
router.get('/me', requireAuth, getMe);

export default router;