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
import ProductSelection from './ProductSelection';
import { useAppState } from '../../../../../Context/AppContext';
import { useSurfaceSelectionState } from '../../../../../Context/SurfaceSelectionContext';
import { useSurfaceProductionRatesState } from '../../../../../Context/SurfaceProductionRates';
import { IsDimHasAnyCoatsAssociatedProd } from '../../../utility';
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
    uniqueSurfaces,
    selectedActionId,
    parentSurfaceId,
    surfaceId,
    bulkSelectionArr,
    setBulkSelectionArr,
    commonProducts,
    AccordionCommonProducts,
    surfaceBulkSelectionArr,
    setSurfaceBulkSelectionArr,
    selectedToggle,
  } = props;
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const surfaceState = useSurfaceSelectionState();
  let actions;
  surfaceId
    ? (actions =
        uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'])
    : (actions = uniqueSurfaces[parentSurfaceId]['actions']);

  const getSurface_id = (surface, surfaceId) => {
    for (let c1 = 0; c1 < surface.length; c1++) {
      if (surface[c1]['id'] == surfaceId) {
        return surface[c1]['surface_id'];
      }
      if (surface[c1].surfaces && surface[c1].surfaces.length > 0) {
        const res = getSurface_id(surface[c1].surfaces, surfaceId);
        if (res) {
          return res;
        }
      }
    }
    return null;
  };

  const surface_id = getSurface_id(surfaceState, surfaceId || parentSurfaceId);

  return (
    <TableWrapper>
      <StyledTableContainer>
        <MuiTable aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Room</TableCell>
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
                <>
                  <TableCell align="left">Product Cost</TableCell>
                  <TableCell align="left">Actions</TableCell>
                </>
              ) : (
                <>
                  <TableCell align="left">Manufacturer</TableCell>
                  <TableCell align="left">Color</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(actions[selectedActionId]['room']).map(
              (roomId, index) => {
                const dimension = surfaceId
                  ? actions[selectedActionId]['room'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][selectedActionId]
                  : actions[selectedActionId]['room'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][selectedActionId];
                return (
                  <React.Fragment key={roomId}>
                    {Object.keys(dimension['dimensions']).map(
                      (dimensionKey) => {
                        if (
                          selectedToggle === 'colors' &&
                          !Object.keys(
                            dimension['dimensions'][dimensionKey]['products']
                          ).find(
                            (prodId) =>
                              dimension['dimensions'][dimensionKey]['products'][
                                prodId
                              ]['has_coats']
                          )
                        ) {
                          return;
                        }
                        return (
                          <ProductSelection
                            key={dimensionKey + roomId}
                            parentRoomId={
                              actions[selectedActionId]['room'][roomId][
                                'parentRoomId'
                              ]
                            }
                            roomId={roomId}
                            parentSurfaceId={parentSurfaceId}
                            surfaceId={surfaceId}
                            actionId={selectedActionId}
                            action={dimension}
                            bulkSelectionArr={bulkSelectionArr}
                            setBulkSelectionArr={setBulkSelectionArr}
                            surfaceBulkSelectionArr={surfaceBulkSelectionArr}
                            setSurfaceBulkSelectionArr={
                              setSurfaceBulkSelectionArr
                            }
                            AccordionCommonProducts={AccordionCommonProducts}
                            commonProducts={commonProducts}
                            dimensionKey={dimensionKey}
                            surface_id={surface_id}
                            selectedToggle={selectedToggle}
                          />
                        );
                      }
                    )}
                  </React.Fragment>
                );
              }
            )}
          </TableBody>
        </MuiTable>
      </StyledTableContainer>
    </TableWrapper>
  );
}
