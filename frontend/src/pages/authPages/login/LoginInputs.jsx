import React from 'react'
import InputWithLabel from '../../../components/InputWithLabel'

export default function LoginInputs({mail,setmail,password,setpassword}) {
  return (
    <>
    <InputWithLabel
    value={mail}
    setValue={setmail}
    label="E-mail"
    type="text"
    placeholder="Enter e-mail address"
    />
    <InputWithLabel
    value={password}
    setValue={setpassword}
    label="Password"
    type="password"
    placeholder="Enter password"
    />
    </>
  )
}
