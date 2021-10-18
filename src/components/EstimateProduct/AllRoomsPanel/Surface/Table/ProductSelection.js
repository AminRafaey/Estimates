import React, { useEffect, useState } from 'react';
import {
  TableCell,
  TableRow,
  Box,
  styled,
  FormControl,
  OutlinedInput,
  withStyles,
  Button,
} from '@material-ui/core';
import AutoComplete from '../../../AutoComplete';
import DeleteIcon from '../../../../../resources/Deleteicon';
import {
  useAppState,
  useAppDispatch,
  updateDimension,
  removeProduct,
} from '../../../../../Context/AppContext';

import { useProductState } from '../../../../../Context/ProductContext';
import { cloneState } from '../../../stateClone';
import { Checkbox } from '../../../../UI';
import { calculateProductCost } from '../../../utility';
import { useSurfaceProductionRatesState } from '../../../../../Context/SurfaceProductionRates';
import { default as RowOrientedColorSelection } from '../../../ColorSelection/RowOrientedSelection';

const IconWrapper = styled(Box)({
  cursor: 'pointer',
});

const StyledTableCell = withStyles({
  root: {
    padding: '12px 12px 12px 16px',
    border: 'none',
  },
})(TableCell);

const StyledTableRow = withStyles({
  root: {
    '& .MuiTableCell-root': {
      padding: '12px 12px 12px 16px',
    },
  },
})(TableRow);
const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);
export default function ProductSelection(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actionId,
    action,
    bulkSelectionArr,
    setBulkSelectionArr,
    dimensionKey,
    surface_id,
    commonProducts,
    AccordionCommonProducts,
    surfaceBulkSelectionArr,
    setSurfaceBulkSelectionArr,
    selectedToggle,
  } = props;

  const productState = useProductState();
  const appDispatch = useAppDispatch();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const appState = useAppState();
  const [products, setProducts] = useState([]);
  const [selectedActionId, setSelectedActionId] = useState(null);

  let productWithCoats = {};
  selectedToggle === 'colors' &&
    products.find((p) => p['has_coats']) &&
    (productWithCoats = surfaceId
      ? {
          ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][products.find((p) => p['has_coats']).id],
          id: products.find((p) => p['has_coats']).id,
        }
      : {
          ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            products.find((p) => p['has_coats']).id
          ],
          id: products.find((p) => p['has_coats']).id,
        });

  useEffect(() => {
    const productAvailableInContext = surfaceId
      ? cloneState(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products']
        )
      : cloneState(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products']
        );
    const productsTemp = [];
    Object.keys(productAvailableInContext).map((prodId) => {
      productsTemp.push({ id: prodId, ...productAvailableInContext[prodId] });
    });
    setProducts(productsTemp.length > 0 ? productsTemp : [{}]);
    setSelectedActionId(actionId);
  }, [actionId, commonProducts, AccordionCommonProducts]);

  const commonProps = {
    bulkSelectionArr,
    setBulkSelectionArr,
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actionId: selectedActionId,
    action,
    dimensionKey,
    products,
    setProducts,
    surfaceBulkSelectionArr,
    setSurfaceBulkSelectionArr,
  };

  const handleCheckboxChange = (e) => {
    e.target.checked
      ? setBulkSelectionArr([
          ...bulkSelectionArr,
          {
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actionId: selectedActionId,
            dimensionKey,
          },
        ])
      : setBulkSelectionArr([
          ...bulkSelectionArr.filter(
            (b) =>
              !(
                b.parentRoomId == parentRoomId &&
                b.roomId == roomId &&
                b.parentSurfaceId == parentSurfaceId &&
                b.surfaceId == surfaceId &&
                b.actionId == selectedActionId &&
                b.dimensionKey == dimensionKey
              )
          ),
        ]);
  };

  const getCheckboxStaus = () => {
    if (
      bulkSelectionArr.find(
        (b) =>
          b.parentRoomId == parentRoomId &&
          b.roomId == roomId &&
          b.parentSurfaceId == parentSurfaceId &&
          b.surfaceId == surfaceId &&
          b.actionId == selectedActionId &&
          b.dimensionKey == dimensionKey
      )
    ) {
      return true;
    }
    return false;
  };

  return (
    <React.Fragment>
      {selectedToggle === 'paint' ? (
        <React.Fragment>
          {products
            .sort((a, b) =>
              commonProducts.length > 0 &&
              Object.entries(a).length > 0 &&
              Object.entries(b).length > 0
                ? a['position'] - b['position']
                : 0
            )
            .map((product, index) => {
              let has_coats = false;

              if (product.id) {
                if (
                  surfaceProductionRatesState[surface_id][
                    'surface_production_rates'
                  ][actionId]['has_coats']
                ) {
                  has_coats =
                    productState[selectedActionId][product.id]['has_coats'];
                }
              } else {
                has_coats = index === 0;
              }

              return (
                <TableRow key={index}>
                  {index === 0 ? (
                    <StyledTableCell align="left">
                      <Box display="flex" alignItems="center">
                        <Checkbox
                          onChange={(e) => handleCheckboxChange(e)}
                          checked={getCheckboxStaus()}
                        />
                        <Box>
                          {appState[parentRoomId]['bedrooms'][roomId]['name']}
                        </Box>
                      </Box>
                    </StyledTableCell>
                  ) : (
                    <StyledTableCell align="left" />
                  )}

                  {index === 0
                    ? Object.keys(
                        surfaceProductionRatesState[surface_id][
                          'surface_fields'
                        ]
                      ).map((fieldKey) => (
                        <StyledTableCell align="left" key={fieldKey}>
                          {
                            action['dimensions'][dimensionKey][
                              surfaceProductionRatesState[surface_id][
                                'surface_fields'
                              ][fieldKey]['name']
                            ]
                          }
                        </StyledTableCell>
                      ))
                    : Object.keys(
                        surfaceProductionRatesState[surface_id][
                          'surface_fields'
                        ]
                      ).map((fieldKey) => (
                        <StyledTableCell align="left" key={fieldKey} />
                      ))}
                  <StyledTableCell align="left">
                    <AutoComplete
                      surface_id={surface_id}
                      options={Object.keys(productState[selectedActionId])
                        .filter((pId) => {
                          if (
                            surfaceProductionRatesState[surface_id][
                              'surface_production_rates'
                            ][actionId]['has_coats']
                          ) {
                            if (
                              products.find(
                                (prod) =>
                                  prod.id &&
                                  productState[selectedActionId][prod.id][
                                    'has_coats'
                                  ]
                              )
                            ) {
                              if (
                                products.find(
                                  (prod) =>
                                    prod.id &&
                                    productState[selectedActionId][prod.id][
                                      'has_coats'
                                    ]
                                ).id == product.id
                              ) {
                                return true;
                              } else if (
                                !productState[selectedActionId][pId][
                                  'has_coats'
                                ]
                              ) {
                                return true;
                              }
                              return false;
                            } else return true;
                          } else return true;
                        })
                        .map((productId) => ({
                          id: productId,
                          name:
                            productState[selectedActionId][productId]['name'],
                        }))
                        .filter((a) =>
                          surfaceProductionRatesState[surface_id][
                            'surface_products_production_rates'
                          ].find(
                            (p) =>
                              p.action_id == selectedActionId &&
                              p.product_id == a.id
                          )
                        )
                        .filter((a) =>
                          products.find(
                            (prod) => prod.id !== product.id && prod.id == a.id
                          )
                            ? false
                            : true
                        )}
                      selected={product.id}
                      type={'product'}
                      index={index}
                      {...commonProps}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <AutoComplete
                      options={
                        product.id
                          ? productState[selectedActionId][product.id][
                              'components'
                            ]
                          : []
                      }
                      selected={
                        product.id
                          ? product['component']
                            ? product['component']['id']
                            : null
                          : undefined
                      }
                      type={'component'}
                      index={index}
                      productId={product.id}
                      {...commonProps}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <AutoComplete
                      options={
                        product.id
                          ? productState[selectedActionId][product.id]['sheens']
                          : []
                      }
                      selected={
                        product.id
                          ? product['sheen']
                            ? product['sheen']['id']
                            : null
                          : undefined
                      }
                      type={'sheen'}
                      index={index}
                      productId={product.id}
                      {...commonProps}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {has_coats && (
                      <FormControl size="small" variant="outlined">
                        <OutlinedInput
                          style={{ background: '#ffff', width: 73 }}
                          type="number"
                          variant="outlined"
                          value={
                            product.id
                              ? action['dimensions'][dimensionKey][
                                  'no_of_coats'
                                ]
                              : ''
                          }
                          onChange={(e) => {
                            if (!product.id) return;

                            updateDimension(appDispatch, {
                              parentRoomId,
                              roomId,
                              parentSurfaceId,
                              surfaceId,
                              newAction: {
                                id: selectedActionId,
                              },
                              dimensionKey: dimensionKey,
                              fieldName: 'no_of_coats',
                              fieldValue:
                                parseInt(e.target.value) !== 0
                                  ? e.target.value
                                  : 1,
                            });
                          }}
                        />
                      </FormControl>
                    )}
                  </StyledTableCell>

                  <StyledTableCell>
                    {product.id &&
                      '$ ' +
                        calculateProductCost(
                          appState,
                          productState,
                          parentRoomId,
                          roomId,
                          parentSurfaceId,
                          surfaceId,
                          surface_id,
                          selectedActionId,
                          surfaceProductionRatesState,
                          product.id,
                          dimensionKey,
                          has_coats,
                          action['dimensions'][dimensionKey]['no_of_coats']
                            ? action['dimensions'][dimensionKey]['no_of_coats']
                            : 0
                        ).toFixed(2)}
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    {(index !== 0 || product.id) && (
                      <IconWrapper
                        onClick={() => {
                          bulkSelectionArr.length > 0 &&
                            setBulkSelectionArr([...bulkSelectionArr]);
                          surfaceBulkSelectionArr.length > 0 &&
                            setSurfaceBulkSelectionArr([
                              ...surfaceBulkSelectionArr,
                            ]);
                          product.id &&
                            removeProduct(appDispatch, {
                              parentRoomId,
                              roomId,
                              parentSurfaceId,
                              surfaceId,
                              actionId: selectedActionId,
                              dimensionKey,
                              newProductId: product.id,
                            });
                          products.length > 1
                            ? setProducts(
                                products.filter((p, i) => i !== index)
                              )
                            : setProducts([{}]);
                        }}
                      >
                        <DeleteIcon />
                      </IconWrapper>
                    )}
                  </StyledTableCell>
                </TableRow>
              );
            })}
          <StyledTableRow>
            <TableCell />
            {Object.keys(
              surfaceProductionRatesState[surface_id]['surface_fields']
            ).map((fieldKey) => (
              <TableCell align="left" key={fieldKey} />
            ))}
            <TableCell>
              <StyledButton
                variant="text"
                color="primary"
                size="small"
                onClick={() => {
                  setProducts([...products, {}]);
                }}
              >
                Add
              </StyledButton>
            </TableCell>
            {[...Array(5)].map((v, i) => (
              <TableCell key={i} />
            ))}
          </StyledTableRow>
        </React.Fragment>
      ) : (
        <RowOrientedColorSelection
          handleCheckboxChange={handleCheckboxChange}
          getCheckboxStaus={getCheckboxStaus}
          productWithCoats={productWithCoats}
          commonProps={commonProps}
          surface_id={surface_id}
          actionNameRequired={false}
        />
      )}
    </React.Fragment>
  );
}
