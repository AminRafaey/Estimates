import React, { useRef } from 'react';
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { useAppState } from '../../../../Context/AppContext';
import { isActionsHasAnyDim } from '../../utility';
import ProductRow from './ProductRow';

const StyledTableContainer = withStyles({
  root: {
    '& .MuiTableCell-root': {},
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontSize: '13px',
      color: '#9a9a9d',
      paddingTop: 2,
      paddingBottom: 2,
      borderWidth: '0px 0px 0px 0px',
    },
    '& .MuiTableBody-root .MuiTableCell-root': {
      fontSize: '14px',
      borderWidth: '0px 0px 0px 0px',
      paddingTop: 2,
      paddingBottom: 2,
      verticalAlign: 'text-top',
    },
    '& .MuiTableBody-root .MuiTableRow-root': {
      '&:nth-child(odd)': {},
      '&:nth-child(even)': {},
    },
    '& .MuiTableBody-root': {},
  },
})(TableContainer);

export default function ProductTable(props) {
  const { parentRoomId, roomId, simpleTableBg, tableAlternateBg } = props;
  const appState = useAppState();
  const backgroundIndex = useRef(0);
  return (
    <StyledTableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Surface</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell>Manufacturer</TableCell>

            <TableCell>Product</TableCell>
            <TableCell>Component</TableCell>
            <TableCell>Sheen</TableCell>

            <TableCell>Color Manufacturer</TableCell>

            <TableCell>Color Name</TableCell>
            <TableCell>Color Code</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces']
          ).map((parentSurfaceId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).length < 1
            ) {
              if (
                !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['included']
              ) {
                return;
              }
              const actions =
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'];

              if (
                !isActionsHasAnyDim(
                  appState,
                  parentRoomId,
                  roomId,
                  parentSurfaceId,
                  undefined
                )
              )
                return;
              backgroundIndex.current = backgroundIndex.current + 1;
              return (
                <ProductRow
                  key={parentRoomId + roomId + parentSurfaceId}
                  parentRoomId={parentRoomId}
                  roomId={roomId}
                  parentSurfaceId={parentSurfaceId}
                  surfaceId={undefined}
                  actions={actions}
                  rowBackground={
                    backgroundIndex.current % 2 === 0
                      ? tableAlternateBg
                      : simpleTableBg
                  }
                />
              );
            }

            return Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).map((surfaceId) => {
              if (
                !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['included']
              ) {
                return;
              }
              if (
                Object.entries(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions']
                ).length < 1
              )
                return;
              const actions =
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'];

              if (
                !isActionsHasAnyDim(
                  appState,
                  parentRoomId,
                  roomId,
                  parentSurfaceId,
                  surfaceId
                )
              )
                return;
              backgroundIndex.current = backgroundIndex.current + 1;
              return (
                <ProductRow
                  key={parentRoomId + roomId + parentSurfaceId + surfaceId}
                  parentRoomId={parentRoomId}
                  roomId={roomId}
                  parentSurfaceId={parentSurfaceId}
                  surfaceId={surfaceId}
                  actions={actions}
                  rowBackground={
                    backgroundIndex.current % 2 === 0
                      ? tableAlternateBg
                      : simpleTableBg
                  }
                />
              );
            });
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
