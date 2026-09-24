import React,{useState,useEffect} from 'react';
import AuthBOX from '../../../components/AuthBOX';
import RegisterHeader from './RegisterHeader.jsx';
import RegisterInputs from './RegisterInputs.jsx';
import RegisterFooter from './RegisterFooter.jsx';
import { validateRegisterForm } from '../../../utils/Validate.js';
import {useDispatch} from 'react-redux';
import { register } from '../../../store/actions/authAction.js';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setusername] = useState(""); 
  const [mail, setmail] = useState("");
  const [password, setpassword] = useState("");
  const [isFormated, setisFormated] = useState(false)

  useEffect(()=>{
      setisFormated(validateRegisterForm({username,mail,password}))
  },[username,mail,password,setisFormated])
  const handleRegister=async()=>{
    if(isFormated){
      const userDetails ={
        username,
        mail,
        password
      }
      try {
        await dispatch(register(userDetails,navigate))
      } catch (error) {
        
      }
    }
  }
  return (
    <AuthBOX  height={280}>
        <RegisterHeader/>
        <RegisterInputs
        username={username}
        setusername={setusername}
        mail={mail}
        setmail={setmail}
        password={password}
        setpassword={setpassword}
        />
        <RegisterFooter handleRegister={handleRegister} isFormated={isFormated} />
    </AuthBOX>
  )
}

export default RegisterPage;