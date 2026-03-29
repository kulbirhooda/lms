import axios from "./axios";
import auth from "../lib/auth";

const authHeaders = () => ({
  Authorization: `Bearer ${auth.token}`,
});

export const progressApi = {
  markComplete: async (lessonId) => {
    const { data } = await axios({
      method: "post",
      url: "/api/lessons/" + lessonId + "/complete",
      headers: authHeaders(),
    });
    return data;
  },

  getCourseProgress: async (courseId) => {
    const { data } = await axios({
      method: "get",
      url: "/api/courses/" + courseId + "/progress",
      headers: authHeaders(),
    });
    return data;
  },
};