import axios from "./axios";
import auth from "../lib/auth";

const authHeaders = () => ({
  Authorization: `Bearer ${auth.token}`,
});

export const assignmentApi = {
  getCourseAssignments: async (courseId) => {
    const { data } = await axios({
      method: "get",
      url: "/api/courses/" + courseId + "/assignments",
      headers: authHeaders(),
    });
    return data;
  },

  createAssignment: async (courseId, formData) => {
    const { data } = await axios({
      method: "post",
      url: "/api/courses/" + courseId + "/assignments",
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    return data;
  },

  submitAssignment: async (assignmentId, formData) => {
    const { data } = await axios({
      method: "post",
      url: "/api/assignments/" + assignmentId + "/submit",
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    return data;
  },

  getMySubmissions: async () => {
    const { data } = await axios({
      method: "get",
      url: "/api/assignments/submissions",
      headers: authHeaders(),
    });
    return data;
  },
};