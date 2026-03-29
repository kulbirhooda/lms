import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createAssignment({ courseId, title, description, deadline, questionFileUrl }) {
  const assignment = await prisma.assignment.create({
    data: {
      courseId,
      title,
      description,
      deadline: deadline ? new Date(deadline) : null,
      questionFileUrl, // ← we'll add this to schema next
    },
  });
  return { assignment };
}

export async function getCourseAssignments(courseId) {
  const assignments = await prisma.assignment.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { submissions: true } },
    },
  });
  return { assignments };
}

export async function submitAssignment({ assignmentId, userId, fileUrl, note }) {
  const existing = await prisma.submission.findUnique({
    where: { assignmentId_userId: { assignmentId, userId } },
  });
  if (existing) {
    const err = new Error("Already submitted");
    err.status = 409;
    throw err;
  }
  const submission = await prisma.submission.create({
    data: { assignmentId, userId, fileUrl, note },
  });
  return { submission };
}

export async function getStudentSubmissions(userId) {
  const submissions = await prisma.submission.findMany({
    where: { userId },
    include: {
      assignment: {
        select: { title: true, courseId: true },
      },
    },
    orderBy: { submittedAt: "desc" },
  });
  return { submissions };
}