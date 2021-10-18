import React, { useEffect, useState } from 'react';
import {
  styled,
  Box,
  FormControl,
  OutlinedInput,
  Typography,
} from '@material-ui/core';
import AutoComplete from './AutoComplete';
import {
  useAppDispatch,
  updateDimension,
  useAppState,
} from '../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../Context/ProductContext';
import RoomSelection from './RoomSelection';
import { cloneState } from '../stateClone';
import SurfaceSelection from './SurfaceSelection';
import DimensionSelection from './DimensionSelection';
const AutoCompleteGroupWrapper = styled(Box)({
  paddingBottom: 10,
});
const AutoCompleteGroupInnerWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
});

const FieldNameTyp = styled(Typography)({
  fontSize: 14,
  color: '#ffff',
  paddingBottom: 5,
});
export default function SelectRow(props) {
  const {
    bulkSelectionArr,
    commonProduct,
    commonProducts,
    bulkType,
    surface_id,
    actionId,
  } = props;
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const [estimateProductState, setEstimateProductState] = useState({});
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const commonProps = {
    bulkSelectionArr,
    commonProducts,
    commonProduct,
    bulkType,
  };
  const productState = useProductState();
  useEffect(() => {
    let estimateProduct = {};

    Object.keys(commonProduct['rooms']).map((roomId, roomIndex) => {
      Object.keys(commonProduct['rooms'][roomId]['dimensions']).map(
        (dimensionId, dimensionIndex) => {
          const b = commonProduct['rooms'][roomId]['dimensions'][dimensionId];

          if (roomIndex === 0 && dimensionIndex === 0) {
            estimateProduct = cloneState(productState[b.actionId]);
          }

          const surface_id = b.surfaceId
            ? appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['surfaces'][b.surfaceId]['surface_id']
            : appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['surface_id'];

          Object.keys(estimateProduct).map((prodId) => {
            !commonProducts[prodId] &&
              (surfaceProductionRatesState[surface_id][
                'surface_products_production_rates'
              ].find(
                (p) => p.action_id == b.actionId && p.product_id == prodId
              ) || commonProduct.productId == prodId
                ? ''
                : delete estimateProduct[prodId]);
          });
        }
      );

      const arr1 = Object.keys(estimateProduct);
      const arr2 = Object.keys(estimateProductState);
      (arr2.filter((x) => !arr1.includes(x)).length !== 0 ||
        arr1.filter((x) => !arr2.includes(x)).length !== 0) &&
        setEstimateProductState({ ...estimateProduct });
    });
  }, [commonProducts, bulkSelectionArr]);

  return (
    <React.Fragment>
      {Object.entries(estimateProductState).length > 0 &&
        estimateProductState[commonProduct.productId] && (
          <AutoCompleteGroupWrapper>
            <AutoCompleteGroupInnerWrapper>
              <AutoComplete
                type={'Product'}
                options={Object.keys(estimateProductState)
                  .filter((pId) => {
                    if (
                      commonProduct.productId != pId &&
                      surfaceProductionRatesState[surface_id][
                        'surface_production_rates'
                      ][actionId]['has_coats'] &&
                      estimateProductState[pId]['has_coats']
                    ) {
                      return !Object.keys(commonProduct.rooms).find(
                        (roomId) => {
                          const filtered = Object.keys(commonProducts)
                            .filter((c) => commonProducts[c]['rooms'][roomId])
                            .map((f) => commonProducts[f]);

                          const coatsAssociatedPro = filtered.find(
                            (f) =>
                              estimateProductState[f.productId] &&
                              estimateProductState[f.productId]['has_coats']
                          );
                          if (
                            coatsAssociatedPro &&
                            coatsAssociatedPro.productId !=
                              commonProduct.productId
                          ) {
                            return true;
                          } else if (
                            coatsAssociatedPro &&
                            !estimateProductState[pId]['has_coats']
                          ) {
                            return false;
                          }
                          return false;
                        }
                      );
                    } else return true;
                  })
                  .map((productId) => ({
                    id: productId,
                    name: estimateProductState[productId]['name'],
                  }))}
                selected={commonProduct.productId}
                {...commonProps}
              />
              <AutoComplete
                type={'Component'}
                options={
                  commonProduct
                    ? estimateProductState[commonProduct.productId][
                        'components'
                      ]
                    : []
                }
                selected={
                  commonProduct
                    ? commonProduct.componentId
                      ? commonProduct.componentId
                      : null
                    : undefined
                }
                productId={commonProduct ? commonProduct.productId : undefined}
                {...commonProps}
              />
              <AutoComplete
                type={'Sheen'}
                options={
                  commonProduct
                    ? estimateProductState[commonProduct.productId]['sheens']
                    : []
                }
                selected={
                  commonProduct
                    ? commonProduct.sheenId
                      ? commonProduct.sheenId
                      : null
                    : undefined
                }
                productId={commonProduct ? commonProduct.productId : undefined}
                {...commonProps}
              />
              <Box pr={2} width="10%">
                {commonProduct &&
                  surfaceProductionRatesState[surface_id][
                    'surface_production_rates'
                  ][actionId]['has_coats'] &&
                  estimateProductState[commonProduct.productId][
                    'has_coats'
                  ] && (
                    <React.Fragment>
                      <FieldNameTyp
                        style={{
                          ...((bulkType === 'all-room-accordion' ||
                            bulkType === 'room-specific-accordion') && {
                            color: 'rgba(0,0,0,0.85)',
                          }),
                        }}
                      >
                        Coats
                      </FieldNameTyp>
                      <FormControl size="small" variant="outlined">
                        <OutlinedInput
                          style={{ background: '#ffff' }}
                          variant="outlined"
                          value={commonProduct.no_of_coats}
                          type="number"
                          onChange={(e) => {
                            Object.keys(commonProduct.rooms).map((roomId) => {
                              Object.keys(
                                commonProduct.rooms[roomId]['dimensions']
                              ).map((dim) => {
                                const dimension =
                                  commonProduct.rooms[roomId]['dimensions'][
                                    dim
                                  ];

                                updateDimension(appDispatch, {
                                  parentRoomId: dimension.parentRoomId,
                                  roomId: dimension.roomId,
                                  parentSurfaceId: dimension.parentSurfaceId,
                                  surfaceId: dimension.surfaceId,

                                  newAction: {
                                    id: dimension.actionId,
                                  },
                                  dimensionKey: dimension['dimensionKey'],
                                  fieldName: 'no_of_coats',
                                  fieldValue:
                                    parseInt(e.target.value) !== 0
                                      ? e.target.value
                                      : 1,
                                });
                              });
                            });
                          }}
                        />
                      </FormControl>
                    </React.Fragment>
                  )}
              </Box>
              {bulkType === 'actionBar' && (
                <SurfaceSelection
                  bulkSelectionArr={bulkSelectionArr}
                  selected={commonProduct.rooms}
                  commonProduct={commonProduct}
                  {...commonProps}
                />
              )}

              {bulkType === 'all-room-accordion' && (
                <RoomSelection
                  bulkSelectionArr={bulkSelectionArr}
                  selected={commonProduct.rooms}
                  commonProduct={commonProduct}
                  {...commonProps}
                />
              )}

              {bulkType === 'room-specific-accordion' && (
                <DimensionSelection
                  bulkSelectionArr={bulkSelectionArr}
                  selected={commonProduct.rooms}
                  commonProduct={commonProduct}
                  {...commonProps}
                />
              )}
            </AutoCompleteGroupInnerWrapper>
          </AutoCompleteGroupWrapper>
        )}
    </React.Fragment>
  );
}
