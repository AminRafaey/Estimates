import React, { useState, useEffect } from 'react';
import { styled, Box, Grid, Typography } from '@material-ui/core';
import { Accordion } from '../../UI/Accordion/Accordion';
import { AccordionSummary } from '../../UI/Accordion/AccordionSummary';
import { AccordionDetails } from '../../UI/Accordion/AccordionDetails';
import AccordionArrowIcon from '../../../resources/AccordionArrowIcon';
import Surface from '../Surface';
import { useAppState } from '../../../Context/AppContext';

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
    commonProducts,
    selectedToggle,
    parentSurfaceId,
    index,
    selectedActionId,
  } = props;
  const [expandIcon, setExpandIcon] = useState('More');
  const [expanded, setExpanded] = useState(false);
  const appState = useAppState();

  useEffect(() => {
    setExpandIcon('More');
    setExpanded(false);
  }, [selectedRoom]);

  const PanelHeader = (surfaceCategroy, index) => {
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
            <PHNameTyp
              onClick={() => {
                setExpanded(expandIcon === 'More' ? true : false);
                expandIcon === 'More'
                  ? setExpandIcon('Less')
                  : setExpandIcon('More');
              }}
            >
              {`${surfaceCategroy.name} ${
                surfaceCategroy.name !== surfaceCategroy.actual_name &&
                surfaceCategroy.actual_name
                  ? '(' + surfaceCategroy.actual_name + ')'
                  : ''
              }`}
            </PHNameTyp>
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
          index
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Surface
          parentRoomId={selectedRoom.parent_id}
          roomId={selectedRoom.id}
          parentSurfaceId={parentSurfaceId}
          bulkSelectionArr={bulkSelectionArr}
          setBulkSelectionArr={setBulkSelectionArr}
          commonProducts={commonProducts}
          selectedToggle={selectedToggle}
          selectedActionId={selectedActionId}
        />
      </AccordionDetails>
    </Accordion>
  );
}
