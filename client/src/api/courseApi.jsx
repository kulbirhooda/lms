import axios from "./axios";
import auth from "../lib/auth";

const authHeaders = () => ({
  Authorization: `Bearer ${auth.token}`,
});

export const courseApi = {
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
      url: "/api/courses/" + courseId + "/enroll",
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

  addLesson: async (courseId, { title, videoFile }) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", videoFile);
    const { data } = await axios({
      method: "post",
      url: "/api/courses/" + courseId + "/lessons",
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    return data;
  },

  getCourseLessons: async (courseId) => {
    const { data } = await axios({
      method: "get",
      url: "/api/courses/" + courseId + "/lessons",
      headers: authHeaders(),
    });
    return data;
  },
};