import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import SideBar from "./SideBar/SideBar";
import FriendsSideBar from "./FriendsSideBar/FriendsSideBar";
import Messanger from "./Messanger/Messanger";
import MessangerWait from "./Messanger/MessangerWait";
import AppBar from "./AppBar/AppBar";
import GroupView from "./GroupDashboard/GroupView"; 
import { logout } from "../../utils/Auth";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/actions/authAction";
import socket from "../../utils/socket";

const Wrapper = styled("div")({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "row",
  position: "relative",
  overflow: "hidden",
});

const InternWrapper = styled("div")({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "row",
  position: "relative",
  overflow: "hidden",
});

const Dashboard = () => {
  const dispatch = useDispatch();
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [inCallWith, setInCallWith] = useState(null);
  const [activeServer, setActiveServer] = useState(null); // null = private, else it's a group

  useEffect(() => {
    const userDetails = localStorage.getItem("user");
    if (!userDetails) {
      logout();
    } else {
      dispatch(setUserDetails(userDetails));
    }

    const parsedUser = JSON.parse(userDetails);

    socket.emit("join-room", parsedUser._id);
    console.log("🔗 Joined room:", parsedUser._id);

    socket.on("call-accepted", (data) => {
      console.log("✅ Call accepted by:", data.fromName);
      setInCallWith(data.fromName);
    });

    socket.on("hang-up", () => {
      console.log("📴 Call hung up");
      setInCallWith(null);
    });

    return () => {
      socket.off("call-accepted");
      socket.off("hang-up");
    };
  }, [dispatch]);

  const handleHangUp = () => {
    console.log("📴 Hanging up the call with:", inCallWith);
    socket.emit("hang-up");
    setInCallWith(null);
  };

  return (
    <Wrapper>
      <SideBar onServerSelect={setActiveServer} /> {/* 🧠 Pass down this function */}
      {activeServer ? (
        <GroupView server={activeServer} />
      ) : (
        <InternWrapper>
          <FriendsSideBar onFriendSelect={setSelectedFriend} />
          {selectedFriend ? (
            <Messanger
              selectedFriend={selectedFriend}
              inCallWith={inCallWith}
              handleHangUp={handleHangUp}
            />
          ) : (
            <MessangerWait />
          )}
          <AppBar />
        </InternWrapper>
      )}
    </Wrapper>
  );
};

export default Dashboard;
