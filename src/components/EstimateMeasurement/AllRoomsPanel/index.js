import React, { useState, useEffect } from 'react';
import SurfacePanel from './SurfacePanel';
import {
  Grid,
  styled,
  Box,
  Typography,
  OutlinedInput,
  FormControl,
} from '@material-ui/core';

import { useAppState } from '../../../Context/AppContext';

import { getUniqueSurfaces } from '../utility';
const RoomWrapper = styled(Box)({});
export const headingStyling = {
  fontSize: '14px',
};

const TimeWrapper = styled(Box)({
  marginBottom: 5,
});

const TimeTyp = styled(Typography)({
  fontSize: 14,
  marginBottom: 25,
});

const HourlyRateFieldWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

function AllRoomsPanel(props) {
  const { selectedRoom } = props;
  const [hourlyRate, setHourlyRate] = useState(
    window.localStorage.getItem('hourlyRate')
  );

  const appState = useAppState();
  const [uniqueSurfaces, setUniqueSurfaces] = useState(
    getUniqueSurfaces(appState)
  );

  useEffect(() => setUniqueSurfaces(getUniqueSurfaces(appState)), [
    selectedRoom,
  ]);

  return (
    <RoomWrapper>
      <Grid container>
        <Grid item xs={12}>
          <HourlyRateFieldWrapper>
            <Box display="flex" alignItems="flex-start" flexDirection="column">
              <TimeWrapper>
                <TimeTyp>hourly rate</TimeTyp>
              </TimeWrapper>
              <FormControl size="small" variant="outlined">
                <OutlinedInput
                  style={{ background: '#ffff', width: 73 }}
                  variant="outlined"
                  type={'number'}
                  defaultValue={window.localStorage.getItem('hourlyRate')}
                  onChange={(e) => {
                    setHourlyRate(e.target.value);
                    window.localStorage.setItem('hourlyRate', e.target.value);
                  }}
                />
              </FormControl>
            </Box>
          </HourlyRateFieldWrapper>
        </Grid>

        <Grid item xs={12}>
          <SurfacePanel
            uniqueSurfaces={uniqueSurfaces}
            selectedRoom={selectedRoom}
          />
        </Grid>
      </Grid>
    </RoomWrapper>
  );
}

AllRoomsPanel.defaultProps = {};

AllRoomsPanel.propTypes = {};
export default AllRoomsPanel;
