
import { styled } from "@mui/system";


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


const MessangerWait = ({ selectedFriend, handleHangUp }) => {
  return (
    <MainContainer>
      
    </MainContainer>
  );
};

export default MessangerWait;
