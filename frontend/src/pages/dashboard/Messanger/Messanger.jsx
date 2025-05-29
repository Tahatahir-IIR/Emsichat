import React, { useState, useEffect, useCallback, useRef } from "react";
import { styled } from "@mui/system";
import axios from 'axios';
import ChatInput from "../../../components/ChatInput";
import CallAndVideoBar from "./CallAndVideoBar";
import socket from "../../../utils/socket";
import InCallOverlay from "./Overlays/InCallOverlay";
import CallOverlay from "./Overlays/CallOverlay";
import InVideoCallOverlay from "./Overlays/InVideoCallOverlay";
import BASE_URL from "../../../utils/BASE_URL"; 


const MainContainer = styled("div")({
  flexGrow: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: "rgba(24, 24, 27, 0.9)", // deep dark background
  backdropFilter: "blur(8px)",
  borderLeft: "1px solid rgba(0, 255, 127, 0.3)",
  backgroundImage: `
    linear-gradient(to bottom, rgba(24, 24, 27, 0.95), rgba(15, 15, 15, 0.95)),
    linear-gradient(to right, #00ff7f, #00b894)
  `,
  backgroundClip: "padding-box, border-box",
  backgroundOrigin: "padding-box, border-box",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  boxShadow: "inset 0 0 8px rgba(0, 255, 127, 0.1)",

  "&:hover": {
    boxShadow: "inset 0 0 12px rgba(0, 255, 127, 0.3)",
  },

  fontFamily: "'Inter', sans-serif",
});


const Messanger = ({ selectedFriend, handleHangUp }) => {
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isTalking, setIsTalking] = useState(false);
  const [receivingAudio, setReceivingAudio] = useState(false);
  const [pendingCall, setPendingCall] = useState(null);
  const [inCallWith, setInCallWith] = useState(null);
  const [isVideoCall, setIsVideoCall] = useState(false); // ✅ NEW

  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const analyserRef = useRef(null);

  const iceServers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  useEffect(() => {
    console.log("inCallWith updated:", inCallWith);
  }, [inCallWith]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserDetails(user);
      socket.emit("join-room", user._id);
      console.log("✅ Joined room:", user._id);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!userDetails || !selectedFriend) return;
    try {
      const response = await axios.get(
        `${BASE_URL}/api/chats/find/${userDetails._id}/${selectedFriend._id}`
      );
      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedFriend, userDetails]);

  useEffect(() => {
    if (selectedFriend && userDetails) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedFriend, userDetails, fetchMessages]);

  const handleSendMessage = async (msg) => {
    if (!userDetails || !selectedFriend) return;
    try {
      const response = await fetch(`${BASE_URL}/api/chats/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: userDetails._id,
          receiverId: selectedFriend._id,
          text: msg,
          messageType: "text",
        }),
      });
      if (response.ok) {
        fetchMessages();
      } else {
        console.error("Message sending failed");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSendFile = async (file) => {
  if (!userDetails || !selectedFriend) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("senderId", userDetails._id);
  formData.append("receiverId", selectedFriend._id);

  try {
    const response = await fetch(`${BASE_URL}/api/chats/send-file`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("📁 File uploaded successfully");
      fetchMessages(); // refresh the chat
    } else {
      console.error("❌ File upload failed");
    }
  } catch (err) {
    console.error("❌ Error sending file:", err);
  }
};

  const handleSendVoice = () => {
    console.log("🎤 Voice message sent");
  };

  const setupAnalyser = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setIsTalking(volume > 20);
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };

  const handleVoiceCall = useCallback(async () => {
    if (!socket || !selectedFriend || !userDetails) return;
    console.log("📞 Initiating voice call to:", selectedFriend.username);
  
    setInCallWith(selectedFriend.username);
    setIsVideoCall(false); // 🛠️ Voice call => set video OFF
  
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false }); // 🛠️ AUDIO only
    localStreamRef.current = localStream;
    setupAnalyser(localStream);
  
    peerConnectionRef.current = new RTCPeerConnection(iceServers);
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });
  
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: selectedFriend._id,
        });
      }
    };
  
    peerConnectionRef.current.ontrack = (event) => {
      console.log("📥 Receiving remote stream on caller side", event);
      setRemoteStream(event.streams[0]);
      setReceivingAudio(true);
    };
  
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
  
    socket.emit("call-user", {
      to: selectedFriend._id,
      from: userDetails,
      offer: offer,
      callType: "voice", // 🛠️ Now this is a voice call
    });
  }, [selectedFriend, userDetails]);
  
  const handleVideoCall = useCallback(async () => {
    if (!socket || !selectedFriend || !userDetails) return;
    console.log("🎥 Initiating video call to:", selectedFriend.username);
  
    setInCallWith(selectedFriend.username);
    setIsVideoCall(true); // 🛠️ Video call => set video ON
  
    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true }); // 🛠️ AUDIO + VIDEO
    localStreamRef.current = localStream;
    setupAnalyser(localStream);
  
    peerConnectionRef.current = new RTCPeerConnection(iceServers);
    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });
  
    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: selectedFriend._id,
        });
      }
    };
  
    peerConnectionRef.current.ontrack = (event) => {
      console.log("📥 Receiving remote stream on caller side", event);
      setRemoteStream(event.streams[0]);
      setReceivingAudio(true);
    };
  
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
  
    socket.emit("call-user", {
      to: selectedFriend._id,
      from: userDetails,
      offer: offer,
      callType: "video", // 🛠️ Now this is a video call
    });
  }, [selectedFriend, userDetails]);
  

  const setupPeerConnection = useCallback(async (incomingOffer) => {
    console.log("📞 Setting up peer connection for incoming offer");

    const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    localStreamRef.current = localStream;
    setupAnalyser(localStream);

    peerConnectionRef.current = new RTCPeerConnection(iceServers);

    localStream.getTracks().forEach(track => {
      peerConnectionRef.current.addTrack(track, localStream);
    });

    peerConnectionRef.current.ontrack = (event) => {
      console.log("📥 Receiving remote stream (receiver side)", event);
      setRemoteStream(event.streams[0]);
      setReceivingAudio(true);
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          to: incomingOffer.fromId,
        });
      }
    };

    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(incomingOffer.offer));
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);

    socket.emit("answer-call", {
      to: incomingOffer.fromId,
      answer: answer,
    });
  }, []);

  const hangUp = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  
    setRemoteStream(null);
    setReceivingAudio(false);
    setInCallWith(null);
    setIsVideoCall(false); // ✅ Reset video call state
  
    handleHangUp();
    
    if (selectedFriend && selectedFriend._id) {
      socket.emit("hang-up", { to: selectedFriend._id });
    }
  
    socket.emit("hang-up", { to: userDetails._id });
  };

  const acceptCall = async () => {
    if (pendingCall) {
      await setupPeerConnection(pendingCall);
      setInCallWith(pendingCall.callerName);
      setIsVideoCall(pendingCall.callType === "video"); // ✅ Detect if it's video
      setPendingCall(null);
    }
  };

  const declineCall = () => {
    if (pendingCall) {
      socket.emit("hang-up", { to: pendingCall.fromId });
      setPendingCall(null);
    }
  };

  useEffect(() => {
    socket.on("incoming-call", (data) => {
      console.log("📞 Incoming call from:", data.callerName);
      setPendingCall({
        offer: data.offer,
        fromId: data.callerId,
        callerName: data.callerName,
        callType: data.callType, // ✅ Save callType
      });
    });

    socket.on("answer-made", async (data) => {
      console.log("📞 Answer received");
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on("ice-candidate", (data) => {
      console.log("📨 Received ICE candidate");
      const candidate = new RTCIceCandidate(data.candidate);
      peerConnectionRef.current?.addIceCandidate(candidate);
    });

    socket.on("hang-up", (data) => {
      if (data && data.to) {
        console.log("📴 Hang-up received from:", data.to);
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        setRemoteStream(null);
        setReceivingAudio(false);
        setInCallWith(null);
        setIsVideoCall(false);
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("answer-made");
      socket.off("ice-candidate");
      socket.off("hang-up");
    };
  }, [handleHangUp, userDetails]);

  return (
    <MainContainer>
      <CallAndVideoBar 
        onVoiceCall={handleVoiceCall} 
        onVideoCall={handleVideoCall}
      />
      {selectedFriend && (
        <div style={{ color: "white", padding: "16px", fontWeight: "bold" }}>
          Chatting with {selectedFriend.username}
        </div>
      )}
      <div style={{ flexGrow: 1, padding: "16px", overflowY: "auto" }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              style={{
                marginBottom: "12px",
                textAlign: msg.sender._id === userDetails?._id ? "right" : "left",
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
                  📎 {msg.fileUrl.split('/').pop()}
                </a>
              ) : msg.messageType === "voice" ? (
                <div>Voice message</div>
              ) : null}
            </div>
          ))
        ) : (
          <div style={{ color: "white" }}>No messages yet...</div>
        )}
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        onSendVoice={handleSendVoice}
        selectedFriend={selectedFriend}
      />

      {inCallWith && (
        isVideoCall ? (
          <InVideoCallOverlay
            talkingTo={inCallWith}
            onHangUp={hangUp}
            localStream={localStreamRef.current}
            remoteStream={remoteStream}
          />
        ) : (
          <InCallOverlay
            talkingTo={inCallWith}
            onHangUp={hangUp}
            micActive={isTalking}
            receivingAudio={receivingAudio}
          />
        )
      )}

      {pendingCall && (
        <CallOverlay
          callerName={pendingCall.callerName}
          onAccept={acceptCall}
          onDecline={declineCall}
        />
      )}

      {/* Hidden audio elements */}
      {localStreamRef.current && (
        <audio
          ref={(audio) => {
            if (audio) audio.srcObject = localStreamRef.current;
          }}
          autoPlay
          muted
          style={{ display: "none" }}
        />
      )}
  
      {remoteStream && (
        <audio
          ref={(audio) => {
            if (audio) audio.srcObject = remoteStream;
          }}
          autoPlay
          style={{ display: "none" }}
        />
      )}
    </MainContainer>
  );
};

export default Messanger;
