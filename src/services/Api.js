import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000/"
});


api.interceptors.request.use(async config => {
    config.headers = {'Content-Type': 'application/json'};

  
  return config;
});


api.interceptors.response.use( async response => {
  return response;
}, error => {
  return Promise.reject(error);
});

export default api;