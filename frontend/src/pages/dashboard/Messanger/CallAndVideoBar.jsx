import React from "react";
import { styled } from "@mui/system";
import { FaPhone, FaVideo } from "react-icons/fa";

const Container = styled("div")({
  display: "flex",
  backgroundColor: "transparent",
  overflow: "hidden",
  padding: 0,
});

const IconButton = styled("button")(({ type }) => ({
  flex: 1,
  padding: "12px 0",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  transition: "background 0.3s ease, transform 0.2s ease",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  backgroundColor: "#808080",
  transform: "scale(1)",

  ...(type === "voice" && {
    clipPath: "polygon(0 0, 100% 0, calc(100% - 20px) 100%, 0% 100%)",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    "&:hover": {
      backgroundColor: "#3ba55d",
      transform: "scale(1.05)",
      zIndex: 1,
    },
  }),

  ...(type === "video" && {
    clipPath: "polygon(20px 0, 100% 0, 100% 100%, 0% 100%)",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginLeft: "-20px",
    "&:hover": {
      backgroundColor: "#7289da",
      transform: "scale(1.05)",
      zIndex: 1,
    },
  }),
}));

const CallAndVideoBar = ({ onVoiceCall, onVideoCall }) => {
  return (
    <Container>
      <IconButton onClick={() => { console.log('Voice call button clicked'); onVoiceCall(); }} type="voice" title="Voice Call">
        <FaPhone />
      </IconButton>
      <IconButton onClick={() => { console.log('Video call button clicked'); onVideoCall(); }} type="video" title="Video Call">
        <FaVideo />
      </IconButton>
    </Container>
  );
};

export default CallAndVideoBar;
