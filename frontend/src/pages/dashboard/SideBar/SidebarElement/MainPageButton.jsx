import React from "react";
import { styled } from "@mui/system";

const StyledButton = styled("button")(({ backgroundImage }) => ({
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  backgroundColor: "#40444b",
  backgroundSize: "60%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundImage: `url(${backgroundImage})`,
  border: "none",
  cursor: "pointer",
  transition: "background 0.2s ease, transform 0.2s ease",
  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  "&:hover": {
    backgroundColor: "#37d529",
    transform: "scale(1.05)",
  },
}));

// ✅ Added `onClick` support here
const MainPageButton = ({ image, title, onClick }) => {
  return (
    <StyledButton backgroundImage={image} title={title} onClick={onClick} />
  );
};

export default MainPageButton;
