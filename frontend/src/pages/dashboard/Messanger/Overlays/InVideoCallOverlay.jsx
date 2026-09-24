import React, { useEffect, useRef, useState } from "react";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

const Overlay = styled("div")({
  position: "fixed",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.85)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  zIndex: 9999,
});

const VideoContainer = styled("div")({
  position: "relative",
  width: "80%",
  maxWidth: "800px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "20px",
});

const Video = styled("video")({
  width: "100%",
  borderRadius: "16px",
  backgroundColor: "#000",
});

const SmallVideo = styled("video")({
  position: "absolute",
  bottom: "10px",
  right: "10px",
  width: "150px",
  height: "100px",
  borderRadius: "8px",
  backgroundColor: "#000",
});

const InfoText = styled("div")({
  marginBottom: "20px",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center",
});

const IconRow = styled("div")({
  display: "flex",
  gap: "30px",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "30px",
  cursor: "pointer",
});

const InVideoCallOverlay = ({ talkingTo, onHangUp, localStream, remoteStream }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  // Effect to enable/disable mic tracks based on isMicOn state
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
    }
  }, [isMicOn, localStream]);

  const toggleMic = () => setIsMicOn((prev) => !prev);

  return (
    <Overlay>
      <InfoText>🎥 Video Call with {talkingTo}</InfoText>

      <VideoContainer>
        {/* Remote Video Fullscreen */}
        <Video ref={remoteVideoRef} autoPlay playsInline />

        {/* Local Video Small */}
        <SmallVideo ref={localVideoRef} autoPlay muted playsInline />
      </VideoContainer>

      <IconRow>
        {/* Mic Icon toggles mute/unmute */}
        {isMicOn ? (
          <MicIcon
            style={{ color: "#4caf50", fontSize: "40px" }}
            onClick={toggleMic}
            title="Mute microphone"
          />
        ) : (
          <MicOffIcon
            style={{ color: "#f44336", fontSize: "40px" }}
            onClick={toggleMic}
            title="Unmute microphone"
          />
        )}
        <VolumeUpIcon style={{ color: "#4caf50", fontSize: "40px" }} />
      </IconRow>

      <Button
        onClick={onHangUp}
        style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "12px 24px",
          borderRadius: "12px",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <PhoneDisabledIcon />
        Hang Up
      </Button>
    </Overlay>
  );
};

export default InVideoCallOverlay;
