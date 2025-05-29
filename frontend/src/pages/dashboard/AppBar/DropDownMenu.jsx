import * as React from 'react';
import Menu from '@mui/material/Menu';
import { styled } from "@mui/system";
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { logout } from '../../../utils/Auth';

const MainContainer = styled("div")({
  width: "40px", // Increase the size to make the gradient more visible
  height: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // Center the content inside
  alignItems: "center",
});


const HoverableIconButton = styled(IconButton)({
  width: "35px", // Increase the size to make the gradient more visible
  height: "35px",
  marginTop:"5px",
  borderRadius: "50%",
  background: "linear-gradient(145deg, #04ec27, #3c6139)", // Ensure the gradient is set correctly
  transition: "transform 0.2s ease, box-shadow 0.3s ease, background-color 0.3s ease, border-radius 0.3s ease",
  "&:hover": {
    transform: "scale(1.15)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2), 0 -6px 12px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Light background on hover
    borderRadius: "8px", // Rounded square effect
  },
});


export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Opens the menu when the button is clicked
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Closes the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <MainContainer>
      <HoverableIconButton onClick={handleMenuOpen} style={{ color: 'white' }}>
        <MoreVertIcon />
      </HoverableIconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </MainContainer>
  );
}
