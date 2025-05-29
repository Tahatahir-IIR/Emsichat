import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import '../zickoFineWork/login.css';
import emsiLogo from '../zickoFineWork/EMSICHATLOGO.png';


const BoxWrapper = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f2f4f8',
  position: 'relative',
});

const AuthBOX = (props) => {
  return (
    <BoxWrapper>
      <div className="logo">
        <img src={emsiLogo} alt="Logo" />
      </div>

      <Box 
        sx={{
            width: 300,
            height: props.height || 230,
            border: "solid",
            borderWidth:1,
            borderColor:"#8d8d8d",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            borderRadius: "20px"
        } }
       >
        {props.children}
      </Box>
    </BoxWrapper>
  );
};

export default AuthBOX;
