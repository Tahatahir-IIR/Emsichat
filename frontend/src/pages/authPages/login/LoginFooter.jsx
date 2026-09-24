import React from 'react'
import CustomPrimaryButton from '../../../components/CustomPrimaryButton'
import RedirectInfo from '../../../components/RedirectInfo'
import {useNavigate} from 'react-router-dom'
import { Tooltip } from '@mui/material'

export default function LoginFooter({handleLogin,isFormated}) {
    const navigate = useNavigate();
    const handlePushToRegisterPage=()=>{
         navigate('/register')
    }
    const getFormatedValidMessage=()=>{
      return 'Press to log in!'
    }
    const getformatedNotValidMessage=()=>{
      return 'E-mail not valid'
    }
  return (
    <>
    <Tooltip
    title={!isFormated?getformatedNotValidMessage():getFormatedValidMessage()}
    >
    <div>
    <CustomPrimaryButton
    label="Login"
    additionnalStyle={{marginTop:"10px" }}
    disabled={!isFormated}
    onClick={handleLogin}
    />
    </div>
    </Tooltip>
    <RedirectInfo  
    text="Need an account? " 
    redirectText="Create an Account" 
    additionnalStyle={{marginTop:'5px'}}
    redirectHandler={handlePushToRegisterPage}
    />
    </>
  )
}
