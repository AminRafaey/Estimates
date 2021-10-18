import React from 'react';
import { styled, Box, Typography } from '@material-ui/core';

const bedRoomStyling = {
  background: '#ffff',
  fontFamily: 'Medium',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const SubRoomNameWrapper = styled(Typography)({
  color: 'rgba(0, 0, 0, 0.85)',
  fontSize: '15px',
  fontFamily: 'Regular',
  padding: '20px 20px 20px',
});

const AccordionRoomWrapper = styled(Box)({
  ...bedRoomStyling,
  lineHeight: 1,
  background: '#f7fafc',
  height: '100%',
  minWidth: Math.round(window.innerWidth / 1.35),
});

const RoomMobileDragPreview = (props) => {
  const { roomCategory_Id, name } = props;
  if (!roomCategory_Id) {
    return <span></span>;
  }
  return (
    <AccordionRoomWrapper>
      <SubRoomNameWrapper>{name}</SubRoomNameWrapper>
    </AccordionRoomWrapper>
  );
};

export default RoomMobileDragPreview;
