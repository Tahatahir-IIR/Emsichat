import React, { useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import BASE_URL from "../../../../utils/BASE_URL"; 


// Styled Components

const Overlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.75)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

const ModalWrapper = styled("div")({
  width: "400px",
  height: "320px",
  backgroundColor: "#2f3136",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
  position: "relative",
});

const SlideContainer = styled("div")(({ slideIndex }) => ({
  display: "flex",
  width: "1200px", // 3 slides * 400px
  transform: `translateX(-${(slideIndex + 1) * 400}px)`,
  transition: "transform 0.4s ease-in-out",
}));

const Slide = styled("div")({
  width: "400px",
  height: "320px",
  padding: "20px",
  boxSizing: "border-box",
  color: "#fff",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "stretch",
});

const Title = styled("h2")({
  textAlign: "center",
  marginBottom: "16px",
  fontWeight: "bold",
});

const Button = styled("button")({
  width: "100%",
  padding: "10px",
  margin: "6px 0",
  backgroundColor: "#5865F2",
  border: "none",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#4752C4",
  },
});

const Input = styled("input")({
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  backgroundColor: "#202225",
  border: "1px solid #72767d",
  color: "#fff",
  borderRadius: "4px",
  boxSizing: "border-box",
});

// Main Component

const AddServerModal = ({ onClose }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [serverName, setServerName] = useState("");
  const [serverImage, setServerImage] = useState(null);
  const [inviteLink, setInviteLink] = useState("");  // <--- new state for join invite link
  const [loading, setLoading] = useState(false);

  const handleClose = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleCreateServer = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const creatorId = user?._id;

    if (!creatorId) {
      alert("User not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("name", serverName);
    formData.append("creatorId", creatorId);
    formData.append("image", serverImage); // this can be a File from <input type="file" />

    const response = await axios.post(`${BASE_URL}/api/groups/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    if (response.status === 201) {
      alert("Server created!");
      onClose();
    } else {
      alert("Failed to create server.");
    }
  } catch (error) {
    console.error("Error creating server:", error);
    alert("An error occurred.");
  }
  };

  const handleJoinServer = async () => {
    if (!inviteLink.trim()) {
      alert("Please enter a valid invite link or code.");
      return;
    }
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?._id;
      if (!userId) {
        alert("User not found. Please log in.");
        setLoading(false);
        return;
      }

      // POST to backend with invite link and user ID
      const response = await axios.post(`${BASE_URL}/api/groups/join`, {
        inviteLink: inviteLink.trim(),
        userId,
      });

      if (response.status === 200) {
        alert("Successfully joined the server!");
        onClose();
      } else {
        alert("Failed to join the server. Check the invite link.");
      }
    } catch (error) {
      console.error("Error joining server:", error);
      alert("Failed to join the server. Please check the invite link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={handleClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <SlideContainer slideIndex={slideIndex}>
          {/* Slide -1: Join Server */}
          <Slide>
            <Title>Join a Server</Title>
            <Input
              type="text"
              placeholder="Enter invite link or code"
              value={inviteLink}
              onChange={(e) => setInviteLink(e.target.value)}
            />
            <Button onClick={handleJoinServer} disabled={loading}>
              {loading ? "Joining..." : "Join"}
            </Button>
            <Button onClick={() => setSlideIndex(0)}>← Back</Button>
          </Slide>

          {/* Slide 0: Initial Choice */}
          <Slide>
            <Title>Select an action</Title>
            <Button onClick={() => setSlideIndex(-1)}>🔗 Join a Server</Button>
            <Button onClick={() => setSlideIndex(1)}>➕ Create a Server</Button>
          </Slide>

          {/* Slide +1: Create Server */}
          <Slide>
            <Title>Create a Server</Title>
            <Input
              type="text"
              placeholder="Server Name"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setServerImage(e.target.files[0])}
            />
            <Button onClick={handleCreateServer}>Create</Button>
            <Button onClick={() => setSlideIndex(0)}>← Back</Button>
          </Slide>
        </SlideContainer>
      </ModalWrapper>
    </Overlay>
  );
};

export default AddServerModal;