import React,{useState,useEffect} from 'react';
import AuthBOX from '../../../components/AuthBOX';
import LoginHeader from './LoginHeader.jsx';
import LoginInputs from './LoginInputs.jsx';
import LoginFooter from './LoginFooter.jsx';
import { validateLoginForm } from '../../../utils/Validate.js';
import {useDispatch} from 'react-redux';
import { login } from '../../../store/actions/authAction.js';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mail, setmail] = useState("");
  const [password, setpassword] = useState("");
  const [isFormated, setisFormated] = useState(false)

  useEffect(()=>{
    setisFormated(validateLoginForm({mail}))
  },[mail,password,setisFormated])
  const handleLogin=async()=>{
    if(isFormated){
        const userDetails ={
        mail,
        password
      }
      try {
        await dispatch(login(userDetails,navigate))
      } catch (error) {
            
      }
    }
  }
  return (
    <AuthBOX height={230}>
        <LoginHeader/>
        <LoginInputs
        mail={mail}
        setmail={setmail}
        password={password}
        setpassword={setpassword}
        />
        <LoginFooter handleLogin={handleLogin} isFormated={isFormated} />
    </AuthBOX>
  )
}

export default LoginPage;