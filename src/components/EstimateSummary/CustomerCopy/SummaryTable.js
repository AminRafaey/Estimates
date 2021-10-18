import React from 'react';
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@material-ui/core';
import { useAppState } from '../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../Context/ProductContext';
import {
  getTotalCostOfSurface,
  isActionsHasAnyDim,
  getTotalHours,
} from '../utility';

const ProductContentTyp = styled(Typography)({
  fontSize: 14,
});

const StyledTableContainer = withStyles({
  root: {
    marginTop: '-22px',
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

export default function SummaryTable(props) {
  const { parentRoomId, roomId } = props;
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();

  return (
    <StyledTableContainer>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Surface</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell>Products</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Cost</TableCell>
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
              return (
                <TableRow key={roomId + parentSurfaceId}>
                  <TableCell>
                    {
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['name']
                    }
                  </TableCell>
                  <TableCell>
                    {Object.keys(actions).reduce(
                      (total, actionId, index) =>
                        total +
                        `${index !== 0 ? ', ' : ''}` +
                        actions[actionId]['name'],
                      ''
                    )}
                  </TableCell>
                  <TableCell>
                    {Object.keys(actions)
                      .map((actionId) =>
                        Object.keys(actions[actionId]['dimensions'])
                          .map((dimensionId) =>
                            Object.keys(
                              actions[actionId]['dimensions'][dimensionId][
                                'products'
                              ]
                            ).map((productId) => (
                              <ProductContentTyp
                                key={actionId + dimensionId + productId}
                              >
                                {`${
                                  actions[actionId]['dimensions'][dimensionId][
                                    'products'
                                  ][productId]['name']
                                }${
                                  actions[actionId]['dimensions'][dimensionId][
                                    'products'
                                  ][productId]['component']
                                    ? ' - ' +
                                      actions[actionId]['dimensions'][
                                        dimensionId
                                      ]['products'][productId]['component'][
                                        'name'
                                      ]
                                    : ''
                                }${
                                  actions[actionId]['dimensions'][dimensionId][
                                    'products'
                                  ][productId]['sheen']
                                    ? ' - ' +
                                      actions[actionId]['dimensions'][
                                        dimensionId
                                      ]['products'][productId]['sheen']['name']
                                    : ''
                                }${
                                  actions[actionId]['dimensions'][dimensionId][
                                    'products'
                                  ][productId]['has_coats']
                                    ? ' - ' +
                                      actions[actionId]['dimensions'][
                                        dimensionId
                                      ]['products'][productId]['has_coats']
                                    : ''
                                }`}
                              </ProductContentTyp>
                            ))
                          )
                          .flat()
                      )
                      .flat()}
                  </TableCell>
                  <TableCell>{`${getTotalHours(
                    parentRoomId,
                    roomId,
                    parentSurfaceId,
                    undefined,
                    actions,
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surface_id'],
                    appState,
                    surfaceProductionRatesState
                  ).toFixed(2)} Hours`}</TableCell>
                  <TableCell>
                    {'$ ' +
                      getTotalCostOfSurface(
                        surfaceProductionRatesState,
                        productState,
                        appState,
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        undefined,
                        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surface_id'],
                        actions
                      ).toFixed(2)}
                  </TableCell>
                </TableRow>
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
              return (
                <TableRow key={parentSurfaceId + surfaceId}>
                  <TableCell>
                    {
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['name']
                    }
                  </TableCell>
                  <TableCell>
                    {Object.keys(actions).reduce(
                      (total, actionId, index) =>
                        total +
                        `${index !== 0 ? ', ' : ''}` +
                        actions[actionId]['name'],
                      ''
                    )}
                  </TableCell>
                  <TableCell>
                    {Object.keys(actions).map((actionId) =>
                      Object.keys(
                        actions[actionId]['dimensions']
                      ).map((dimensionId) =>
                        Object.keys(
                          actions[actionId]['dimensions'][dimensionId][
                            'products'
                          ]
                        ).map((productId) => (
                          <ProductContentTyp
                            key={actionId + dimensionId + productId}
                          >
                            {`${
                              actions[actionId]['dimensions'][dimensionId][
                                'products'
                              ][productId]['name']
                            }${
                              actions[actionId]['dimensions'][dimensionId][
                                'products'
                              ][productId]['component']
                                ? ' - ' +
                                  actions[actionId]['dimensions'][dimensionId][
                                    'products'
                                  ][productId]['component']['name']
                                : ''
                            }${
                              actions[actionId]['dimensions'][dimensionId][
                                'products'
                              ][productId]['sheen']
                                ? ' - ' +
                                  actions[actionId]['dimensions'][dimensionId][
                                    'products'
                                  ][productId]['sheen']['name']
                                : ''
                            }${
                              actions[actionId]['dimensions'][dimensionId][
                                'products'
                              ][productId]['has_coats']
                                ? ' - ' +
                                  actions[actionId]['dimensions'][dimensionId][
                                    'products'
                                  ][productId]['has_coats']
                                : ''
                            }`}
                          </ProductContentTyp>
                        ))
                      )
                    )}
                  </TableCell>
                  <TableCell>{`${getTotalHours(
                    parentRoomId,
                    roomId,
                    parentSurfaceId,
                    surfaceId,
                    actions,
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['surface_id'],
                    appState,
                    surfaceProductionRatesState
                  ).toFixed(2)} Hours`}</TableCell>
                  <TableCell>
                    {'$ ' +
                      getTotalCostOfSurface(
                        surfaceProductionRatesState,
                        productState,
                        appState,
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        surfaceId,
                        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surfaces'][surfaceId]['surface_id'],
                        actions
                      ).toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            });
          })}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}
