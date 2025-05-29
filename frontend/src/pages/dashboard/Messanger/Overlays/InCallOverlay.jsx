import { styled } from "@mui/system";

const InCallContainer = styled("div")({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
});

const InCallOverlay = ({ talkingTo, onHangUp, micActive, receivingAudio }) => {
  console.log("Receiving Audio:", receivingAudio);  // Debug log for receivingAudio state

  return (
    <InCallContainer>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h3>Talking to {talkingTo}</h3>
        <button
          onClick={onHangUp}
          style={{
            marginTop: "20px",
            backgroundColor: receivingAudio ? "blue" : micActive ? "green" : "red",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            transition: "background-color 0.5s ease",
          }}
        >
          Hang Up
        </button>
      </div>
    </InCallContainer>
  );
};

export default InCallOverlay;
