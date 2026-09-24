import { Typography, Tooltip, Box } from '@mui/material';
import React, { useState } from 'react';
import Avatar from '../../../../components/Avatar';
import InvitationDecisionButtons from './InvitationDecisionButtons';
import BASE_URL from "../../../../utils/BASE_URL"; 


const PendingInvitationListItem = ({
  username,
  id,
  mail,
  removeInvitationFromList
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleAcceptInvitation = async () => {
    setButtonDisabled(true);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await fetch(`${BASE_URL}/api/friends/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentUserMail: user.mail,
          senderId: id
        })
      });

      if (res.ok) {
        if (removeInvitationFromList) removeInvitationFromList(id);
      }
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  const handleRejectInvitation = async () => {
    setButtonDisabled(true);
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await fetch(`${BASE_URL}/api/friends/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          currentUserMail: user.mail,
          senderId: id
        })
      });

      if (res.ok) {
        if (removeInvitationFromList) removeInvitationFromList(id);
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  return (
    <Tooltip title={mail}>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          '&:hover': {
            backgroundColor: '#5a5f66',
          },
        }}
      >
        <Avatar username={username} />
        <Typography
          sx={{
            marginLeft: "7px",
            fontWeight: 700,
            color: "#8e9297",
            flexGrow: 1,
          }}
          variant="subtitle1"
        >
          {username}
        </Typography>
        <InvitationDecisionButtons
          disabled={buttonDisabled}
          acceptInvitationHandler={handleAcceptInvitation}
          rejectInvitationHandler={handleRejectInvitation}
        />
      </Box>
    </Tooltip>
  );
};

export default PendingInvitationListItem;
