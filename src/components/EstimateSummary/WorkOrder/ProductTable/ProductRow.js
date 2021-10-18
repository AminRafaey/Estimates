import React from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import { useAppState } from '../../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { getProductQuantity } from '../../../EstimateProduct/utility';
import { getActionsProductCount, getSurfaceProductCount } from '../../utility';

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
      {Object.keys(actions).map((actionId, actionIndex) =>
        Object.keys(actions[actionId]['dimensions']).map((dimensionId, index) =>
          Object.keys(
            actions[actionId]['dimensions'][dimensionId]['products']
          ).map((productId, productIndex) => {
            const product =
              actions[actionId]['dimensions'][dimensionId]['products'][
                productId
              ];
            const no_of_coats = surfaceId
              ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                  dimensionId
                ]['no_of_coats']
              : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][actionId]['dimensions'][dimensionId][
                  'no_of_coats'
                ];
            return (
              <TableRow
                style={{ background: rowBackground }}
                key={
                  roomId + parentSurfaceId + actionId + dimensionId + productId
                }
              >
                {index + productIndex + actionIndex === 0 && (
                  <TableCell rowSpan={getSurfaceProductCount(actions)}>
                    {surfaceId
                      ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surfaces'][surfaceId]['name']
                      : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['name']}
                  </TableCell>
                )}

                {index + productIndex === 0 && (
                  <TableCell
                    rowSpan={getActionsProductCount(actions[actionId])}
                  >
                    {actions[actionId]['name']}
                  </TableCell>
                )}
                <TableCell>{product.manufacturer}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>
                  {product.component ? product.component.name : ''}
                </TableCell>
                <TableCell>{product.sheen ? product.sheen.name : ''}</TableCell>
                <TableCell>
                  {product.colorManufacturer
                    ? product.colorManufacturer.name
                    : ''}
                </TableCell>
                <TableCell>
                  {product.colorManufacturer && product.colorManufacturer.color
                    ? product.colorManufacturer.color.name
                    : ''}
                </TableCell>
                <TableCell>
                  {product.colorManufacturer && product.colorManufacturer.color
                    ? product.colorManufacturer.color.color_code
                    : ''}
                </TableCell>
                <TableCell>{`${getProductQuantity(
                  appState,
                  surfaceProductionRatesState,
                  parentRoomId,
                  roomId,
                  parentSurfaceId,
                  surfaceId,
                  surfaceId
                    ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['surface_id']
                    : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surface_id'],
                  actionId,
                  productId,
                  dimensionId,
                  product.has_coats,
                  no_of_coats
                )} ${product.unit_symbol}`}</TableCell>
              </TableRow>
            );
          })
        )
      )}
    </>
  );
}
