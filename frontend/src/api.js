import axios from 'axios'
import { logout } from './utils/Auth';
import BASE_URL from "./utils/BASE_URL"; 


const apiClient = axios.create({
    baseURL :`${BASE_URL}/api/`,
    timeout:1000,
})

apiClient.interceptors.request.use((config)=>{
  const userDetails =localStorage.getItem("user");
  if(userDetails){
    const token =JSON.parse(userDetails).token;
    config.headers.Authorization=`Bearer ${token}`;
  }
  return config;
},(err)=>{
  return Promise.reject(err);
}
)

export const login = async (data) => {
    try {
      return await apiClient.post('/auth/login', data);
    } catch (error) {
      return {
        error: true,
        response: error.response  // this contains the status + data + message
      };
    }
  };
  

  export const register = async (data) => {
    try {
      return await apiClient.post('/auth/register', data);
    } catch (error) {
      return {
        error: true,
        response: error.response
      };
    }
  };

  const checkResponseCode=(error)=>{
    const responseCode = error?.response?.status;
    if(responseCode){
      (responseCode === 401 || responseCode === 403) && logout();
    }
  }