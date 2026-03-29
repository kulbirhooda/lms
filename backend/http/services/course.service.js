import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createCourse({ title, description, thumbnail, instructorId }) {
  const course = await prisma.course.create({
    data: { title, description, thumbnail, instructorId },
  });
  return { course };
}

export async function getInstructorCourses(instructorId) {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { enrollments: true, lessons: true }
      }
    }
  });
  return { courses };
}
export async function getAllCourses() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      instructor: {
        select: { name: true }
      },
      _count: {
        select: { enrollments: true, lessons: true }
      }
    }
  });
  return { courses };
}

export async function enrollInCourse({ courseId, userId }) {
  // check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } }
  });
  if (existing) {
    const err = new Error("Already enrolled");
    err.status = 409;
    throw err;
  }
  const enrollment = await prisma.enrollment.create({
    data: { userId, courseId }
  });
  return { enrollment };
}

export async function getEnrolledCourses(userId) {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { name: true } },
          _count: { select: { lessons: true } }
        }
      }
    }
  });
  return { courses: enrollments.map(e => e.course) };
}
export async function addLesson({ courseId, title, videoUrl, order }) {
  // auto-calculate order if not provided
  if (!order) {
    const count = await prisma.lesson.count({ where: { courseId } });
    order = count + 1;
  }
  const lesson = await prisma.lesson.create({
    data: { courseId, title, videoUrl, order },
  });
  return { lesson };
}

export async function getCourseLessons(courseId) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });
  return { lessons };
}