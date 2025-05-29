import React from "react";
import { styled } from "@mui/system";
import GroupDashboard from "./GroupDashboard";

const Wrapper = styled("div")({
  display: "flex",
  flexDirection: "row",
  width: "100%",
  height: "100vh",
  overflow: "hidden",
});

const GroupView = ({ server }) => {
  return (
    <Wrapper>
      <GroupDashboard selectedGroup={server} />
    </Wrapper>
  );
};

export default GroupView;
