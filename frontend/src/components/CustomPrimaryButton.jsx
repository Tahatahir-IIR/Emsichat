import React from 'react';
import { Button } from '@mui/material';

export default function CustomPrimaryButton({
  label,
  additionalStyle,
  disabled,
  onClick,
}) {
  const defaultStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    borderRadius: '10px',
    border: 'solid 1px #1034aa',
    borderBottom: 'solid 1px #90c2ff',
    background: 'linear-gradient(135deg, #0034de, #006eff)',
    color: '#fff',
    fontWeight: 'bolder',
    transition: 'all 0.2s ease',
    boxShadow:
      '0px 2px 3px #000d3848, inset 0px 4px 5px #0070f0, inset 0px -4px 5px #002cbb',
    width: '100%',
    height: '40px',
    '&:active': {
      boxShadow:
        'inset 0px 4px 5px #0070f0, inset 0px -4px 5px #002cbb',
      transform: 'scale(0.995)',
    },
  };

  return (
    <Button
      type="button"
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      sx={additionalStyle || defaultStyle}
    >
      {label}
    </Button>
  );
}
