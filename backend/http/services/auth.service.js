import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from "../../env.js";

let prisma = new PrismaClient();

export async function signup({ email, password, name ,role }) {
    const existing = await prisma.user.findUnique({
        where: { email }
    });

    if (existing) {
        const err = new Error("Email already exists");
        err.status = 409;
        throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            password: passwordHash,
            name,
            role
        }
    });

    const token = jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role:user.role
        },
        token
    };
}

export async function signin({ email, password }) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        const err = new Error("Invalid email");
        err.status = 401;
        throw err;
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
        const err = new Error("Invalid password");
        err.status = 401;
        throw err;
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token
    };
}