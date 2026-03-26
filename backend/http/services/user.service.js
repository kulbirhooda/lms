import { PrismaClient } from "@prisma/client";
let prisma = new PrismaClient();

export async function dashboard(userId) {
    const enrollments = await prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    lessons: true
                }
            }
        }
    });

    const courses = enrollments.map(e => {
        const total = e.course.lessons.length;

        return {
            id: e.course.id,
            title: e.course.title,
            progress: total === 0 ? 0 : 0 // we’ll improve later
        };
    });

    return { courses };
}