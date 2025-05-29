import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/system';

const RedirectText = styled("span")({
  color: "#0034de",
  fontWeight: 600,
  cursor: "pointer",
  marginLeft: "5px",
  transition: "color 0.2s ease, text-decoration 0.2s ease",
  "&:hover": {
    textDecoration: "underline",
    color: "#002cbb",
  },
});

export default function RedirectInfo({
  text,
  redirectText,
  additionnalStyle,
  redirectHandler,
}) {
  return (
    <Typography
      variant="subtitle2"
      sx={{
        color: "black",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        ...additionnalStyle,
      }}
    >
      {text}
      <RedirectText onClick={redirectHandler}>{redirectText}</RedirectText>
    </Typography>
  );
}
