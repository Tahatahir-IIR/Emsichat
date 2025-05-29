import React, { useState,useEffect, useRef } from "react";
import { styled } from "@mui/system";
import DropDownMenu from './DropDownMenu.jsx';

const keyframes = `
@keyframes keyframes-fill {
  0% {
    transform: rotate(0deg) scale(0);
    opacity: 0;
    fill: red;
  }
  50% {
    transform: rotate(-10deg) scale(1.2);
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}
`;

const GlobalStyles = styled("style")`${keyframes}`;

const MainContainer = styled("div")({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  flex: 3,
  borderLeft: "2px solid transparent",
  borderRight: "2px solid transparent",
  borderBottom: "2px solid transparent",
  backgroundColor: "rgba(20, 20, 23, 0.9)",
  boxShadow: "0 4px 12px rgba(0, 255, 127, 0.15)",
  maxWidth: "49px",
  minWidth: "47px",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",

});


const SidebarRight = styled("div")({
  backgroundImage: "url('/path/to/hexagon-abstract-green-neon-background-free-vector.jpg')",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  width: "48px",
  borderLeft: "2px solid #00ff7f",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: 0,
  height: "100%",
  position: "relative",
  boxShadow: "inset 0 0 15px rgba(0, 255, 127, 0.4)",
  transition: "box-shadow 0.3s ease",

});


const SoundWrapper = styled("div")({
  position: "relative",
  top: "540px",
});

const MicWrapper = styled("div")({
  position: "relative",
  top: "600px",
});

const IconButton = styled("label")({
  "--size": "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  cursor: "pointer",
  fontSize: "var(--size)",
  userSelect: "none",
  width: "30px",
  height: "30px",
  transition: "transform 0.2s ease, background-color 0.3s ease, border-radius 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  "& input": {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: 0,
  },
});

// Icons now just render one based on state

const MicrophoneIcon = () => (
  <svg
    viewBox="0 0 384 512"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    fill="#22c55e"
    style={{ animation: "keyframes-fill 0.5s forwards" }}
  >
    <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"></path>
  </svg>
);

const MicrophoneSlashIcon = () => (
  <svg
    viewBox="0 0 640 512"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    fill="red"
    style={{ animation: "keyframes-fill 0.5s forwards" }}
  >
    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L472.1 344.7c15.2-26 23.9-56.3 23.9-88.7V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 21.2-5.1 41.1-14.2 58.7L416 300.8V96c0-53-43-96-96-96s-96 43-96 96v54.3L38.8 5.1zM344 430.4c20.4-2.8 39.7-9.1 57.3-18.2l-43.1-33.9C346.1 382 333.3 384 320 384c-70.7 0-128-57.3-128-128v-8.7L144.7 210c-.5 1.9-.7 3.9-.7 6v40c0 89.1 66.2 162.7 152 174.4V464H248c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V430.4z"></path>
  </svg>
);

const MuteIcon = () => (
  <svg
    viewBox="0 0 576 512"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    fill="red"
    style={{ animation: "keyframes-fill 0.5s forwards" }}
  >
    <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"></path>
  </svg>
);

const VoiceIcon = () => (
  <svg
    viewBox="0 0 448 512"
    height="1em"
    xmlns="http://www.w3.org/2000/svg"
    fill="#22c55e"
    style={{ animation: "keyframes-fill 0.5s forwards" }}
  >
    <path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM412.6 181.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z"></path>
  </svg>
);

const AppBar = () => {
  const [isMicOn, setMicOn] = useState(true);
  const [isSoundOn, setSoundOn] = useState(true);

  // Assume you have a media stream for microphone input
  const mediaStreamRef = useRef(null);

  // Assume you have an audio element ref to control output sound
  const audioOutputRef = useRef(null);

  // Simulate getting user media on mount (replace this with your real stream source)
  useEffect(() => {
    async function getMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        // Enable audio tracks initially
        stream.getAudioTracks().forEach(track => track.enabled = isMicOn);
      } catch (err) {
        console.error("Failed to get media stream", err);
      }
    }
    getMedia();

    // Cleanup on unmount
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, []);

  // Effect to handle mic toggle
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => (track.enabled = isMicOn));
    }
  }, [isMicOn]);

  // Effect to handle sound toggle - example with an audio element
  useEffect(() => {
    if (audioOutputRef.current) {
      audioOutputRef.current.muted = !isSoundOn;
    }
  }, [isSoundOn]);

  return (
    <MainContainer>
      <SidebarRight>
        <DropDownMenu />
        <GlobalStyles />

        <SoundWrapper>
          <IconButton>
            <input
              type="checkbox"
              checked={isSoundOn}
              onChange={() => setSoundOn(!isSoundOn)}
            />
            {isSoundOn ? <VoiceIcon /> : <MuteIcon />}
          </IconButton>
          {/* Example audio element */}
          <audio ref={audioOutputRef} src="your-audio-source.mp3" autoPlay loop />
        </SoundWrapper>

        <MicWrapper>
          <IconButton>
            <input
              type="checkbox"
              checked={isMicOn}
              onChange={() => setMicOn(!isMicOn)}
            />
            {isMicOn ? <MicrophoneIcon /> : <MicrophoneSlashIcon />}
          </IconButton>
        </MicWrapper>
      </SidebarRight>
    </MainContainer>
  );
};

export default AppBar;
