import * as api from "../../api"
import { openAlertMessage } from './alertAction';


export const authAction={
    SET_USER_DETAILS:"AUTH.SET_USER_DETAILS"

}

export const setUserDetails=(userDetails)=>{
    return{
        type:authAction.SET_USER_DETAILS,
        userDetails
    }
}

export const getAction=(dispatch)=>{
    return{
        login:(userDetails,Navigate)=>dispatch(login(userDetails,Navigate)),
        register:(userDetails,Navigate)=>dispatch(register(userDetails,Navigate)),
        setUserDetails:(userDetails)=>dispatch(setUserDetails(userDetails))
    }
}

export const login =(userDetails,Navigate) =>{
    return async(dispatch)=>{
        const response = await api.login(userDetails)
        if (response.error) {
            console.log("API ERROR RESPONSE:", response.response);
          
            const message =
              response?.response?.data?.message ||
              "An error occurred";
              
            dispatch(openAlertMessage(message));
        }
        else{
            const{userDetails}=response.data;
            localStorage.setItem("user",JSON.stringify(userDetails))
            dispatch(setUserDetails(userDetails));
            Navigate("/dashboard");
        }
    }
    
}

export const register =(userDetails,Navigate) =>{
    return async(dispatch)=>{
        const response = await api.register(userDetails)
        if (response.error) {
            console.log("API ERROR RESPONSE:", response.response);
          
            const message =
              response?.response?.data?.message ||
              "An error occurred";
              
            dispatch(openAlertMessage(message));
        }
        else{
            const{userDetails}=response.data;
            localStorage.setItem("user",JSON.stringify(userDetails))
            dispatch(setUserDetails(userDetails));
            Navigate("/login");
        }
    }
    
}