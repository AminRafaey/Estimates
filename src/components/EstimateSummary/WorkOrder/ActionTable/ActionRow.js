import React from 'react';
import {
  withStyles,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  styled,
} from '@material-ui/core';
import { useAppState } from '../../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../../Context/ProductContext';
import { getHoursAgainstAction } from '../../utility';

export default function ActionRow(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actions,
    rowBackground,
  } = props;
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();

  return (
    <>
      {Object.keys(actions).map((actionId, index) => (
        <TableRow
          style={{ background: rowBackground }}
          key={roomId + parentSurfaceId + actionId}
        >
          {index === 0 && (
            <TableCell rowSpan={Object.entries(actions).length}>
              {surfaceId
                ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['name']
                : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['name']}
            </TableCell>
          )}
          <TableCell>{actions[actionId]['name']}</TableCell>

          <TableCell>{`${getHoursAgainstAction(
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actions[actionId],
            actionId,
            surfaceId
              ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['surface_id']
              : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surface_id'],
            appState,
            surfaceProductionRatesState
          ).toFixed(2)}`}</TableCell>
        </TableRow>
      ))}
    </>
  );
}
