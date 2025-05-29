import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import GroupVoiceRooms from "./GroupVoiceRooms";
import GroupChat from "./GroupChat";
import GroupMembers from "./GroupMembers";
import axios from "axios";
import BASE_URL from "../../../utils/BASE_URL";

const Wrapper = styled("div")({
  width: "100%",
  height: "100vh",
  display: "flex",
  flexDirection: "row",
  overflow: "hidden",
});

const GroupDashboard = ({ selectedGroup }) => {
  const [voiceRooms, setVoiceRooms] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [currentVoiceRoom, setCurrentVoiceRoom] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user")); // 👈 or wherever you store it
  const currentUserId = currentUser?._id;
  useEffect(() => {
    if (!selectedGroup) return;

    // Fetch voice rooms
    axios.get(`${BASE_URL}/api/voiceRooms/${selectedGroup._id}`)
      .then(res => setVoiceRooms(res.data))
      .catch(err => console.error("Voice rooms fetch error:", err));

    // Fetch group members
    axios.get(`${BASE_URL}/api/groups/${selectedGroup._id}/members`)
      .then(res => setGroupMembers(res.data))
      .catch(err => console.error("Group members fetch error:", err));
  }, [selectedGroup]);

  return (
    <Wrapper>
      <GroupVoiceRooms
        voiceRooms={voiceRooms}
        currentRoom={currentVoiceRoom}
        onJoinRoom={setCurrentVoiceRoom}
        groupId={selectedGroup._id}
        currentUserId={currentUserId} 
        currentUsername={currentUser.username}
        onRoomCreated={() => {
          axios.get(`${BASE_URL}/api/voiceRooms/${selectedGroup._id}`)
            .then(res => setVoiceRooms(res.data))
            .catch(err => console.error("Voice rooms fetch error:", err));
        }}
        onOpenSettings={() => {
          alert(`Invite link: ${selectedGroup.inviteLink}`);
        }}
      />
      <GroupChat selectedGroup={selectedGroup} />
      <GroupMembers members={groupMembers} />
    </Wrapper>
  );
};

export default GroupDashboard;
