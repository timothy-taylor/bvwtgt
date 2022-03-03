import { timeoutAxios } from "./api/axiosInstances";
import CSRFToken from "../Cookies";

const PostServices = {
  getPosts: () => {
    timeoutAxios
      .get("/api/posts")
      .then((response) => response.data)
      .catch((error) => console.log(error));
  },
  createPost: (post, id) => {
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
      .then((response) => {
        if (response.status === 201) {
          // success
        } else {
          console.log(response.status);
        }
      })
      .catch((error) => console.log("api errors:", error));
  },
  getPost: (id) => {
   timeoutAxios
      .get("/api/posts/" + id, {
        id: id,
      })
      .then((response) => response.data) 
      .catch((error) => console.log(error));

  }
};

export default PostServices;
