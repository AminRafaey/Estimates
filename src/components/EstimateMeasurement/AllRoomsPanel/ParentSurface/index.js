import React, { useState, useEffect } from 'react';
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
  const { selectedRoom, parentSurfaceId, uniqueSurfaces } = props;
  const [expandIcon, setExpandIcon] = useState('Less');
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    setExpandIcon('Less');
    setExpanded(true);
  }, [selectedRoom]);

  const PanelHeader = (surfaceCategroy) => {
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
        {PanelHeader(uniqueSurfaces[parentSurfaceId])}
      </AccordionSummary>
      <AccordionDetails>
        <Surface
          parentSurfaceId={parentSurfaceId}
          uniqueSurfaces={uniqueSurfaces}
        />
      </AccordionDetails>
    </Accordion>
  );
}
