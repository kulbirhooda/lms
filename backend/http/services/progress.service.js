import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function markLessonComplete({ userId, lessonId }) {
  const progress = await prisma.progress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
  });
  return { progress };
}

export async function getCourseProgress({ userId, courseId }) {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { id: true },
  });

  const completed = await prisma.progress.findMany({
    where: {
      userId,
      lessonId: { in: lessons.map((l) => l.id) },
      completed: true,
    },
  });

  return {
    total: lessons.length,
    completed: completed.length,
    completedLessonIds: completed.map((p) => p.lessonId),
  };
}