import React from "react";
import { styled } from "@mui/system";

const StyledDivider = styled("div")({
  width: "45px",
  height: "2px",
  backgroundColor: "#4f545c",
});

const Divider = () => {
  return <StyledDivider />;
};

export default Divider;
