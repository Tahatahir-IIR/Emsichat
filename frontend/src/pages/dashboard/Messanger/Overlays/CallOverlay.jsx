import React from "react";
import { styled } from "@mui/system";

const OverlayContainer = styled("div")({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark background for overlay effect
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999, // Make sure it's on top of everything
});

const CallOverlay = ({ callerName, onAccept, onDecline }) => {
  return (
    <OverlayContainer>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          minWidth: "300px", // Ensures overlay isn't too small
        }}
      >
        <h3>Incoming call from {callerName}</h3>
        <button onClick={onAccept} style={{ marginRight: "10px", padding: "10px", backgroundColor: "green", color: "white", borderRadius: "5px" }}>
          Accept
        </button>
        <button onClick={onDecline} style={{ padding: "10px", backgroundColor: "red", color: "white", borderRadius: "5px" }}>
          Decline
        </button>
      </div>
    </OverlayContainer>
  );
};

export default CallOverlay;
