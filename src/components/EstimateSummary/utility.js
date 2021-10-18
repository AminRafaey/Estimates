import {
  getTotalLaborCost,
  getConvertedSurfaceFormula,
} from '../EstimateMeasurement/utility';
import {
  getTotalProductCost,
  getProductQuantity,
  calculateProductCost,
} from '../EstimateProduct/utility';
export const collectiveLaborCostAgainstSurface = (
  surfaceProductionRatesState,
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actions,
  surface_id,
  hourlyRate
) => {
  let total = 0;
  Object.keys(actions).map((actionId) => {
    Object.keys(actions[actionId]['dimensions']).map((dimensionId) => {
      total =
        total +
        getTotalLaborCost(
          surfaceProductionRatesState,
          appState,
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          actions,
          surface_id,
          actionId,
          dimensionId,
          hourlyRate || window.localStorage.getItem('hourlyRate') || 0
        );
    });
  });
  return isNaN(total) ? 0 : total;
};

export const getTotalCostOfSurface = (
  surfaceProductionRatesState,
  productState,
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  surface_id,
  actions,
  hourlyRate
) => {
  return (
    getTotalProductCost(
      surfaceProductionRatesState,
      productState,
      appState,
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
      hourlyRate
    ) +
    collectiveLaborCostAgainstSurface(
      surfaceProductionRatesState,
      appState,
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
      actions,
      surface_id,
      hourlyRate
    )
  );
};

export const isRoomHasAnyDim = (appState, parentRoomId, roomId) => {
  let count = 0;

  if (
    !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
    !appState[parentRoomId]['bedrooms'][roomId]['included']
  )
    return false;
  Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
    (parentSurfaceId) => {
      if (
        Object.entries(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).length < 1
      ) {
        Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions']
        ).map((actionId) => {
          Object.entries(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['dimensions']
          ).length > 0 && count++;
        });
        return;
      }
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ]
      ).map((surfaceId) => {
        Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions']
        ).map((actionId) => {
          Object.entries(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
          ).length > 0 && count++;
        });
        return;
      });
    }
  );

  if (count > 0) return true;
  else return false;
};

export const isAnySurfaceHasDim = (appState) => {
  let count = 0;
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
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions']
            ).map((actionId) => {
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][actionId]['dimensions']
              ).length > 0 && count++;
            });
            return;
          }
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces']
          ).map((surfaceId) => {
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions']
            ).map((actionId) => {
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
              ).length > 0 && count++;
            });
            return;
          });
        }
      );
    });
  });

  if (count > 0) return true;
  else return false;
};

export const isActionsHasAnyDim = (
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId
) => {
  let count = 0;

  if (surfaceId) {
    Object.keys(
      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions']
    ).map((actionId) => {
      Object.entries(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'][actionId]['dimensions']
      ).length > 0 && count++;
    });
  } else {
    Object.keys(
      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ]
    ).map((actionId) => {
      Object.entries(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ][actionId]['dimensions']
      ).length > 0 && count++;
    });
  }

  if (count > 0) return true;
  else return false;
};

export const getTotalHours = (
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actions,
  surface_id,
  appState,
  surfaceProductionRatesState
) => {
  let total = 0;
  Object.keys(actions).map((actionId) => {
    Object.keys(actions[actionId]['dimensions']).map((dimensionId) => {
      total =
        total +
        (Number.isNaN(
          eval(
            getConvertedSurfaceFormula(
              actionId,
              dimensionId,
              surface_id,
              surfaceProductionRatesState
            )
          ) /
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              actionId
            ]['pulo']
        )
          ? 0
          : eval(
              getConvertedSurfaceFormula(
                actionId,
                dimensionId,
                surface_id,
                surfaceProductionRatesState
              )
            ) /
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              actionId
            ]['pulo']);
    });
  });
  return total;
};

export const getHoursAgainstAction = (
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  action,
  actionId,
  surface_id,
  appState,
  surfaceProductionRatesState
) => {
  let total = 0;

  Object.keys(action['dimensions']).map((dimensionId) => {
    const laborCost = Number.isNaN(
      eval(
        getConvertedSurfaceFormula(
          actionId,
          dimensionId,
          surface_id,
          surfaceProductionRatesState
        )
      ) /
        surfaceProductionRatesState[surface_id]['surface_production_rates'][
          actionId
        ]['pulo']
    )
      ? 0
      : eval(
          getConvertedSurfaceFormula(
            actionId,
            dimensionId,
            surface_id,
            surfaceProductionRatesState
          )
        ) /
        surfaceProductionRatesState[surface_id]['surface_production_rates'][
          actionId
        ]['pulo'];
    const no_of_coats = action['dimensions'][dimensionId]['no_of_coats'];
    const surfaceProductionRate =
      surfaceProductionRatesState[surface_id]['surface_production_rates'][
        actionId
      ];

    if (!no_of_coats) {
      total = total + (isNaN(laborCost) ? 0 : laborCost);
      return;
    }

    const additionalCoats = no_of_coats - 1;

    total =
      total +
      (isNaN(
        laborCost +
          additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost
      )
        ? 0
        : laborCost +
          additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost);
  });

  return total;
};

export const getAllCommonProducts = (
  appState,
  surfaceProductionRatesState,
  productState
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
              ]['included']
            ) {
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions']
              ).length > 0 &&
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions']
                ).map((actionId) => {
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
                        ]['actions'][actionId]['dimensions'][dId][
                          'no_of_coats'
                        ];

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
                      const productCost = calculateProductCost(
                        appState,
                        productState,
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        null,
                        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surface_id'],
                        actionId,
                        surfaceProductionRatesState,
                        productId,
                        dId,
                        product.has_coats,
                        no_of_coats
                      );
                      if (product.has_coats) {
                        const index = commonProducts.findIndex(
                          (c) =>
                            c.id == productId &&
                            (product.component && c.component
                              ? product.component.id == c.component.id
                              : !product.component && !c.component) &&
                            (product.sheen && c.sheen
                              ? product.sheen.id == c.sheen.id
                              : !product.sheen && !c.sheen) &&
                            (product.colorManufacturer && c.colorManufacturer
                              ? product.colorManufacturer.id ==
                                  c.colorManufacturer.id &&
                                (product.colorManufacturer.color &&
                                c.colorManufacturer.color
                                  ? product.colorManufacturer.color.id ==
                                    c.colorManufacturer.color.id
                                  : !product.colorManufacturer.color &&
                                    !c.colorManufacturer.color)
                              : !product.colorManufacturer &&
                                !c.colorManufacturer)
                        );
                        if (index != -1) {
                          commonProducts = commonProducts.map((c, i) =>
                            i == index
                              ? {
                                  ...c,
                                  quantity: c.quantity + productQuantity,
                                  productCost: c.productCost + productCost,
                                }
                              : c
                          );
                        } else {
                          commonProducts.push({
                            ...appState[parentRoomId]['bedrooms'][roomId][
                              'surfaces'
                            ][parentSurfaceId]['actions'][actionId][
                              'dimensions'
                            ][dId]['products'][productId],
                            quantity: productQuantity,
                            no_of_coats: no_of_coats,
                            productCost: productCost,
                          });
                        }
                      } else {
                        const index = commonProducts.findIndex(
                          (c) =>
                            c.id == productId &&
                            (product.component && c.component
                              ? product.component.id == c.component.id
                              : !product.component && !c.component) &&
                            (product.sheen && c.sheen
                              ? product.sheen.id == c.sheen.id
                              : !product.sheen && !c.sheen) &&
                            (product.colorManufacturer && c.colorManufacturer
                              ? product.colorManufacturer.id ==
                                  c.colorManufacturer.id &&
                                (product.colorManufacturer.color &&
                                c.colorManufacturer.color
                                  ? product.colorManufacturer.color.id ==
                                    c.colorManufacturer.color.id
                                  : !product.colorManufacturer.color &&
                                    !c.colorManufacturer.color)
                              : !product.colorManufacturer &&
                                !c.colorManufacturer)
                        );
                        if (index != -1) {
                          commonProducts = commonProducts.map((c, i) =>
                            i == index
                              ? {
                                  ...c,
                                  quantity: c.quantity + productQuantity,
                                  productCost: c.productCost + productCost,
                                }
                              : c
                          );
                        } else {
                          commonProducts.push({
                            ...appState[parentRoomId]['bedrooms'][roomId][
                              'surfaces'
                            ][parentSurfaceId]['actions'][actionId][
                              'dimensions'
                            ][dId]['products'][productId],
                            quantity: productQuantity,
                            no_of_coats: no_of_coats,
                            productCost,
                          });
                        }
                      }
                    });
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
              ]['surfaces'][surfaceId]['included']
            ) {
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions']
              ).length > 0 &&
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions']
                ).map((actionId) => {
                  Object.keys(
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
                  ).map((dId) => {
                    Object.keys(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][actionId][
                        'dimensions'
                      ][dId]['products']
                    ).map((productId) => {
                      const no_of_coats =
                        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surfaces'][surfaceId]['actions'][actionId][
                          'dimensions'
                        ][dId]['no_of_coats'];

                      const product =
                        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surfaces'][surfaceId]['actions'][actionId][
                          'dimensions'
                        ][dId]['products'][productId];

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
                      const productCost = calculateProductCost(
                        appState,
                        productState,
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        surfaceId,
                        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surfaces'][surfaceId]['surface_id'],
                        actionId,
                        surfaceProductionRatesState,
                        productId,
                        dId,
                        product.has_coats,
                        no_of_coats
                      );
                      if (product.has_coats) {
                        const index = commonProducts.findIndex(
                          (c) =>
                            c.id == productId &&
                            (product.component && c.component
                              ? product.component.id == c.component.id
                              : !product.component && !c.component) &&
                            (product.sheen && c.sheen
                              ? product.sheen.id == c.sheen.id
                              : !product.sheen && !c.sheen) &&
                            (product.colorManufacturer && c.colorManufacturer
                              ? product.colorManufacturer.id ==
                                  c.colorManufacturer.id &&
                                (product.colorManufacturer.color &&
                                c.colorManufacturer.color
                                  ? product.colorManufacturer.color.id ==
                                    c.colorManufacturer.color.id
                                  : !product.colorManufacturer.color &&
                                    !c.colorManufacturer.color)
                              : !product.colorManufacturer &&
                                !c.colorManufacturer)
                        );
                        if (index != -1) {
                          commonProducts = commonProducts.map((c, i) =>
                            i == index
                              ? {
                                  ...c,
                                  quantity: c.quantity + productQuantity,
                                  productCost: c.productCost + productCost,
                                }
                              : c
                          );
                        } else {
                          commonProducts.push({
                            ...appState[parentRoomId]['bedrooms'][roomId][
                              'surfaces'
                            ][parentSurfaceId]['surfaces'][surfaceId][
                              'actions'
                            ][actionId]['dimensions'][dId]['products'][
                              productId
                            ],
                            quantity: productQuantity,
                            no_of_coats: no_of_coats,
                            productCost,
                          });
                        }
                      } else {
                        const index = commonProducts.findIndex(
                          (c) =>
                            c.id == productId &&
                            (product.component && c.component
                              ? product.component.id == c.component.id
                              : !product.component && !c.component) &&
                            (product.sheen && c.sheen
                              ? product.sheen.id == c.sheen.id
                              : !product.sheen && !c.sheen) &&
                            (product.colorManufacturer && c.colorManufacturer
                              ? product.colorManufacturer.id ==
                                  c.colorManufacturer.id &&
                                (product.colorManufacturer.color &&
                                c.colorManufacturer.color
                                  ? product.colorManufacturer.color.id ==
                                    c.colorManufacturer.color.id
                                  : !product.colorManufacturer.color &&
                                    !c.colorManufacturer.color)
                              : !product.colorManufacturer &&
                                !c.colorManufacturer)
                        );
                        if (index != -1) {
                          commonProducts = commonProducts.map((c, i) =>
                            i == index
                              ? {
                                  ...c,
                                  quantity: c.quantity + productQuantity,
                                  productCost: c.productCost + productCost,
                                }
                              : c
                          );
                        } else {
                          commonProducts.push({
                            ...appState[parentRoomId]['bedrooms'][roomId][
                              'surfaces'
                            ][parentSurfaceId]['surfaces'][surfaceId][
                              'actions'
                            ][actionId]['dimensions'][dId]['products'][
                              productId
                            ],
                            quantity: productQuantity,
                            no_of_coats: no_of_coats,
                            productCost,
                          });
                        }
                      }
                    });
                  });
                });
            }
          });
        }
      );
    });
  });

  const categorizedProducts = {};
  commonProducts.map((c) => {
    categorizedProducts[c.product_category_id]
      ? (categorizedProducts[c.product_category_id] = [
          ...categorizedProducts[c.product_category_id],
          c,
        ])
      : (categorizedProducts[c.product_category_id] = [c]);
  });
  return categorizedProducts;
};

export const getActionsProductCount = (action) => {
  let count = 0;

  Object.keys(action['dimensions']).map((dimensionId) => {
    count += Object.entries(action['dimensions'][dimensionId]['products'])
      .length;
  });
  return count;
};

export const getSurfaceProductCount = (actions) => {
  let count = 0;
  Object.keys(actions).map((actionId) => {
    Object.keys(actions[actionId]['dimensions']).map((dimensionId) => {
      count += Object.entries(
        actions[actionId]['dimensions'][dimensionId]['products']
      ).length;
    });
  });
  return count;
};

export const calculateRoomCost = (
  appState,
  productState,
  surfaceProductionRatesState,
  parentRoomId,
  roomId
) => {
  let total = 0;

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
          ]['included']
        ) {
          total += getTotalCostOfSurface(
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
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions']
          );
        }
        return;
      }
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ]
      ).map((surfaceId) => {
        if (
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['included']
        ) {
          total += getTotalCostOfSurface(
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
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions']
          );
        }
      });
    }
  );
  return isNaN(total) ? 0 : total;
};

export const getRoomTotalHours = (
  appState,
  surfaceProductionRatesState,
  parentRoomId,
  roomId
) => {
  let total = 0;

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
          ]['included']
        ) {
          total += getTotalHours(
            parentRoomId,
            roomId,
            parentSurfaceId,
            undefined,
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'],
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surface_id'],
            appState,
            surfaceProductionRatesState
          );
        }
        return;
      }
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ]
      ).map((surfaceId) => {
        if (
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['included']
        ) {
          total += getTotalHours(
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'],
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['surface_id'],
            appState,
            surfaceProductionRatesState
          );
        }
      });
    }
  );
  return isNaN(total) ? 0 : total;
};
