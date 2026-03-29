import axios from "./axios";
import auth from "../lib/auth";

const authHeaders = () => ({
  Authorization: `Bearer ${auth.token}`,
});

export const courseApi = {
  // Instructor
  createCourse: async ({ title, description, thumbnail }) => {
    const { data } = await axios({
      method: "post",
      url: "/api/courses",
      headers: authHeaders(),
      data: { title, description, thumbnail },
    });
    return data;
  },

  getInstructorCourses: async () => {
    const { data } = await axios({
      method: "get",
      url: "/api/courses",
      headers: authHeaders(),
    });
    return data;
  },

  // Student
  getAllCourses: async () => {
    const { data } = await axios({
      method: "get",
      url: "/api/courses/all",
      headers: authHeaders(),
    });
    return data;
  },

  enrollInCourse: async (courseId) => {
    const { data } = await axios({
      method: "post",
      url: `/api/courses/${courseId}/enroll`,
      headers: authHeaders(),
    });
    return data;
  },

  getEnrolledCourses: async () => {
    const { data } = await axios({
      method: "get",
      url: "/api/courses/enrolled",
      headers: authHeaders(),
    });
    return data;
  },
  addLesson: async (courseId, { title, videoUrl }) => {
    const { data } = await axios({
      method: "post",
      url: `/api/courses/${courseId}/lessons`,
      headers: authHeaders(),
      data: { title, videoUrl },
    });
    return data;
  },

  getCourseLessons: async (courseId) => {
    const { data } = await axios({
      method: "get",
      url: `/api/courses/${courseId}/lessons`,
      headers: authHeaders(),
    });
    return data;
  },
};