import React from 'react';
import { default as MuiTable } from '@material-ui/core/Table';

import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Box,
  withStyles,
} from '@material-ui/core';
import { useAppState } from '../../../../Context/AppContext';
import ProductSelection from './ProductSelection';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { IsDimHasAnyCoatsAssociatedProd } from '../../utility';
const TableWrapper = styled(Box)({
  background: '#ffff',
});

const StyledTableContainer = withStyles({
  root: {
    borderColor: '#E3E8EE',
    borderLeft: '1px solid #E3E8EE',
    borderRight: '1px solid #E3E8EE',
    '& .MuiTableHead-root .MuiTableCell-root': {
      fontSize: '14px',
      fontWeight: 600,
      padding: '12px 12px 12px 16px',
    },
  },
})(TableContainer);

export default function Table(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    bulkSelectionArr,
    setBulkSelectionArr,
    commonProducts,
    selectedToggle,
    AccordionCommonProducts,
    surfaceBulkSelectionArr,
    setSurfaceBulkSelectionArr,
    selectedActionId,
  } = props;
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();

  let actions;
  surfaceId
    ? (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'])
    : (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ]);

  let surface_id;
  surfaceId
    ? (surface_id =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['surface_id'])
    : (surface_id =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surface_id'
        ]);
  return (
    <TableWrapper>
      <StyledTableContainer>
        <MuiTable aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left"></TableCell>
              {Object.keys(
                surfaceProductionRatesState[surface_id]['surface_fields']
              ).map((fieldKey) => (
                <TableCell key={fieldKey}>
                  {
                    surfaceProductionRatesState[surface_id]['surface_fields'][
                      fieldKey
                    ]['name']
                  }
                </TableCell>
              ))}
              <TableCell align="left">Paint</TableCell>
              <TableCell align="left">Component</TableCell>
              <TableCell align="left">Sheen</TableCell>
              <TableCell align="left">Coats</TableCell>
              {selectedToggle === 'paint' ? (
                <React.Fragment>
                  <TableCell align="left">Product Cost</TableCell>
                  <TableCell align="left">Actions</TableCell>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <TableCell align="left">Manufacturer</TableCell>
                  <TableCell align="left" style={{ paddingLeft: 46 }}>
                    Color
                  </TableCell>
                </React.Fragment>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <React.Fragment>
              {Object.keys(actions[selectedActionId]['dimensions']).map(
                (dimensionKey) => {
                  if (
                    selectedToggle === 'colors' &&
                    !IsDimHasAnyCoatsAssociatedProd(
                      actions,
                      selectedActionId,
                      dimensionKey
                    )
                  ) {
                    return;
                  }
                  return (
                    <ProductSelection
                      key={dimensionKey}
                      parentRoomId={parentRoomId}
                      roomId={roomId}
                      parentSurfaceId={parentSurfaceId}
                      surfaceId={surfaceId}
                      actionId={selectedActionId}
                      action={actions[selectedActionId]}
                      bulkSelectionArr={bulkSelectionArr}
                      setBulkSelectionArr={setBulkSelectionArr}
                      surfaceBulkSelectionArr={surfaceBulkSelectionArr}
                      setSurfaceBulkSelectionArr={setSurfaceBulkSelectionArr}
                      commonProducts={commonProducts}
                      AccordionCommonProducts={AccordionCommonProducts}
                      dimensionKey={dimensionKey}
                      surface_id={surface_id}
                      selectedToggle={selectedToggle}
                    />
                  );
                }
              )}
            </React.Fragment>
          </TableBody>
        </MuiTable>
      </StyledTableContainer>
    </TableWrapper>
  );
}
