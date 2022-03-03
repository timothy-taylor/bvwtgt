import { timeoutAxios } from "./axiosInstances";
import CSRFToken from "../Cookies";

const PostServices = {

  getPosts: () =>
    timeoutAxios
      .get("/api/posts")
      .then((response) => response.data)
      .catch((error) => console.log(error)),

  getPost: (id) =>
    timeoutAxios
      .get("/api/posts/" + id, {
        id: id,
      })
      .then((response) => response.data)
      .catch((error) => console.log(error)),

  createPost: (post) =>
    timeoutAxios
      .post(
        "/api/posts",
        {
          post: {
            title: post.title,
            content: post.content,
            tag_id: post.tag,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken(document.cookie),
          },
        },
        { withCredentials: true }
      )
      .then((response) => response.status)
      .catch((error) => console.log("api errors:", error)),

  updatePost: (post, id) =>
    timeoutAxios
      .patch(
        "/api/posts/" + id,
        {
          post: {
            title: post.title,
            content: post.content,
            tag_id: post.tag,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken(document.cookie),
          },
        },
        { withCredentials: true }
      )
      .then((response) => response.status)
      .catch((error) => console.log("api errors:", error)),

  getTags: () =>
    timeoutAxios
      .get("/api/tags")
      .then((response) => response.data)
      .catch((error) => console.log(error)),

  newTag: (name) =>
    timeoutAxios
      .post(
        "/api/tags",
        {
          tag: {
            name: name,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken(document.cookie),
          },
        },
        { withCredentials: true }
      )
      .then((response) => response.status)
      .catch((error) => console.log("api errors:", error)),
};

export default PostServices;
