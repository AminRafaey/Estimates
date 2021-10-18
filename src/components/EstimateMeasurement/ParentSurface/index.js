import React, { useState, useEffect } from 'react';
import { styled, Box, Grid, Typography, TextField } from '@material-ui/core';
import { Accordion } from '../../UI/Accordion/Accordion';
import { AccordionSummary } from '../../UI/Accordion/AccordionSummary';
import { AccordionDetails } from '../../UI/Accordion/AccordionDetails';
import AccordionArrowIcon from '../../../resources/AccordionArrowIcon';
import Surface from '../Surface';
import {
  useAppState,
  useAppDispatch,
  updateSurfaceNameForSingleRoom,
} from '../../../Context/AppContext';
const textFieldStyle = {
  background: '#ffff',
  width: 120,
};
const surfaceStyling = {
  background: '#ffff',
  fontFamily: 'Medium',
  border: '1px solid #E3E8EE',
};

const PHNameWrapper = styled(Box)({
  ...surfaceStyling,
  background: '#F5F6F8',
  padding: '8px',
  lineHeight: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: -2,
});
const PHNameTyp = styled(Typography)({
  fontSize: 14,
});

export default function ParentSurface(props) {
  const {
    selectedRoom,
    bulkSelectionArr,
    setBulkSelectionArr,
    parentSurfaceId,
    index,
    hourlyRate,
    fieldsLinkingList,
    setFieldsLinkingList,
    addAllFieldsCurrentSID,
    setAddAllFieldsCurrentSID,
  } = props;
  const [expandIcon, setExpandIcon] = useState('Less');
  const [expanded, setExpanded] = useState(true);
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const [showEditableField, setShowEditableField] = useState(false);

  useEffect(() => {
    setExpandIcon('Less');
    setExpanded(true);
  }, [selectedRoom]);

  const handleOnBlurOfSurfaceNameField = (e) => {
    setShowEditableField(false);
    updateSurfaceNameForSingleRoom(appDispatch, {
      surfaceName: e.target.value,
      parentRoomId,
      roomId,
      parentSurfaceId,
      undefined,
    });
  };

  const PanelHeader = (
    surfaceCategroy,
    index,
    parentRoomId,
    roomId,
    parentSurfaceId
  ) => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <PHNameWrapper
            style={{
              ...(Object.keys(
                appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
                  'surfaces'
                ]
              ).length -
                1 ===
                index && {
                borderBottom: '1px solid #E3E8EE',
                marginBottom: -1,
              }),
            }}
          >
            {showEditableField ? (
              <TextField
                autoFocus={true}
                style={{ ...textFieldStyle }}
                size="small"
                variant="outlined"
                defaultValue={surfaceCategroy.name}
                onBlur={handleOnBlurOfSurfaceNameField}
                onKeyUp={(e) =>
                  e.key === 'Enter' && handleOnBlurOfSurfaceNameField(e)
                }
              />
            ) : (
              <PHNameTyp onClick={() => setShowEditableField(true)}>
                {`${surfaceCategroy.name} ${
                  surfaceCategroy.name !== surfaceCategroy.actual_name &&
                  surfaceCategroy.actual_name
                    ? '(' + surfaceCategroy.actual_name + ')'
                    : ''
                }`}
              </PHNameTyp>
            )}

            <Box
              hidden={false}
              onClick={() => {
                setExpanded(expandIcon === 'More' ? true : false);
                expandIcon === 'More'
                  ? setExpandIcon('Less')
                  : setExpandIcon('More');
              }}
            >
              <AccordionArrowIcon iconType={expandIcon} />
            </Box>
          </PHNameWrapper>
        </Grid>
      </Grid>
    );
  };
  return (
    <Accordion
      expanded={expanded}
      type={'controlled'}
      key={parentSurfaceId + selectedRoom.id + selectedRoom.parent_id}
    >
      <AccordionSummary>
        {PanelHeader(
          appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
            'surfaces'
          ][parentSurfaceId],
          index,
          selectedRoom.parent_id,
          selectedRoom.id,
          parentSurfaceId
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Surface
          parentRoomId={selectedRoom.parent_id}
          roomId={selectedRoom.id}
          parentSurfaceId={parentSurfaceId}
          bulkSelectionArr={bulkSelectionArr}
          setBulkSelectionArr={setBulkSelectionArr}
          hourlyRate={hourlyRate}
          fieldsLinkingList={fieldsLinkingList}
          setFieldsLinkingList={setFieldsLinkingList}
          addAllFieldsCurrentSID={addAllFieldsCurrentSID}
          setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
        />
      </AccordionDetails>
    </Accordion>
  );
}
