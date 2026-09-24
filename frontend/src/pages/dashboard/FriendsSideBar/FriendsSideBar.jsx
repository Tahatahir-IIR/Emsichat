import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import FriendAddButton from "./FriendAddButton";
import FriendsTitle from "./FriendsTitle";
import FriendsList from "./FriendsList/FriendsList";
import PendingInvitationList from "./PendingInvitationList/PendingInvitationList";
import socket from "../../../utils/socket"; // your socket instance

const MainContainer = styled("div")({
  width: "250px",
  height: "96%",
  display: "flex",
  flexDirection: "column",
  padding: "16px",
  overflowY: "auto",
  backgroundColor: "rgba(18, 18, 18, 0.85)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 0 10px rgba(0, 255, 127, 0.2)",
  border: "1px solid transparent",
  backgroundImage: `
    linear-gradient(to bottom, rgba(18, 18, 18, 0.85), rgba(18, 18, 18, 0.9)),
    linear-gradient(to right, #00ff7f, #00b894)
  `,
  backgroundClip: "padding-box, border-box",
  backgroundOrigin: "padding-box, border-box",
  fontFamily: "'Inter', sans-serif",

  // Hide scrollbar
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
});


const FriendsSideBar = ({ onFriendSelect }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Handler for online users event from socket
    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    // Subscribe to the online-users event
    socket.on("online-users", handleOnlineUsers);

    socket.emit("request-online-users");  // Optional, if your server supports it

    const intervalId = setInterval(() => {

    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  return (
    <MainContainer>
      <FriendAddButton />
      <FriendsTitle title="PRIVATE MESSAGES" margBot={"20px"} />
      <FriendsList onFriendSelect={onFriendSelect} onlineUsers={onlineUsers} />
      <FriendsTitle title="Invitations" margBot={"30px"} />
      <PendingInvitationList />
    </MainContainer>
  );
};

export default FriendsSideBar;
