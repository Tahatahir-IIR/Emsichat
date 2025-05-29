import React, { useEffect, useState, useRef, useCallback } from "react";
import { styled } from "@mui/system";
import socket from "../../../utils/socket";
import BASE_URL from "../../../utils/BASE_URL";
import axios from "axios";

const Sidebar = styled("div")({
  width: "200px",
  backgroundColor: "rgba(20, 20, 23, 0.9)", // translucent dark background
  color: "#fff",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  borderRight: "2px solid transparent",
  boxShadow: "0 4px 12px rgba(0, 255, 127, 0.15)", // green neon glow
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  fontSize: "14px",
  overflowY: "auto",
  height: "100vh",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
});


const RoomButton = styled("button")({
  backgroundColor: "#3a3f45",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 500,
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#4e545c",
  },
});

const SettingsButton = styled("button")({
  backgroundColor: "#5865f2",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "10px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#4752c4",
  },
});

const AddRoomButton = styled(RoomButton)({
  backgroundColor: "#3ba55d",
  fontWeight: "bold",
  boxShadow: "0 0 8px #3ba55d",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    backgroundColor: "#2f8f4e",
    boxShadow: "0 0 15px #2f8f4e",
  },
});

const ParticipantsList = styled("div")({
  marginTop: "10px",
  fontSize: "13px",
  color: "#b9bbbe",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  paddingLeft: "6px",
});


const SectionSeparator = styled("hr")({
  border: "none",
  borderTop: "1px solid #40444b",
  margin: "12px 0",
});

const GroupVoiceRooms = ({
  voiceRooms,
  currentRoom,
  onJoinRoom,
  currentUserId,
  currentUsername,
  onOpenSettings,
  onAddRoom, // <- Optional callback to update room list
}) => {
  const [joinedRoom, setJoinedRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});

  const getLocalStream = useCallback(async () => {
    if (!localStreamRef.current) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localStreamRef.current = stream;

        let localAudio = document.getElementById("local-audio");
        if (!localAudio) {
          localAudio = document.createElement("audio");
          localAudio.id = "local-audio";
          localAudio.srcObject = stream;
          localAudio.muted = true;
          localAudio.autoplay = true;
          localAudio.playsInline = true;
          document.body.appendChild(localAudio);
        }
        console.log("🎤 Local microphone stream started");
      } catch (err) {
        console.error("🎤 Microphone access denied or error:", err);
      }
    }
    return localStreamRef.current;
  }, []);

  const createPeer = (peerId) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: peerId,
          candidate: event.candidate,
          roomId: joinedRoom,
        });
      }
    };

    peer.ontrack = (event) => {
      const audioId = `remote-audio-${peerId}`;
      let remoteAudio = document.getElementById(audioId);
      if (!remoteAudio) {
        remoteAudio = document.createElement("audio");
        remoteAudio.id = audioId;
        remoteAudio.autoplay = true;
        remoteAudio.playsInline = true;
        document.body.appendChild(remoteAudio);
      }
      remoteAudio.srcObject = event.streams[0];
    };

    peerConnectionsRef.current[peerId] = peer;
    return peer;
  };

  const handleVoiceOffer = async ({ from, offer }) => {
    await getLocalStream();
    if (!peerConnectionsRef.current[from]) {
      const peer = createPeer(from);
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("voice-answer", { to: from, answer, roomId: joinedRoom });
      } catch (err) {
        console.error("Error handling offer:", err);
      }
    }
  };

  const handleVoiceAnswer = async ({ from, answer }) => {
    const peer = peerConnectionsRef.current[from];
    if (peer) {
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error("Error setting remote description from answer:", err);
      }
    }
  };

  const handleIceCandidate = async ({ from, candidate }) => {
    const peer = peerConnectionsRef.current[from];
    if (peer && candidate) {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    }
  };

  const handleVoiceRoomUsers = async (users) => {
    setParticipants(users);
    await getLocalStream();
    users.forEach((user) => {
      if (user.userId !== currentUserId && !peerConnectionsRef.current[user.userId]) {
        const peer = createPeer(user.userId);
        peer.createOffer()
          .then((offer) => peer.setLocalDescription(offer).then(() => offer))
          .then((offer) => {
            socket.emit("voice-offer", {
              to: user.userId,
              offer,
              roomId: joinedRoom,
            });
          })
          .catch((err) => console.error("Offer creation error:", err));
      }
    });
  };

  useEffect(() => {
    socket.on("joined-voice-room", (roomId) => {
      setJoinedRoom(roomId);
    });

    socket.on("voice-room-users", handleVoiceRoomUsers);
    socket.on("voice-offer", handleVoiceOffer);
    socket.on("voice-answer", handleVoiceAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    // Optional: Listen for new room creation to refresh the list
    socket.on("voice-room-created", (newRoom) => {
      if (onAddRoom) onAddRoom(newRoom);
    });

    return () => {
      ["joined-voice-room", "voice-room-users", "voice-offer", "voice-answer", "ice-candidate", "voice-room-created"]
        .forEach((event) => socket.off(event));
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
      peerConnectionsRef.current = {};
      setParticipants([]);
      setJoinedRoom(null);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
      }
      const localAudio = document.getElementById("local-audio");
      if (localAudio) localAudio.remove();
      Object.keys(peerConnectionsRef.current).forEach((peerId) => {
        const remoteAudio = document.getElementById(`remote-audio-${peerId}`);
        if (remoteAudio) remoteAudio.remove();
      });
    };
  }, [currentUserId, getLocalStream]);

  const handleJoinRoom = async (room) => {
    if (!currentUserId || !currentUsername) return;
    await getLocalStream();
    socket.emit("join-voice-room", {
      roomId: room._id,
      userId: currentUserId,
      username: currentUsername,
    });
    onJoinRoom(room);
  };

  const handleAddRoom = async () => {
    const name = prompt("Enter room name:");
    if (name && name.trim()) {
      try {
        const response = await axios.post(`${BASE_URL}/api/voiceRooms`, {
          groupId: currentRoom?._id, // Ensure this is the current group/server ID
          name: name.trim(),
        });
        const newRoom = response.data;
        if (onAddRoom) onAddRoom(newRoom); // Update list if callback is provided
      } catch (error) {
        console.error("Error creating voice room:", error);
        alert("Failed to create voice room");
      }
    }
  };

  return (
  <Sidebar>
    <SettingsButton onClick={onOpenSettings}>⚙️ Server Settings</SettingsButton>
    <AddRoomButton onClick={handleAddRoom}>➕ Add Room</AddRoomButton>

    <h4 style={{ marginBottom: "8px" }}>Voice Channels</h4>
    {voiceRooms.map((room) => (
      <RoomButton
        key={room._id}
        onClick={() => handleJoinRoom(room)}
        style={{
          backgroundColor: joinedRoom === room._id ? "#5865f2" : undefined,
          boxShadow: joinedRoom === room._id ? "0 2px 8px rgba(88, 101, 242, 0.7)" : undefined,
        }}
      >
        🎙 {room.name}
      </RoomButton>
    ))}

    {joinedRoom && (
      <>
        <SectionSeparator />
        <ParticipantsList>
          {participants.map((user) => (
            <div key={user.userId}>• {user.username}</div>
          ))}
        </ParticipantsList>
      </>
    )}
  </Sidebar>
);

};

export default GroupVoiceRooms;
