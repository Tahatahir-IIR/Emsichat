import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import axios from "axios";
import BASE_URL from "../../../utils/BASE_URL"; 


import CircleButton from "./SidebarElement/MainPageButton";
import Divider from "./SidebarElement/Divider";
import AddServerModal from "./SidebarElement/AddServerModal";
import GroupsButton from "./SidebarElement/GroupsButton";

import GroupPNG from "../../../zickoFineWork/groups.png";
import PlusPNG from "../../../zickoFineWork/plus.png";

const SIDEBAR_WIDTH = 50; // sidebar width
const VISIBLE_EDGE = -10;   // part of sidebar visible offscreen for hover
const SIDEBAR_HEIGHT = '50vh';

const SidebarWrapper = styled("div")({
  position: "fixed",
  top: "50%",
  left: 0,
  height: '50vh',
  width: `-10px`,  // part that stays visible
  transform: "translateY(-50%)",
  zIndex: 1000,
  cursor: "pointer",
  "&:hover > div": {
    left: 0, // slide in full sidebar
  },
});

const MainContainer = styled("div")({
  position: "fixed",
  top: "50%",
  left: `-${SIDEBAR_WIDTH - VISIBLE_EDGE}px`,
  height: SIDEBAR_HEIGHT,
  width: `${SIDEBAR_WIDTH}px`,
  transform: "translateY(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px 10px",
  gap: "16px",
  borderTopRightRadius: "25px",
  borderBottomRightRadius: "25px",
  backgroundColor: "rgba(15, 15, 15, 0.85)",
  backdropFilter: "blur(12px)",
  boxShadow: "2px 0 6px rgba(0, 255, 127, 0.3)",
  borderRight: "2px solid transparent",
  backgroundImage: `
    linear-gradient(to right, rgba(15, 15, 15, 0.85), rgba(15, 15, 15, 0.85)),
    linear-gradient(to right, #00ff7f, #00b894)
  `,
  backgroundClip: "padding-box, border-box",
  backgroundOrigin: "padding-box, border-box",
  transition: "left 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
  overflowX: "hidden",
  fontFamily: "'Inter', sans-serif",

  "&:hover": {
    alignItems: "flex-start",
    paddingLeft: "16px",
    paddingRight: "16px",
    boxShadow: "4px 0 15px rgba(0, 255, 127, 0.6)",
    transform: "translateY(-50%) scale(1.03)",
  },
});



const SideBar = ({ onServerSelect }) => {
  const [showModal, setShowModal] = useState(false);
  const [servers, setServers] = useState([]);

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const response = await axios.get(`${BASE_URL}/api/groups/user/${user._id}`);
        setServers(response.data);
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      }
    };

    fetchServers();
  }, [showModal]);

  return (
    <>
    <SidebarWrapper>
      <MainContainer>
        {/* 👇 Clicking this sets private view */}
        <CircleButton image={GroupPNG} title="private" onClick={() => onServerSelect(null)} />
        <Divider />
        {servers.map((server) => (
          <GroupsButton
            key={server._id}
            image={`${BASE_URL}/uploads/${server.image}`}
            title={server.name}
            onClick={() => onServerSelect(server)} // 👈 Triggers server view
          />
        ))}
        <CircleButton image={PlusPNG} title="Add" onClick={handleAddClick} />
      </MainContainer>

      {showModal && <AddServerModal onClose={handleCloseModal} />}
      </SidebarWrapper>
    </>
  );
};

export default SideBar;
