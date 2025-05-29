import React from "react";
import { styled } from "@mui/system";

const ButtonWrapper = styled("button")({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  border: "none",
  backgroundColor: "#2f3136",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  transition: "background-color 0.2s ease",
  overflow: "hidden", // Ensure the image stays circular
  padding: 0,
  "&:hover": {
    backgroundColor: "#3b3e44",
  },
});

const Icon = styled("img")({
  width: "100%",
  height: "100%",
  objectFit: "cover", // Ensures the image covers the button area without distortion
  userSelect: "none",
  pointerEvents: "none",
});

const GroupsButton = ({ onClick, title = "Group", image }) => {
  return (
    <ButtonWrapper onClick={onClick} title={title} aria-label={title}>
      <Icon src={image} alt={title} />
    </ButtonWrapper>
  );
};

export default GroupsButton;
