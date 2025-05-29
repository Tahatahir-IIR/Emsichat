import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, IconButton } from '@mui/material';

const InvitationDecisionButtons = ({ disabled, acceptInvitationHandler, rejectInvitationHandler }) => {
  return (
    <Box sx={{ display: 'flex', gap: '8px' }}>
      <IconButton
        sx={{
          backgroundColor: '#3ba55d',
          borderRadius: '6px',
          padding: '6px',
          color: '#fff',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#2d7d46',
          },
        }}
        disabled={disabled}
        onClick={acceptInvitationHandler}
      >
        <CheckIcon />
      </IconButton>

      <IconButton
        sx={{
          backgroundColor: '#f04747',
          borderRadius: '6px',
          padding: '6px',
          color: '#fff',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: '#c33c3c',
          },
        }}
        disabled={disabled}
        onClick={rejectInvitationHandler}
      >
        <ClearIcon />
      </IconButton>
    </Box>
  );
};

export default InvitationDecisionButtons;
