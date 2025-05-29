import React, { useState } from 'react';
import { styled } from '@mui/material';

const Wrapper = styled("div")({
  position: 'relative',
  width: '90%',
  marginBottom: '15px',
});

const StyledInput = styled("input")({
  padding: "10px 15px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "solid 1px #8d8d8d",
  letterSpacing: "1px",
  width: "100%",
  backgroundColor: "#fff",
  "&:focus": {
    outline: "none",
    border: "solid 1px #0034de",
  }
});

const StyledLabel = styled("label")(({ active }) => ({
  position: "absolute",
  left: "15px",
  top: active ? "-10px" : "50%",
  transform: active ? "translateY(0%) scale(0.8)" : "translateY(-50%)",
  fontSize: active ? "0.8rem" : "1rem",
  color: active ? "#0034de" : "#8d8d8d",
  backgroundColor: active ? "#fff" : "transparent",
  padding: active ? "0 5px" : "0",
  transition: "all 0.2s ease",
  pointerEvents: "none",
  fontWeight: active ? "bold" : "normal"
}));

export default function InputWithLabel({ value, setValue, label, type = "text", placeholder = "",additionalStyle }) {
  const [focused, setFocused] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const isActive = focused || value;

  return (
    <Wrapper style={additionalStyle}>
      <StyledInput
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        type={type}
        required
      />
      <StyledLabel active={isActive} >
        {label}
      </StyledLabel>
    </Wrapper>
  );
}
