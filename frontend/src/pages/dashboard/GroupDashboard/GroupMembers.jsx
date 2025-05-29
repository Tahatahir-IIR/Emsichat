import React from "react";
import { styled } from "@mui/system";
const MembersContainer = styled("div")({
  width: "220px",
  backgroundColor: "rgba(20, 20, 23, 0.9)",  // translucent dark background
  borderLeft: "2px solid transparent",
  padding: "10px",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  boxShadow: "0 4px 12px rgba(0, 255, 127, 0.15)", // subtle green glow
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
});

const MemberCard = styled("div")({
  backgroundColor: "rgba(0, 255, 127, 0.1)", // very light greenish translucent bg
  padding: "8px",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  boxShadow: "0 0 8px rgba(0, 255, 127, 0.3)",  // soft neon glow
  border: "1px solid rgba(0, 255, 127, 0.4)",  // subtle green border
});


const GroupMembers = ({ members }) => {
  return (
    <MembersContainer>
      <h4>Members</h4>
      {members.map((member) => (
        <MemberCard key={member._id}>
          <span>🟢</span>
          <span>{member.username}</span>
        </MemberCard>
      ))}
    </MembersContainer>
  );
};

export default GroupMembers;
