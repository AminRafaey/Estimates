import React from 'react';
import { Box, styled } from '@material-ui/core';
import {
  getTotalCostOfSurface,
  isActionsHasAnyDim,
  getTotalHours,
  getHoursAgainstAction,
} from '../../EstimateSummary/utility';

import { getProductQuantity } from '../../EstimateProduct/utility';

const ColorPallete = styled(Box)({
  height: 14,
  width: 14,
  marginRight: 6,
});

export default function statsApi(endpoint, payload) {
  const {
    parentRoomId,
    roomId,
    appState,
    surfaceProductionRatesState,
    productState,
    actionId,
  } = payload;
  switch (endpoint) {
    case 'Hours and cost by room':
      return getHoursAndCostByRoom(
        parentRoomId,
        roomId,
        appState,
        surfaceProductionRatesState,
        productState
      );
    case 'Products by action':
      return getProductsByAction(
        actionId,
        appState,
        surfaceProductionRatesState
      );
    case 'Products by room':
      return getProductsByRoom(
        parentRoomId,
        roomId,
        appState,
        surfaceProductionRatesState,
        productState
      );
    case 'Hours by Surface':
      return getHoursForSurface(
        parentRoomId,
        roomId,
        appState,
        surfaceProductionRatesState,
        productState
      );

    default:
      return [];
  }
}

const getUniqueProductsFromAction = (actions) => {
  return {
    type: 'array',
    value: Object.keys(actions)
      .map((actionId) =>
        Object.keys(actions[actionId]['dimensions'])
          .map((dimensionId) =>
            Object.keys(
              actions[actionId]['dimensions'][dimensionId]['products']
            ).map(
              (productId) =>
                `${
                  actions[actionId]['dimensions'][dimensionId]['products'][
                    productId
                  ]['name']
                }${
                  actions[actionId]['dimensions'][dimensionId]['products'][
                    productId
                  ]['component']
                    ? ' - ' +
                      actions[actionId]['dimensions'][dimensionId]['products'][
                        productId
                      ]['component']['name']
                    : ''
                }${
                  actions[actionId]['dimensions'][dimensionId]['products'][
                    productId
                  ]['sheen']
                    ? ' - ' +
                      actions[actionId]['dimensions'][dimensionId]['products'][
                        productId
                      ]['sheen']['name']
                    : ''
                }${
                  actions[actionId]['dimensions'][dimensionId]['products'][
                    productId
                  ]['has_coats']
                    ? ' - ' +
                      actions[actionId]['dimensions'][dimensionId]['products'][
                        productId
                      ]['has_coats']
                    : ''
                }`
            )
          )
          .flat()
      )
      .flat()
      .filter(function (c) {
        return this.has(c) ? false : this.add(c);
      }, new Set()),
  };
};

const getActionsNames = (actions) => {
  return {
    type: 'array',
    value: Object.keys(actions).map((actionId) => actions[actionId]['name']),
  };
};

const getHoursAndCostByRoom = (
  parentRoomId,
  roomId,
  appState,
  surfaceProductionRatesState,
  productState
) => {
  const arr = [];
  Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
    (parentSurfaceId) => {
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

        arr.push({
          surface: {
            value:
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['name'],
          },
          actions: getActionsNames(actions),
          products: getUniqueProductsFromAction(actions),
          time: {
            value: `${getTotalHours(
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
            ).toFixed(2)} Hours`,
          },
          cost: {
            value:
              '$ ' +
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
              ).toFixed(2),
          },
        });
      } else {
        Object.keys(
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

          arr.push({
            surface: {
              value:
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['name'],
            },
            actions: getActionsNames(actions),
            products: getUniqueProductsFromAction(actions),
            time: {
              value: `${getTotalHours(
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
              ).toFixed(2)} Hours`,
            },
            cost: {
              value:
                '$ ' +
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
                ).toFixed(2),
            },
          });
        });
      }
    }
  );
  return arr;
};

const generateProductHash = (product, productQuantity) => {
  return {
    ...product,
    productName: {
      value: product['name'],
    },
    componentName: {
      value: product['component']?.['name'],
    },
    sheenName: {
      value: product['sheen']?.['name'],
    },
    colorManufacturerName: {
      value: product['colorManufacturer']?.name,
    },
    colorCode: {
      value: product['colorManufacturer']?.color?.color_code,
      ...(product['colorManufacturer']?.color?.hex_code && {
        beginWith: (
          <ColorPallete
            style={{ background: product.colorManufacturer.color.hex_code }}
          />
        ),
      }),
    },
    colorName: {
      value: product['colorManufacturer']?.color?.name,
    },
    quantity: {
      value: productQuantity,

      end: ' ' + product.unit_symbol,
    },
  };
};

const productExistenceComparison = (product, productId, commonProducts) => {
  return commonProducts.findIndex(
    (c) =>
      c.id == productId &&
      (product.component && c.component
        ? product.component.id == c.component.id
        : !product.component && !c.component) &&
      (product.sheen && c.sheen
        ? product.sheen.id == c.sheen.id
        : !product.sheen && !c.sheen) &&
      (product.colorManufacturer && c.colorManufacturer
        ? product.colorManufacturer.id == c.colorManufacturer.id &&
          (product.colorManufacturer.color && c.colorManufacturer.color
            ? product.colorManufacturer.color.id == c.colorManufacturer.color.id
            : !product.colorManufacturer.color && !c.colorManufacturer.color)
        : !product.colorManufacturer && !c.colorManufacturer)
  );
};
const getProductsByAction = (
  actionId,
  appState,
  surfaceProductionRatesState
) => {
  let commonProducts = [];
  Object.keys(appState).map((parentRoomId) => {
    Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
      if (
        !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
        !appState[parentRoomId]['bedrooms'][roomId]['included']
      )
        return;
      Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
        (parentSurfaceId) => {
          if (
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).length < 1
          ) {
            if (
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]
            ) {
              Object.keys(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][actionId]['dimensions']
              ).map((dId) => {
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][actionId]['dimensions'][dId]['products']
                ).map((productId) => {
                  const no_of_coats =
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][actionId]['dimensions'][dId]['no_of_coats'];

                  const product =
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][actionId]['dimensions'][dId]['products'][
                      productId
                    ];

                  const productQuantity = getProductQuantity(
                    appState,
                    surfaceProductionRatesState,
                    parentRoomId,
                    roomId,
                    parentSurfaceId,
                    null,
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surface_id'],
                    actionId,
                    productId,
                    dId,
                    product.has_coats,
                    no_of_coats
                  );

                  const index = productExistenceComparison(
                    product,
                    productId,
                    commonProducts
                  );

                  if (index != -1) {
                    commonProducts = commonProducts.map((c, i) =>
                      i == index
                        ? {
                            ...c,
                            quantity: {
                              ...c.quantity,
                              value: (
                                parseFloat(c.quantity.value) + productQuantity
                              ).toFixed(2),
                            },
                          }
                        : c
                    );
                  } else {
                    commonProducts.push(
                      generateProductHash(product, productQuantity)
                    );
                  }
                });
              });
            }
            return;
          }
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces']
          ).map((surfaceId) => {
            if (
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][actionId]
            ) {
              Object.keys(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
              ).map((dId) => {
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                    dId
                  ]['products']
                ).map((productId) => {
                  const no_of_coats =
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                      dId
                    ]['no_of_coats'];

                  const product =
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                      dId
                    ]['products'][productId];

                  const productQuantity = getProductQuantity(
                    appState,
                    surfaceProductionRatesState,
                    parentRoomId,
                    roomId,
                    parentSurfaceId,
                    surfaceId,
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['surface_id'],
                    actionId,
                    productId,
                    dId,
                    product.has_coats,
                    no_of_coats
                  );

                  const index = productExistenceComparison(
                    product,
                    productId,
                    commonProducts
                  );

                  if (index != -1) {
                    commonProducts = commonProducts.map((c, i) =>
                      i == index
                        ? {
                            ...c,
                            quantity: {
                              ...c.quantity,
                              value: (
                                parseFloat(c.quantity.value) + productQuantity
                              ).toFixed(2),
                            },
                          }
                        : c
                    );
                  } else {
                    commonProducts.push(
                      commonProducts.push(
                        generateProductHash(product, productQuantity)
                      )
                    );
                  }
                });
              });
            }
          });
        }
      );
    });
  });
  return commonProducts;
};

const getProductRow = (
  products,
  appState,
  surfaceProductionRatesState,
  productState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actions
) => {
  Object.keys(actions).map((actionId, actionIndex) =>
    Object.keys(actions[actionId]['dimensions']).map((dimensionId, index) =>
      Object.keys(actions[actionId]['dimensions'][dimensionId]['products']).map(
        (productId, productIndex) => {
          const product =
            actions[actionId]['dimensions'][dimensionId]['products'][productId];
          const no_of_coats = surfaceId
            ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                dimensionId
              ]['no_of_coats']
            : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]['dimensions'][dimensionId]['no_of_coats'];

          const hash = {};
          index + productIndex + actionIndex === 0 &&
            (hash.surfaceName = {
              value: surfaceId
                ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['name']
                : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['name'],
            });

          index + productIndex === 0 &&
            (hash.actionName = {
              value: actions[actionId]['name'],
            });
          hash.manufacturerName = {
            value: product.manufacturer,
          };
          hash.productName = { value: product.name, type: 'string' };
          hash.componentName = {
            value: product.component ? product.component.name : '',
          };
          hash.sheenName = {
            value: product.sheen ? product.sheen.name : '',
          };
          hash.colorManufacturerName = {
            value: product.colorManufacturer
              ? product.colorManufacturer.name
              : '',
          };

          product.colorManufacturer && product.colorManufacturer.color
            ? (hash.colorName = {
                value: product.colorManufacturer.color.name,
              })
            : '';

          product.colorManufacturer && product.colorManufacturer.color
            ? (hash.colorCode = {
                value: product.colorManufacturer.color.color_code,
              })
            : '';
          hash.quantity = {
            value: `${getProductQuantity(
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
            ).toFixed(2)} ${product.unit_symbol}`,
          };
          products.push(hash);
        }
      )
    )
  );
};

const getProductsByRoom = (
  parentRoomId,
  roomId,
  appState,
  surfaceProductionRatesState,
  productState
) => {
  const products = [];
  Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
    (parentSurfaceId) => {
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

        getProductRow(
          products,
          appState,
          surfaceProductionRatesState,
          productState,
          parentRoomId,
          roomId,
          parentSurfaceId,
          undefined,
          actions
        );
      } else {
        Object.keys(
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

          getProductRow(
            products,
            appState,
            surfaceProductionRatesState,
            productState,
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actions
          );
        });
      }
    }
  );
  return products;
};

const getActionHoursRow = (
  appState,
  surfaceProductionRatesState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actions,
  arr
) => {
  Object.keys(actions).map((actionId, index) => {
    const stat = {};
    index === 0 &&
      (stat.surfaceName = {
        value: surfaceId
          ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['name']
          : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['name'],
      });
    stat.actionName = { value: actions[actionId]['name'], type: 'string' };

    stat.hours = {
      value: `${getHoursAgainstAction(
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
      ).toFixed(2)}`,
    };
    arr.push(stat);
  });
};
const getHoursForSurface = (
  parentRoomId,
  roomId,
  appState,
  surfaceProductionRatesState,
  productState
) => {
  const arr = [];
  Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
    (parentSurfaceId) => {
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

        getActionHoursRow(
          appState,
          surfaceProductionRatesState,
          parentRoomId,
          roomId,
          parentSurfaceId,
          undefined,
          actions,
          arr
        );
      } else {
        Object.keys(
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

          getActionHoursRow(
            appState,
            surfaceProductionRatesState,
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actions,
            arr
          );
        });
      }
    }
  );
  return arr;
};
