import { styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import FriendsListItem from './FriendsListItem';
import BASE_URL from "../../../../utils/BASE_URL"; 


const MainContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
  flexGrow: 1,
});

const FriendsList = ({ onFriendSelect, onlineUsers }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const res = await fetch(`${BASE_URL}/api/friends/friends/${user.mail}`);
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();

    const intervalId = setInterval(() => {
      fetchFriends();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSelectFriend = (friend) => {
    setSelectedFriendId(friend._id);
    onFriendSelect && onFriendSelect(friend);
  };

  return (
    <MainContainer>
      {friends.map((f) => (
        <FriendsListItem
          username={f.username}
          id={f._id}
          key={f._id}
          isOnline={onlineUsers?.includes(f._id)}
          isSelected={selectedFriendId === f._id}
          onClick={() => handleSelectFriend(f)}
        />
      ))}
    </MainContainer>
  );
};

export default FriendsList;
