import { timeoutAxios } from "./axiosInstances";
import CSRFToken from "../Cookies";

const UserServices = {

  loginStatus: () => (
    timeoutAxios
      .get("/api/logged_in", { withCredentials: true })
      .then((response) => response.data)
      .catch((error) => console.log("api errors:", error))
  ),

  login: (email,password) => (
    timeoutAxios
      .post(
        "/api/login",
        {
          user: {
            email: email,
            password: password,
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
      .then((response) => response.data)
      .catch((error) => console.log("api errors:", error))
  ),

  logout: () => (
    timeoutAxios
      .delete(
        "/api/logout",
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": CSRFToken(document.cookie),
          },
        },
        { withCredentials: true }
      )
      .then((response) => response.data)
      .catch((error) => console.log("api errors:", error))
  ),

}

export default UserServices;
