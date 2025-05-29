import React, { useState } from 'react';
import CustomPrimaryButton from './../../../components/CustomPrimaryButton';
import AddFriendOverlay from './AddFriendOverlay';

const additionalStyle = {
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const FriendAddButton = () => {
  const [isOverlayUp, setIsOverlayUp] = useState(false);

  const handleOpenAddFriendDialog = () => {
    setIsOverlayUp(true);
  };
  const handlerCloseOverlay = () => {
    setIsOverlayUp(false);
  };

  return (
    <>
      <div style={additionalStyle}>
        <input
          type="text"
          placeholder="Search for a friend"
          style={{
            padding: "8px",
            backgroundColor: "#2c2f33",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
          }}
        />
        <CustomPrimaryButton
          additionalStyle={{
            padding: "8px",
            backgroundColor: "#7289da",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          label="Add Friend"
          onClick={handleOpenAddFriendDialog}
        />
      </div>
      <AddFriendOverlay
        isOverlayUp={isOverlayUp}
        closeOverlayHandler={handlerCloseOverlay}
      />
    </>
  );
};

export default FriendAddButton;
