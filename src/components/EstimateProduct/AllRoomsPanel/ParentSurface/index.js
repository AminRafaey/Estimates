import React, { useState } from 'react';
import { styled, Box, Grid, Typography } from '@material-ui/core';
import { Accordion } from '../../../UI/Accordion/Accordion';
import { AccordionSummary } from '../../../UI/Accordion/AccordionSummary';
import { AccordionDetails } from '../../../UI/Accordion/AccordionDetails';
import AccordionArrowIcon from '../../../../resources/AccordionArrowIcon';
import Surface from '../Surface';

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
    uniqueSurfaces,
    selectedActionId,
    bulkSelectionArr,
    setBulkSelectionArr,
    commonProducts,
    parentSurfaceId,
    index,
    selectedToggle,
  } = props;
  const [expandIcon, setExpandIcon] = useState('Less');
  const [expanded, setExpanded] = useState(true);

  const PanelHeader = (surfaceCategroy, index) => {
    return (
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <PHNameWrapper>
            <PHNameTyp
              onClick={() => {
                setExpanded(expandIcon === 'More' ? true : false);
                expandIcon === 'More'
                  ? setExpandIcon('Less')
                  : setExpandIcon('More');
              }}
            >
              {surfaceCategroy.actual_name
                ? surfaceCategroy.actual_name
                : surfaceCategroy.name}
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
    <Accordion expanded={expanded} type={'controlled'} key={parentSurfaceId}>
      <AccordionSummary>
        {PanelHeader(uniqueSurfaces[parentSurfaceId], index)}
      </AccordionSummary>
      <AccordionDetails>
        <Surface
          uniqueSurfaces={uniqueSurfaces}
          selectedActionId={selectedActionId}
          parentSurfaceId={parentSurfaceId}
          bulkSelectionArr={bulkSelectionArr}
          setBulkSelectionArr={setBulkSelectionArr}
          commonProducts={commonProducts}
          selectedToggle={selectedToggle}
        />
      </AccordionDetails>
    </Accordion>
  );
}
