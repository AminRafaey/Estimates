import React, { useState } from 'react';
import { styled, Box, Grid, Typography } from '@material-ui/core';
import ActionSelect from '../../ActionSelect';
import { useSurfaceProductionRatesState } from '../../../../../Context/SurfaceProductionRates';
import CoatFields from '../../CoatFields';
const PHNameWrapper = styled(Box)({
  background: '#F7FAFC',
  padding: '8px',
  lineHeight: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: '0px 1px 1px 1px',
  borderColor: '#E3E8EE',
  borderStyle: 'solid',
  width: '100%',
});

const PHNameTyp = styled(Typography)({
  fontSize: 14,
  paddingRight: 8,
  paddingTop: 8,
  wordBreak: 'break-word',
});
const NameWrapper = styled(Box)({
  display: 'flex',

  alignItems: 'center',

  height: '100%',
});

const CoatFieldWrapper = styled(Box)({
  display: 'flex',

  alignItems: 'center',

  height: '100%',
});
const FieldWrapper = styled(Box)({ paddingRight: 20 });

const FieldTyp = styled(Typography)({ fontSize: 14, paddingLeft: 4 });

export default function PanelHeader({
  uniqueSurfaces,
  parentSurfaceId,
  surfaceId,
  surface,
  surface_id,
}) {
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const [options, setOptions] = useState([
    ...surfaceProductionRatesState[surface_id]['surface_actions'],
  ]);
  return (
    <PHNameWrapper
      style={{
        ...(Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces'])
          .length === 0 && { borderTop: '1px solid #E3E8EE' }),
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={4} md={2}>
          <NameWrapper>
            <PHNameTyp>
              {surface.actual_name ? surface.actual_name : surface.name}
            </PHNameTyp>
          </NameWrapper>
        </Grid>
        <Grid item xs={6} md={3}>
          <FieldWrapper>
            <FieldTyp>Select Actions:</FieldTyp>

            <ActionSelect
              parentSurfaceId={parentSurfaceId}
              surfaceId={surfaceId}
              surface_id={surface_id}
              options={options}
              setOptions={setOptions}
            />
          </FieldWrapper>
        </Grid>
        <Grid item xs={false} md={1}></Grid>
        <Grid item xs={2}>
          <CoatFieldWrapper>
            <CoatFields
              parentSurfaceId={parentSurfaceId}
              surfaceId={surfaceId}
              surface_id={surface_id}
              actions={options}
            />
          </CoatFieldWrapper>
        </Grid>
      </Grid>
    </PHNameWrapper>
  );
}
