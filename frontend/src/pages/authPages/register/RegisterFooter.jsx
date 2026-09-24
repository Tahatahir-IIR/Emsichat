import React from 'react'
import CustomPrimaryButton from '../../../components/CustomPrimaryButton'
import RedirectInfo from '../../../components/RedirectInfo'
import {useNavigate} from 'react-router-dom'
import { Tooltip } from '@mui/material'

export default function RegisterFooter({handleRegister,isFormated}) {
    const navigate = useNavigate();
    const handlePushToLoginPage=()=>{
         navigate('/Login')
    }
    const getFormatedValidMessage=()=>{
      return 'Press to Register!'
    }
    const getformatedNotValidMessage=()=>{
      return 'E-mail or password not valid'
    }
  return (
    <>
    <Tooltip
    title={!isFormated?getformatedNotValidMessage():getFormatedValidMessage()}
    >
    <div>
    <CustomPrimaryButton
    label="Register"
    additionnalStyle={{marginTop:"10px" }}
    disabled={!isFormated}
    onClick={handleRegister}
    />
    </div>
    </Tooltip>
    <RedirectInfo  
    text="Already have an account? " 
    redirectText="Sign in" 
    additionnalStyle={{marginTop:'5px'}}
    redirectHandler={handlePushToLoginPage}
    />
    </>
  )
}
