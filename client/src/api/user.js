import { timeoutAxios } from "./api/axiosInstances";

const UserServices = {
  loginStatus: () => {
    timeoutAxios
      .get("/api/logged_in", { withCredentials: true })
      .then((response) => response.data)
      .catch((error) => console.log("api errors:", error));
  },
}

export default UserServices;
