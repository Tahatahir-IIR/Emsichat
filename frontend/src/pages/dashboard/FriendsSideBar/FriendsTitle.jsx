import { Typography } from '@mui/material'
import React from 'react'


const FriendsTitle = ({title, margBot}) => {
    return (
        <Typography
        sx={{
            textTransform: 'uppercase',
            fontSize: '15px',
            color: '#b9bbbe',
            marginBottom: margBot,
            marginTop: '20px',
        }}
        >
            {title}
        </Typography>
    )
}

export default FriendsTitle