import React, { useState, useRef } from "react";
import { styled } from "@mui/system";

const Container = styled("div")({
  width: "70%",
  height: "50px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  position: "absolute",
  bottom: "3%",
  marginTop: "24px",
  marginBottom: "16px",
  marginLeft: "4%",
  padding: "12px 16px",
  borderRadius: "20px",
  backgroundColor: "rgba(0, 255, 127, 0.15)",  // subtle neon green glow background
  border: "1px solid rgba(0, 255, 127, 0.4)",
  boxShadow: "0 0 12px rgba(0, 255, 127, 0.25)",
  backdropFilter: "blur(8px)",
  transition: "box-shadow 0.3s ease",
  "&:hover": {
    boxShadow: "0 0 20px rgba(0, 255, 127, 0.6)",
  },
});

const FileLabel = styled("label")({
  position: "relative",
  minWidth: "48px",
  height: "48px",
  borderRadius: "50%",
  backgroundColor: "#2d2d30",
  color: "rgba(0, 255, 127, 0.9)",
  fontSize: "22px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 8px rgba(0, 255, 127, 0.7)",
  transition: "background-color 0.3s ease, color 0.3s ease",
  overflow: "hidden",
  "&:hover": {
    backgroundColor: "rgba(0, 255, 127, 0.1)",
    color: "#00ff7f",
    boxShadow: "0 0 14px #00ff7f",
  },
});

const HiddenFileInput = styled("input")({
  position: "absolute",
  opacity: 0,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  cursor: "pointer",
});

const Textarea = styled("textarea")({
  flex: 1,
  height: "40px",
  padding: "12px 16px",
  fontSize: "15px",
  border: "none",
  borderRadius: "16px",
  backgroundColor: "#222225",
  resize: "none",
  outline: "none",
  fontFamily: "inherit",
  color: "#cfcfcf",
  boxShadow: "inset 0 0 6px rgba(0, 255, 127, 0.15)",
  transition: "box-shadow 0.3s ease",
  "&:focus": {
    boxShadow: "inset 0 0 12px #00ff7f",
    backgroundColor: "#1a1a1d",
  },
  "&::placeholder": {
    color: "#888",
  },
});

const SendButton = styled("button")({
  minWidth: "48px",
  height: "48px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "#00b894",
  color: "white",
  fontSize: "20px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 0 12px rgba(0, 184, 148, 0.7)",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    backgroundColor: "#00ff7f",
    boxShadow: "0 0 20px #00ff7f",
  },
});

const ChatInput = ({ onSendMessage, onSendFile }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleSend = () => {
    const trimmedMsg = message.trim();
    if (!trimmedMsg) return;
    onSendMessage(trimmedMsg);
    setMessage("");
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onSendFile(e.target.files[0]);
      fileInputRef.current.value = null;
    }
  };

  return (
    <Container>
      <FileLabel htmlFor="fileUpload" aria-label="Upload file">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
        </svg>
        <HiddenFileInput
          id="fileUpload"
          type="file"
          accept=".zip,.rar,.7z,.pdf,.jpg,.jpeg,.png,.txt,.docx,.xlsx"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </FileLabel>

      <Textarea
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <SendButton aria-label="Send message" onClick={handleSend}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="white"
          viewBox="0 0 24 24"
        >
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zm-5 9a7.002 7.002 0 0 0 6.93-6h-2.02a5 5 0 0 1-9.82 0H5.07A7.002 7.002 0 0 0 12 20z" />
        </svg>
      </SendButton>
    </Container>
  );
};

export default ChatInput;
