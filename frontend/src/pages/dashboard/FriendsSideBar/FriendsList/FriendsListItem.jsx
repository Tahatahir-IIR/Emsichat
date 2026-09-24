import { Button, Typography } from '@mui/material';
import React from 'react';
import Avatar from '../../../../components/Avatar';
import OnlineIndicator from './OnlineIndicator';

const FriendsListItem = ({ username, id, isOnline, isSelected, onClick }) => {
  return (
    <Button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: isSelected ? "#5865F2" : "#ffffff",
        color: isSelected ? "white" : "gray",
        padding: "8px 10px",
        borderRadius: "12px",
        justifyContent:"flex-start",
        cursor: "pointer",
        transition: "background 0.2s ease",
        width: "100%",
        textTransform: "none",
        height: "42px",
        marginTop: "10px",
        position: "relative",
      }}
    >
      <Avatar username={username} />
      <Typography
        style={{
          marginLeft: "7px",
          fontWeight: "700",
        }}
        variant="subtitle"
        align="left"
      >
        {username}
      </Typography>
      {isOnline && <OnlineIndicator />}
    </Button>
  );
};

export default FriendsListItem;
