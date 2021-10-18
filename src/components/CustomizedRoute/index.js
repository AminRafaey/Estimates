import React, { useState, useEffect } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { styled, Box, CircularProgress } from '@material-ui/core';
import { useAppDispatch, updateAppContext } from '../../Context/AppContext';
import {
  useRoomsState,
  useRoomsDispatch,
  loadRoomContext,
} from '../../Context/RoomSelectionContext';
import { updateParentState } from '../../Context/utility';
import {
  useSurfaceSelectionState,
  useSurfaceSelectionDispatch,
  loadSurfaceContext,
} from '../../Context/SurfaceSelectionContext';
import { useSessionDispatch } from '../../Context/Session';
import { saveRoomContext } from '../../api/estimateRoom';
import { saveSurfaceContext } from '../../api/estimateSurface';
import { cloneState } from '../EstimateProduct/stateClone';

const mappingPageWrapper = {
  paddingTop: 170,
  background: '#e9eef5',
  minHeight: '100vh',
};

const LoadingWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: window.innerHeight - 270,
});

export default function CustomizedRoute({ children, globalLoader, ...rest }) {
  const { prevPath } = useLocation();
  const [loading, setLoading] = useState(false);
  const estimateRooms = useRoomsState();
  const estimateRoomsDisatch = useRoomsDispatch();
  const appDispatch = useAppDispatch();
  const sessionDispatch = useSessionDispatch();
  const surfaceSelectionState = useSurfaceSelectionState();
  const surfaceSelectionDispatch = useSurfaceSelectionDispatch();

  useEffect(() => {
    if (prevPath === 'rooms' && Object.entries(estimateRooms).length > 0) {
      setLoading(true);

      let filteredEstimateRooms = cloneState(estimateRooms);
      Object.keys(estimateRooms).map((parentRoomId) => {
        Object.keys(estimateRooms[parentRoomId]['bedrooms']).map((roomId) => {
          if (
            !estimateRooms[parentRoomId]['bedrooms'][roomId]['name'] &&
            !estimateRooms[parentRoomId]['bedrooms'][roomId][
              'estimate_room_id'
            ] &&
            !estimateRooms[parentRoomId]['bedrooms'][roomId]['room_id']
          ) {
            delete filteredEstimateRooms[parentRoomId]['bedrooms'][roomId];
            filteredEstimateRooms = updateParentState(
              filteredEstimateRooms,
              parentRoomId
            );
          }
        });
      });

      saveRoomContext(sessionDispatch, filteredEstimateRooms).then((res) => {
        loadRoomContext(estimateRoomsDisatch, { rooms: res ? res : {} });
        updateAppContext(appDispatch, { roomsState: res });
        setLoading(false);
      });
    }
  }, [prevPath]);

  useEffect(() => {
    if (prevPath === 'surfaces' && surfaceSelectionState.length > 0) {
      setLoading(true);
      saveSurfaceContext(sessionDispatch, surfaceSelectionState).then((res) => {
        loadSurfaceContext(surfaceSelectionDispatch, {
          surfaces: res ? res : [],
        });
        setLoading(false);
      });
    }
  }, [prevPath]);

  return (
    <Route
      {...rest}
      render={({}) =>
        loading || globalLoader ? (
          <div style={mappingPageWrapper}>
            <LoadingWrapper>
              <CircularProgress color="primary" />
            </LoadingWrapper>
          </div>
        ) : (
          children
        )
      }
    />
  );
}
