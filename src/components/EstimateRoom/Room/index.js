import React, { useEffect, useRef, useState } from 'react';
import { CopyIcon, DeleteIcon } from '../../../resources';
import { AccordionDetails, Checkbox as MUICheckbox } from '../../UI';
import { useDrag, useDrop } from 'react-dnd';
import {
  useRoomsState,
  useRoomsDispatch,
  updateCheckbox,
  addSelectedValue,
  addNewRoom,
  deleteRoom,
  updateRoomPosition,
  addRoomAboveFromCurrent,
} from '../../../Context/RoomSelectionContext';
import DragAndDropIcon from '../../../resources/DragAndDropIcon';
import { styled, Box, Grid, Typography } from '@material-ui/core';
import '../../../antDesign.css';
import RoomSelect from '../RoomSelect';

const excludeColumn = {
  textAlign: 'center',
  background: '#ffffff',
  fontFamily: 'Medium',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const roomCheckbox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const bedRoomStyling = {
  background: '#ffff',
  fontFamily: 'Medium',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const includeColumn = {
  textAlign: 'center',
  background: '#f5f6f8',
  fontFamily: 'Medium',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const SubRoomNameWrapper = styled(Typography)({
  color: 'rgba(0, 0, 0, 0.85)',
  minWidth: 250,
  fontSize: '15px',
  fontFamily: 'Regular',
  display: 'inline-block',
  cursor: 'pointer',
});

const IconWrapper = styled(Box)({
  padding: '5px',
  cursor: 'pointer',
});

const AccordionExcludeWrapper = styled(Box)({
  ...excludeColumn,
  ...roomCheckbox,
  padding: '8px',
});

const AccordionActionWrapper = styled(Box)({
  ...excludeColumn,
  ...roomCheckbox,
  height: '100%',
});
const AccordionRoomWrapper = styled(Box)({
  ...bedRoomStyling,
  lineHeight: 1,
  background: '#f7fafc',
  height: '100%',
  display: 'flex',
  paddingLeft: 38,
  alignItems: 'center',
});

const AccordionIncludeWrapper = styled(Box)({
  ...includeColumn,
  ...roomCheckbox,
  padding: '8px',
});

const MenuWrapper = styled(Box)({
  cursor: 'move',
  alignItems: 'center',
  display: 'flex',
});

const Room = (props) => {
  const { roomCategory_Id, room_Id, open, getNewRoomId, position } = props;
  const [roomSelectShow, setRoomSelectShow] = useState(false);
  const roomsState = useRoomsState();
  const roomsDispatch = useRoomsDispatch();

  useEffect(() => {
    !roomsState[roomCategory_Id]['bedrooms'][room_Id]['name'] &&
      setRoomSelectShow(true);
  }, []);

  const dropRef = useRef(null);
  const dragRef = useRef(null);
  const [{ hoveringItem, canDrop, isOver }, drop] = useDrop({
    accept: 'Room',
    drop: (item) => {
      item &&
        item.type === 'Room' &&
        roomCategory_Id === item.roomCategory_Id &&
        item.room_Id &&
        updatePosition(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop:
        monitor.getItem() &&
        monitor.getItem().type === 'Room' &&
        monitor.getItem().roomCategory_Id === roomCategory_Id,
      hoveringItem: monitor.getItem(),
    }),
  });
  const updatePosition = (item) => {
    if (position < item.position) {
      addRoomAboveFromCurrent(roomsDispatch, {
        roomCategory_Id,
        room_Id: item.room_Id,
        newRoomId: room_Id,
      });
    } else if (position > item.position) {
      updateRoomPosition(roomsDispatch, {
        roomCategory_Id,
        room_Id: room_Id,
        newRoomId: item.room_Id,
      });
    }
  };
  const [{}, drag, preview] = useDrag({
    item: {
      type: 'Room',
      room_Id,
      position,
      roomCategory_Id,
      name: roomsState[roomCategory_Id]['bedrooms'][room_Id]['name'],
    },
  });

  drop(dropRef);
  drag(dragRef);
  const updateCheckboxStatus = (e, roomCategory_Id, room_Id) => {
    const checkBoxName = e.target.name;
    const checkboxStatus = e.target.checked;

    updateCheckbox(roomsDispatch, {
      roomCategory_Id: roomCategory_Id,
      room_Id: room_Id,
      selected: checkBoxName,
      value: checkboxStatus,
    });
  };
  return (
    <div ref={preview} className="room">
      <div
        ref={dropRef}
        style={{
          ...(isOver &&
            canDrop &&
            hoveringItem &&
            (hoveringItem.position > position
              ? { borderTop: '#1488FC 1px solid' }
              : { borderBottom: '#1488FC 1px solid' })),
        }}
      >
        <AccordionDetails>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <AccordionRoomWrapper>
                <div
                  ref={dragRef}
                  className="dragIcon"
                  style={{ display: 'flex', cursor: 'move' }}
                >
                  <MenuWrapper>
                    <DragAndDropIcon />
                  </MenuWrapper>
                </div>
                {!roomSelectShow &&
                roomsState[roomCategory_Id]['bedrooms'][room_Id]['name'] !==
                  '' ? (
                  <SubRoomNameWrapper onClick={() => setRoomSelectShow(true)}>
                    {roomsState[roomCategory_Id]['bedrooms'][room_Id]['name']}
                  </SubRoomNameWrapper>
                ) : (
                  <RoomSelect
                    roomCategory_Id={roomCategory_Id}
                    room_Id={room_Id}
                    open={open}
                    setRoomSelectShow={setRoomSelectShow}
                    getNewRoomId={getNewRoomId}
                  />
                )}
              </AccordionRoomWrapper>
            </Grid>
            <Grid item xs={2}>
              <AccordionIncludeWrapper>
                <MUICheckbox
                  name="included"
                  checked={
                    roomsState[roomCategory_Id]['bedrooms'][room_Id]['included']
                  }
                  onChange={(e) => {
                    updateCheckboxStatus(e, roomCategory_Id, room_Id);
                  }}
                />
              </AccordionIncludeWrapper>
            </Grid>
            <Grid item xs={2}>
              <AccordionExcludeWrapper>
                <MUICheckbox
                  name="excluded"
                  checked={
                    roomsState[roomCategory_Id]['bedrooms'][room_Id]['excluded']
                  }
                  onChange={(e) => {
                    updateCheckboxStatus(e, roomCategory_Id, room_Id);
                  }}
                />
              </AccordionExcludeWrapper>
            </Grid>
            <Grid item xs={2}>
              <AccordionActionWrapper>
                <IconWrapper
                  onClick={() => {
                    const id = getNewRoomId();

                    addNewRoom(roomsDispatch, {
                      roomCategory_Id: roomCategory_Id,
                      room_Id: id,
                      included: true,
                      roomName:
                        roomsState[roomCategory_Id]['bedrooms'][room_Id][
                          'name'
                        ],
                    });
                    updateRoomPosition(roomsDispatch, {
                      roomCategory_Id,
                      room_Id,
                      newRoomId: id,
                    });
                  }}
                >
                  <CopyIcon />
                </IconWrapper>
                <IconWrapper
                  onClick={() => {
                    if (
                      roomsState[roomCategory_Id]['bedrooms'][room_Id][
                        'room_id'
                      ]
                    ) {
                      addSelectedValue(roomsDispatch, {
                        roomCategory_Id: roomCategory_Id,
                        room_Id: room_Id,
                        selectedValue: false,
                      });
                      roomsState[roomCategory_Id]['bedrooms'][room_Id][
                        'included'
                      ] &&
                        updateCheckbox(roomsDispatch, {
                          roomCategory_Id: roomCategory_Id,
                          room_Id: room_Id,
                          selected: 'included',
                          value: false,
                        });
                      roomsState[roomCategory_Id]['bedrooms'][room_Id][
                        'excluded'
                      ] &&
                        updateCheckbox(roomsDispatch, {
                          roomCategory_Id: roomCategory_Id,
                          room_Id: room_Id,
                          selected: 'excluded',
                          value: false,
                        });
                    } else {
                      deleteRoom(roomsDispatch, {
                        roomCategory_Id: roomCategory_Id,
                        room_Id: room_Id,
                      });
                    }
                  }}
                >
                  <DeleteIcon />
                </IconWrapper>
              </AccordionActionWrapper>
            </Grid>
          </Grid>
        </AccordionDetails>
      </div>
    </div>
  );
};
export default Room;
