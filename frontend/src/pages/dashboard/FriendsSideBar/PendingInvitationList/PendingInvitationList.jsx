import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material';
import PendingInvitationListItem from './PendingInvitationListItem';
import BASE_URL from "../../../../utils/BASE_URL"; 


const MainContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  overflowY: "auto",
});

const PendingInvitation = () => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const fetchInvitations = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await fetch(`${BASE_URL}/api/friends/pending/${user.mail}`);
        const data = await res.json();
        setInvitations(data);
      } catch (err) {
        console.error("Error fetching invitations:", err);
      }
    };

    fetchInvitations();

    const intervalId = setInterval(() => {
      fetchInvitations();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const removeInvitation = (id) => {
    setInvitations(prev => prev.filter(invite => invite._id !== id));
  };

  return (
    <MainContainer>
      {invitations.map((invitation) => (
        <PendingInvitationListItem
          key={invitation._id}
          id={invitation._id}
          username={invitation.senderId.username}
          mail={invitation.senderId.mail}
          removeInvitationFromList={removeInvitation}
        />
      ))}
    </MainContainer>
  );
};

export default PendingInvitation;
