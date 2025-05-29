import { styled } from '@mui/material'
import React from 'react'

const AvatarPreview=styled("div")({
    width:'42px',
    height:'42px',
    backgroundColor:"purple",
    borderRadius:"42px",
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    fontSize: "20px",
    marginLeft:"5px",
    color:"white"
})

const Avatar = ({username,large}) => {
    return (
        <AvatarPreview style={large?{height:"80px",width:"80px"}:{}}>
            {username.substring(0,2)}
        </AvatarPreview>
    )
}

export default Avatar