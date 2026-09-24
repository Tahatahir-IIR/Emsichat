import React, { useState, useEffect, useCallback } from "react";
import { padding, styled } from "@mui/system";
import axios from "axios";
import ChatInput from "../../../components/ChatInput";  // Assuming reusable
import socket from "../../../utils/socket";
import BASE_URL from "../../../utils/BASE_URL";

const ChatContainer = styled("div")({
  flex: 1,
  backgroundColor: "rgba(20, 20, 23, 0.9)", // translucent dark bg
  display: "flex",
  flexDirection: "column",
  color: "#fff",
  padding: "10px",
  height: "100%",
  borderLeft: "2px solid transparent",
  borderRight: "2px solid transparent",
  borderBottom: "2px solid transparent",
  boxShadow: "0 4px 12px rgba(0, 255, 127, 0.15)", // subtle green glow
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
});

const ChatInputWrapper = styled("div")({
  width: "300px",        // or "80%", "600px", etc. adjust as needed
  paddingLeft:"0px"     // center horizontally if smaller than parent
});


const MessagesContainer = styled("div")({
  flexGrow: 1,
  overflowY: "auto",
  padding: "16px",
  // optional: a subtle inner glow or border effect
  border: "1px solid rgba(0, 255, 127, 0.1)",
  borderRadius: "6px",
  boxShadow: "inset 0 0 8px rgba(0, 255, 127, 0.1)",
});

const GroupChat = ({ selectedGroup }) => {
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  // Fetch group messages from backend
  const fetchGroupMessages = useCallback(async () => {
    if (!userDetails || !selectedGroup) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/api/groups/${selectedGroup._id}`
      );
      // Assuming the group object has messages array
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error fetching group messages:", error);
    }
  }, [userDetails, selectedGroup]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserDetails(user);
  }, []);

  useEffect(() => {
  if (selectedGroup && userDetails) {
    fetchGroupMessages(); // initial fetch

    const interval = setInterval(() => {
      fetchGroupMessages();
    }, 1000); // 1000 ms = 1 second

    return () => clearInterval(interval); // cleanup on unmount or deps change
  }
}, [selectedGroup, userDetails, fetchGroupMessages]);


  // Send a text message to group
  const handleSendMessage = async (msg) => {
    if (!userDetails || !selectedGroup) return;
    try {
      const response = await fetch(`${BASE_URL}/api/groups/${selectedGroup._id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: userDetails._id,
          text: msg,
          messageType: "text",
        }),
      });
      if (response.ok) {
        fetchGroupMessages();
      } else {
        console.error("Group message sending failed");
      }
    } catch (error) {
      console.error("Error sending group message:", error);
    }
  };

  // Send a file to group
  const handleSendFile = async (file) => {
    if (!userDetails || !selectedGroup) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sender", userDetails._id);

    try {
      const response = await fetch(
        `${BASE_URL}/api/groups/${selectedGroup._id}/message/file`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        fetchGroupMessages();
      } else {
        console.error("Group file upload failed");
      }
    } catch (err) {
      console.error("Error sending group file:", err);
    }
  };

  // Real-time update via socket.io
  useEffect(() => {
    if (!selectedGroup) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.groupId === selectedGroup._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("group-message", handleNewMessage);

    return () => {
      socket.off("group-message", handleNewMessage);
    };
  }, [selectedGroup]);

  return (
    <ChatContainer>
      <h3>#{selectedGroup.name} - Group Chat</h3>
      <MessagesContainer>
        {messages.length > 0 ? (
        messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              textAlign: msg.sender?._id === userDetails?._id ? "right" : "left",
              color: "white",
            }}
          >
            {msg.messageType === "text" ? (
              <div>{msg.text}</div>
            ) : msg.messageType === "file" ? (
              <a
                href={msg.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#00bfff", textDecoration: "underline" }}
              >
                📎 {msg.fileUrl.split("/").pop()}
              </a>
            ) : msg.messageType === "voice" ? (
              <div>Voice message</div>
            ) : null}
          </div>
        ))
      ) : (
        <div style={{ color: "white" }}>No messages yet...</div>
      )}

      </MessagesContainer>
      <ChatInput
       style={{ position:"absolute",width: "20%", maxWidth: "100px" ,paddingLeft:"-20px"}}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
      />
    </ChatContainer>
  );
};

export default GroupChat;
