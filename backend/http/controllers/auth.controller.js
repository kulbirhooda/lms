import { signin, signup } from "../services/auth.service.js";
import { signinSchema, signupSchema } from "../schemas/auth.schemas.js";

export async function postStudentSignup(req, res) {
    try {
        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: result.error.flatten()
            });
        }

        const data = await signup({
            ...result.data,
            role: "STUDENT"
        });

        return res.status(200).json(data);

    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message
        });
    }
}

export async function postInstructorSignup(req, res) {
    try {
        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: result.error.flatten()
            });
        }

        const data = await signup({
            ...result.data,
            role: "INSTRUCTOR"
        });

        return res.status(200).json(data);

    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message
        });
    }
}

export async function postSignin(req, res) {
    try {
        const result = signinSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: result.error.flatten()
            });
        }

        const data = await signin(result.data);

        return res.status(200).json(data);

    } catch (error) {
        return res.status(error.status || 500).json({
            message: error.message
        });
    }
}

export async function getMe(req, res) {
    return res.status(200).json({
        user: req.user
    });
}