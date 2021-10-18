import React, { useEffect, useState, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import Room from '../Room';
import {
  useRoomsState,
  useRoomsDispatch,
  updateParent,
  addSelectedValueOfParent,
  updateMainCheckbox,
  addNewRoom,
  addCategoryBelowFromCurrent,
  addCategoryAboveFromCurrent,
} from '../../../Context/RoomSelectionContext';
import { styled, Box, Grid, Typography } from '@material-ui/core';

import { Accordion, AccordionSummary, Checkbox as MUICheckbox } from '../../UI';
import { DeleteIcon } from '../../../resources';
import AccordionArrow from '../../../resources/AccordionArrowIcon';
import DragAndDropIcon from '../../../resources/DragAndDropIcon';
import CategorySelect from '../CategorySelect';

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

const PanelHeaderSubRoomWrapper = styled(Box)({
  ...bedRoomStyling,
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  lineHeight: '0',
});
const PannelHeaderInclude = styled(Box)({
  ...includeColumn,
  ...roomCheckbox,
  height: '100%',
});

const PanelHeaderExcludeWrapper = styled(Box)({
  ...roomCheckbox,
  ...excludeColumn,
  height: '100%',
});

const PanelHeaderActionWrapper = styled(Box)({
  ...excludeColumn,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
});
const PanelHeaderEmptyActionWrapper = styled(Box)({
  ...excludeColumn,
  height: '100%',
});

const RoomNameHeader = styled(Typography)({
  fontSize: '15px',
  fontFamily: 'Medium',
  color: 'black',
  display: 'inline',
});
const RoomNameWrapper = styled(Box)({
  width: '100%',
});

const RoomSelectHeader = styled(Box)({
  fontSize: '15px',
  fontFamily: 'Medium',
  color: 'black',
  display: 'inline',
  width: '100%',
});

const CollapseBtn = styled(Box)({
  width: '100px',
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});
const EmptyWrapper = styled(Box)({});

const NewRoomWrapper = styled(Box)({
  padding: '20px 12px 20px 66px',
  fontSize: '15px',
  color: '#76b9fd',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  cursor: 'default',
});
const NewRoomInnerTyp = styled(Typography)({
  cursor: 'pointer',
});

const MenuWrapper = styled(Box)({
  cursor: 'move',
  alignItems: 'center',
  display: 'flex',
});

const CategoryContainer = (props) => {
  const {
    roomCategory_Id,
    open,
    collapseAll,
    setCollapseAll,
    getNewRoomId,
  } = props;

  const [expandIcon, setExpandIcon] = useState('Less');
  const [expanded, setExpanded] = useState(true);
  const [categrySelectShow, setCategorySelectShow] = useState(false);
  const dragRef = useRef(null);
  const roomsState = useRoomsState();
  const roomsDispatch = useRoomsDispatch();
  const position = roomsState[roomCategory_Id]['position'];
  const dropRef = useRef(null);
  useEffect(() => {
    if (collapseAll) {
      setExpanded(false);
      setExpandIcon('More');
    }
  }, [collapseAll]);
  const [{ isOver, canDrop, hoveringItem }, drop] = useDrop({
    accept: ['Room', 'Room_Category'],
    drop: (item) => {
      item && roomCategory_Id !== item.roomCategory_Id && item.type === 'Room'
        ? item.room_Id &&
          !roomsState[roomCategory_Id]['bedrooms'][item.room_Id] &&
          updateParent(roomsDispatch, {
            roomCategory_Id: item.roomCategory_Id,
            room_Id: item.room_Id,
            newRoomCategoryId: roomCategory_Id,
          })
        : handleCategoryDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop:
        monitor.getItem() &&
        (monitor.getItem().type === 'Room'
          ? monitor.getItem().roomCategory_Id !== roomCategory_Id
          : true),
      hoveringItem: monitor.getItem(),
    }),
  });

  const [{}, drag, preview] = useDrag({
    item: {
      roomCategory_Id,
      type: 'Room_Category',
      name: roomsState[roomCategory_Id]['name'],
      position: position,
    },
  });

  const isAnyRoomSelected = (parentRoomsId) => {
    return Object.keys(roomsState[parentRoomsId]['bedrooms']).find(
      (roomId) => roomsState[parentRoomsId]['bedrooms'][roomId]['selected']
    );
  };
  const handleMainCheckboxAllChange = (e, roomCategory_Id) => {
    const checkboxStatus = e.target.checked;
    const checkBoxName = e.target.name;
    updateMainCheckbox(roomsDispatch, {
      roomCategory_Id: roomCategory_Id,
      value: checkboxStatus,
      selected: checkBoxName,
    });
  };
  drag(dragRef);
  function PanelHeader(Pkey) {
    return (
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <PanelHeaderSubRoomWrapper>
            <div
              ref={dragRef}
              className="dragIconOfRoomCategory"
              style={{ display: 'flex' }}
              onDragStart={() => setCollapseAll(true)}
            >
              <MenuWrapper>
                <DragAndDropIcon />
              </MenuWrapper>
            </div>
            {categrySelectShow || roomsState[Pkey]['name'] === '' ? (
              <RoomSelectHeader>
                <CategorySelect
                  roomCategory_Id={Pkey}
                  open={open}
                  setCategorySelectShow={setCategorySelectShow}
                  setCollapseAll={setCollapseAll}
                  setExpanded={setExpanded}
                  setExpandIcon={setExpandIcon}
                  expanded={expanded}
                  getNewRoomId={getNewRoomId}
                />
              </RoomSelectHeader>
            ) : (
              <RoomNameWrapper>
                <RoomNameHeader onClick={() => setCategorySelectShow(true)}>
                  {roomsState[Pkey]['name']}
                </RoomNameHeader>
              </RoomNameWrapper>
            )}
            <NewRoomWrapper>
              <NewRoomInnerTyp
                onClick={() => {
                  const id = getNewRoomId();
                  setCollapseAll(false);
                  setExpanded(true);
                  setExpandIcon('Less');

                  setTimeout(
                    () => {
                      addNewRoom(roomsDispatch, {
                        roomCategory_Id: roomCategory_Id,
                        room_Id: id,
                        included: true,
                        roomName: '',
                      });
                    },
                    expanded ? 0 : 500
                  );
                }}
              >
                Add new room
              </NewRoomInnerTyp>
            </NewRoomWrapper>
            <CollapseBtn
              onClick={() => {
                setExpanded(expandIcon === 'More' ? true : false);
                expandIcon === 'More'
                  ? setExpandIcon('Less')
                  : setExpandIcon('More');
                collapseAll && setCollapseAll(false);
              }}
            >
              <AccordionArrow iconType={expandIcon} />
            </CollapseBtn>
          </PanelHeaderSubRoomWrapper>
        </Grid>
        <Grid item onClick={(event) => event.stopPropagation()} xs={2}>
          <PannelHeaderInclude>
            <MUICheckbox
              name={'included'}
              indeterminate={roomsState[Pkey]['includedIntermediate']}
              onChange={(e) => handleMainCheckboxAllChange(e, Pkey)}
              checked={roomsState[Pkey]['included']}
            />
          </PannelHeaderInclude>
        </Grid>

        <Grid item onClick={(event) => event.stopPropagation()} xs={2}>
          <PanelHeaderExcludeWrapper>
            <MUICheckbox
              name={'excluded'}
              indeterminate={roomsState[Pkey]['excludedIntermediate']}
              onChange={(e) => handleMainCheckboxAllChange(e, Pkey)}
              checked={roomsState[Pkey]['excluded']}
            />
          </PanelHeaderExcludeWrapper>
        </Grid>
        <Grid item onClick={(event) => event.stopPropagation()} xs={2}>
          {!isAnyRoomSelected(Pkey) ? (
            <PanelHeaderActionWrapper>
              <EmptyWrapper
                onClick={() =>
                  addSelectedValueOfParent(roomsDispatch, {
                    roomCategory_Id: Pkey,
                    selectedValue: false,
                  })
                }
              >
                <DeleteIcon />{' '}
              </EmptyWrapper>
            </PanelHeaderActionWrapper>
          ) : (
            <PanelHeaderEmptyActionWrapper></PanelHeaderEmptyActionWrapper>
          )}
        </Grid>
      </Grid>
    );
  }
  const handleCategoryDrop = (item) => {
    if (position > item.position)
      addCategoryBelowFromCurrent(roomsDispatch, {
        roomCategory_Id,
        newRoomCategoryId: item.roomCategory_Id,
      });
    else if (position < item.position) {
      addCategoryAboveFromCurrent(roomsDispatch, {
        roomCategory_Id,
        newRoomCategoryId: item.roomCategory_Id,
      });
    }
  };
  drop(dropRef);
  return (
    <div
      ref={dropRef}
      style={{
        ...(hoveringItem &&
          isOver &&
          canDrop &&
          (hoveringItem.type !== 'Room_Category'
            ? { border: '#1488FC 1px solid' }
            : hoveringItem.position > position
            ? { borderTop: '#1488FC 1px solid' }
            : { borderBottom: '#1488FC 1px solid' })),
      }}
    >
      <Accordion
        expanded={collapseAll ? false : expanded}
        type={'controlled'}
        TransitionProps={{ unmountOnExit: true }}
      >
        <div ref={preview} className="roomCategory">
          <AccordionSummary>{PanelHeader(roomCategory_Id)}</AccordionSummary>
        </div>

        {Object.keys(roomsState[roomCategory_Id]['bedrooms'])
          .sort(
            (a, b) =>
              roomsState[roomCategory_Id]['bedrooms'][a]['position'] -
              roomsState[roomCategory_Id]['bedrooms'][b]['position']
          )
          .map((key) => {
            if (!roomsState[roomCategory_Id]['bedrooms'][key]['selected'])
              return;
            return (
              <div key={key} style={{ overflow: 'hidden', clear: 'both' }}>
                <Room
                  roomCategory_Id={roomCategory_Id}
                  room_Id={key}
                  open={open}
                  position={
                    roomsState[roomCategory_Id]['bedrooms'][key]['position']
                  }
                  getNewRoomId={getNewRoomId}
                />
              </div>
            );
          })}
      </Accordion>
    </div>
  );
};

export default CategoryContainer;
