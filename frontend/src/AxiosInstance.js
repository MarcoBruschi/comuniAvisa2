import axios from "axios";

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_URL_BASE,
  withCredentials: true
});

axiosAuth.interceptors.request.use(req => {
  req.withCredentials = true;
  return req;
});

axiosAuth.interceptors.response.use(res => {
  return res;
}, async erro => {
  const primeiroRequest = erro.config;

  if (erro.config.url.includes("/refreshToken")) {
    return Promise.reject(erro);
  }

  if ([401, 403].includes(erro.response?.status) && !primeiroRequest._retry) {
    primeiroRequest._retry = true;
    try {
      const response = await axiosAuth.post("/api/auth/refreshToken", {});
      return axiosAuth(primeiroRequest);
    } catch (erro) {
      return Promise.reject(erro);
    }
  }
  return Promise.reject(erro);
});

export default axiosAuth;