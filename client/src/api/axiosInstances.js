import axios from "axios";

export const timeoutAxios = axios.create({ timeout: 1000 });
