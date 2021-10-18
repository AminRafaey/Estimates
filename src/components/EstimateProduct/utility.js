import { getConvertedSurfaceFormula } from '../EstimateMeasurement/utility';
export const isAnyRoomIsIncluded = (appState) => {
  if (Object.entries(appState).length < 1) {
    return false;
  }
  let count = 0;
  Object.keys(appState).map((parentRoomId) => {
    Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
      if (appState[parentRoomId]['bedrooms'][roomId]['included']) {
        count++;
      }
    });
  });
  if (count > 0) return true;
  return false;
};

export function isRoomHasAnyIncludedSurface(parentRoomId, roomId, appState) {
  if (roomId === -1) return false;
  if (Object.entries(appState).length < 1) {
    return false;
  }
  let count = 0;
  if (appState[parentRoomId]['bedrooms'][roomId]['surfaces']) {
    Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
      (parentSurfaceId) => {
        if (
          Object.entries(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces']
          ).length < 1
        ) {
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['included'] && count++;
          return;
        }
        Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).map((surfaceId) => {
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['included'] && count++;
          return;
        });
      }
    );
  }
  if (count > 0) return true;
  return false;
}

export const getUniqueProducts = (bulkSelectionArr, appState) => {
  let uniqueProducts = [];

  bulkSelectionArr.map((b, index) => {
    if (b.surfaceId) {
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).map((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
              b.dimensionKey
            ]['products'][pId],
          };

          const { components, sheens, ...prod } = { ...product };
          prod['productId'] = pId;
          prod['has_coats'] &&
            (prod['no_of_coats'] =
              appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
                b.dimensionKey
              ]['no_of_coats']);

          if (product.component) {
            prod['componentId'] = product.component.id;
            prod['componentName'] = product.component.name;
          }

          if (product.sheen) {
            prod['sheenId'] = product.sheen.id;
            prod['sheenName'] = product.sheen.name;
          }

          prod.room = {
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            actualDimensions: Object.entries(
              appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions']
            ).length,
          };
          prod.room['dimension'] = {
            dimensionKey: b.dimensionKey,
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            parentSurfaceId: b.parentSurfaceId,
            surfaceId: b.surfaceId,
            actionId: b.actionId,
          };
          uniqueProducts.push(prod);
        });
      }
    } else {
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).map((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products'][
              pId
            ],
          };
          const { components, sheens, ...prod } = { ...product };
          prod['productId'] = pId;
          prod['has_coats'] &&
            (prod['no_of_coats'] =
              appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['actions'][b.actionId]['dimensions'][b.dimensionKey][
                'no_of_coats'
              ]);

          if (product.component) {
            prod['componentId'] = product.component.id;
            prod['componentName'] = product.component.name;
          }

          if (product.sheen) {
            prod['sheenId'] = product.sheen.id;
            prod['sheenName'] = product.sheen.name;
          }

          prod.room = {
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            actualDimensions: Object.entries(
              appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['actions'][b.actionId]['dimensions']
            ).length,
          };
          prod.room['dimension'] = {
            dimensionKey: b.dimensionKey,
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            parentSurfaceId: b.parentSurfaceId,
            surfaceId: b.surfaceId,
            actionId: b.actionId,
          };
          uniqueProducts.push(prod);
        });
      }
    }
  });
  let id = 0;
  const uniqueProductsWithRooms = {};
  uniqueProducts.map((u, i) => {
    const productIndex = uniqueProducts.findIndex(
      (iu) =>
        u.productId == iu.productId &&
        u.componentId == iu.componentId &&
        u.sheenId == iu.sheenId &&
        u.room.parentRoomId == iu.room.parentRoomId &&
        u.room.roomId == iu.room.roomId &&
        u.no_of_coats == iu.no_of_coats
    );
    if (i === productIndex) {
      uniqueProductsWithRooms[
        `${u.room.roomId}_${u.productId}${
          u.componentId ? '_' + u.componentId : ''
        }${u.sheenId ? '_' + u.sheenId : ''}${
          u.no_of_coats ? '_' + u.no_of_coats : ''
        }`
      ] = {
        ...u,
        dimensions: {
          [id]: {
            ...u.room.dimension,
          },
        },
      };
    } else {
      uniqueProductsWithRooms[
        `${u.room.roomId}_${u.productId}${
          u.componentId ? '_' + u.componentId : ''
        }${u.sheenId ? '_' + u.sheenId : ''}${
          u.no_of_coats ? '_' + u.no_of_coats : ''
        }`
      ]['dimensions'][id] = {
        ...u.room.dimension,
      };

      uniqueProducts[productIndex]['timeStamp'] > u.timeStamp &&
        (uniqueProductsWithRooms[
          `${u.room.roomId}_${u.productId}${
            u.componentId ? '_' + u.componentId : ''
          }${u.sheenId ? '_' + u.sheenId : ''}${
            u.no_of_coats ? '_' + u.no_of_coats : ''
          }`
        ]['timeStamp'] = u.timeStamp);
    }
    id += 1;
  });
  const uniqueProductsWithCollectiveRooms = {};

  Object.keys(uniqueProductsWithRooms).map((u) => {
    const key = `${uniqueProductsWithRooms[u].productId}${
      uniqueProductsWithRooms[u].componentId
        ? '_' + uniqueProductsWithRooms[u].componentId
        : ''
    }${
      uniqueProductsWithRooms[u].sheenId
        ? '_' + uniqueProductsWithRooms[u].sheenId
        : ''
    }${
      uniqueProductsWithRooms[u].no_of_coats
        ? '_' + uniqueProductsWithRooms[u].no_of_coats
        : ''
    }`;

    if (uniqueProductsWithCollectiveRooms[key]) {
      uniqueProductsWithCollectiveRooms[key]['rooms'][
        uniqueProductsWithRooms[u]['room']['roomId']
      ] = uniqueProductsWithRooms[u]['room'];
      uniqueProductsWithCollectiveRooms[key]['rooms'][
        uniqueProductsWithRooms[u]['room']['roomId']
      ]['dimensions'] = uniqueProductsWithRooms[u]['dimensions'];
    } else {
      uniqueProductsWithCollectiveRooms[key] = {
        ...uniqueProductsWithRooms[u],
        rooms: {},
      };
      uniqueProductsWithCollectiveRooms[key]['rooms'][
        uniqueProductsWithRooms[u]['room']['roomId']
      ] = { ...uniqueProductsWithRooms[u]['room'], dimensions: {} };
      uniqueProductsWithCollectiveRooms[key]['rooms'][
        uniqueProductsWithRooms[u]['room']['roomId']
      ]['dimensions'] = uniqueProductsWithRooms[u]['dimensions'];
      delete uniqueProductsWithCollectiveRooms[key]['room'];
      delete uniqueProductsWithCollectiveRooms[key]['dimensions'];
      delete uniqueProductsWithCollectiveRooms[key]['rooms'][
        uniqueProductsWithRooms[u]['room']['roomId']
      ]['dimension'];
    }
  });
  return uniqueProductsWithCollectiveRooms;
};

export const getUniqueColors = (bulkSelectionArr, appState) => {
  let uniqueColors = [];

  bulkSelectionArr.map((b, index) => {
    if (b.surfaceId) {
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).map((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
              b.dimensionKey
            ]['products'][pId],
          };

          if (!product['colorManufacturer']) return;

          const { ...colorManufacturer } = { ...product['colorManufacturer'] };

          if (colorManufacturer.color) {
            colorManufacturer.colorId = colorManufacturer.color.id;
          }

          colorManufacturer.room = {
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            actualDimensions: Object.entries(
              appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions']
            ).length,
          };
          colorManufacturer.room['dimension'] = {
            dimensionKey: b.dimensionKey,
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            parentSurfaceId: b.parentSurfaceId,
            surfaceId: b.surfaceId,
            actionId: b.actionId,
          };
          uniqueColors.push(colorManufacturer);
        });
      }
    } else {
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).map((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products'][
              pId
            ],
          };

          if (!product['colorManufacturer']) return;

          const { ...colorManufacturer } = { ...product['colorManufacturer'] };

          if (colorManufacturer.color) {
            colorManufacturer.colorId = colorManufacturer.color.id;
          }

          colorManufacturer.room = {
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            actualDimensions: Object.entries(
              appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
                b.parentSurfaceId
              ]['actions'][b.actionId]['dimensions']
            ).length,
          };
          colorManufacturer.room['dimension'] = {
            dimensionKey: b.dimensionKey,
            parentRoomId: b.parentRoomId,
            roomId: b.roomId,
            parentSurfaceId: b.parentSurfaceId,
            surfaceId: b.surfaceId,
            actionId: b.actionId,
          };
          uniqueColors.push(colorManufacturer);
        });
      }
    }
  });

  let id = 0;
  const uniqueColorsWithRooms = {};
  uniqueColors.map((u, i) => {
    const colorIndex = uniqueColors.findIndex(
      (iu) =>
        u.id == iu.id &&
        u.colorId == iu.colorId &&
        u.room.parentRoomId == iu.room.parentRoomId &&
        u.room.roomId == iu.room.roomId
    );
    if (i === colorIndex) {
      uniqueColorsWithRooms[
        `${u.room.roomId}_${u.id}${u.colorId ? '_' + u.colorId : ''}`
      ] = {
        ...u,
        dimensions: {
          [id]: {
            ...u.room.dimension,
          },
        },
      };
    } else {
      uniqueColorsWithRooms[
        `${u.room.roomId}_${u.id}${u.colorId ? '_' + u.colorId : ''}`
      ]['dimensions'][id] = {
        ...u.room.dimension,
      };
    }
    id += 1;
  });

  const uniqueColorsWithCollectiveRooms = {};

  Object.keys(uniqueColorsWithRooms).map((u) => {
    const key = `${uniqueColorsWithRooms[u].id}${
      uniqueColorsWithRooms[u].colorId
        ? '_' + uniqueColorsWithRooms[u].colorId
        : ''
    }`;

    if (uniqueColorsWithCollectiveRooms[key]) {
      uniqueColorsWithCollectiveRooms[key]['rooms'][
        uniqueColorsWithRooms[u]['room']['roomId']
      ] = uniqueColorsWithRooms[u]['room'];
      uniqueColorsWithCollectiveRooms[key]['rooms'][
        uniqueColorsWithRooms[u]['room']['roomId']
      ]['dimensions'] = uniqueColorsWithRooms[u]['dimensions'];
    } else {
      uniqueColorsWithCollectiveRooms[key] = {
        ...uniqueColorsWithRooms[u],
        rooms: {},
      };
      uniqueColorsWithCollectiveRooms[key]['rooms'][
        uniqueColorsWithRooms[u]['room']['roomId']
      ] = { ...uniqueColorsWithRooms[u]['room'], dimensions: {} };
      uniqueColorsWithCollectiveRooms[key]['rooms'][
        uniqueColorsWithRooms[u]['room']['roomId']
      ]['dimensions'] = uniqueColorsWithRooms[u]['dimensions'];
      delete uniqueColorsWithCollectiveRooms[key]['room'];
      delete uniqueColorsWithCollectiveRooms[key]['dimensions'];
      delete uniqueColorsWithCollectiveRooms[key]['rooms'][
        uniqueColorsWithRooms[u]['room']['roomId']
      ]['dimension'];
    }
  });
  return uniqueColorsWithCollectiveRooms;
};

export const foundHasCoatProductExistence = (
  bulkSelectionArr,
  appState,
  productState
) => {
  let hasCoatProductExistence = false;
  bulkSelectionArr.map((b) => {
    b.surfaceId
      ? Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).map((pId) => {
          productState[b.actionId][pId]['has_coats'] &&
            (hasCoatProductExistence = true);
        })
      : Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).map((pId) => {
          productState[b.actionId][pId]['has_coats'] &&
            (hasCoatProductExistence = true);
        });
  });
  return hasCoatProductExistence;
};

export const handleAllSUrfacesChange = (
  e,
  appState,
  selectedActionId,
  selectedToggle
) => {
  if (!e.target.checked) return [];
  let bulkSelectionArr = [];
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
                  (selectedActionId ? actionId === selectedActionId : true) &&
                    Object.keys(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['actions'][selectedActionId]['dimensions']
                    ).map((dId) => {
                      if (selectedToggle === 'colors') {
                        if (
                          Object.keys(
                            appState[parentRoomId]['bedrooms'][roomId][
                              'surfaces'
                            ][parentSurfaceId]['actions'][selectedActionId][
                              'dimensions'
                            ][dId]['products']
                          ).find(
                            (productId) =>
                              appState[parentRoomId]['bedrooms'][roomId][
                                'surfaces'
                              ][parentSurfaceId]['actions'][selectedActionId][
                                'dimensions'
                              ][dId]['products'][productId]['has_coats']
                          )
                        ) {
                          bulkSelectionArr.push({
                            parentRoomId: parentRoomId,
                            roomId: roomId,
                            parentSurfaceId: parentSurfaceId,
                            surfaceId: null,
                            actionId: actionId,
                            dimensionKey: dId,
                          });
                        }
                      } else {
                        bulkSelectionArr.push({
                          parentRoomId: parentRoomId,
                          roomId: roomId,
                          parentSurfaceId: parentSurfaceId,
                          surfaceId: null,
                          actionId: actionId,
                          dimensionKey: dId,
                        });
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
                  (selectedActionId ? actionId === selectedActionId : true) &&
                    Object.keys(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][selectedActionId][
                        'dimensions'
                      ]
                    ).map((dId) => {
                      if (selectedToggle === 'colors') {
                        if (
                          Object.keys(
                            appState[parentRoomId]['bedrooms'][roomId][
                              'surfaces'
                            ][parentSurfaceId]['surfaces'][surfaceId][
                              'actions'
                            ][selectedActionId]['dimensions'][dId]['products']
                          ).find(
                            (productId) =>
                              appState[parentRoomId]['bedrooms'][roomId][
                                'surfaces'
                              ][parentSurfaceId]['surfaces'][surfaceId][
                                'actions'
                              ][selectedActionId]['dimensions'][dId][
                                'products'
                              ][productId]['has_coats']
                          )
                        ) {
                          bulkSelectionArr.push({
                            parentRoomId: parentRoomId,
                            roomId: roomId,
                            parentSurfaceId: parentSurfaceId,
                            surfaceId: surfaceId,
                            actionId: actionId,
                            dimensionKey: dId,
                          });
                        }
                      } else {
                        bulkSelectionArr.push({
                          parentRoomId: parentRoomId,
                          roomId: roomId,
                          parentSurfaceId: parentSurfaceId,
                          surfaceId: surfaceId,
                          actionId: actionId,
                          dimensionKey: dId,
                        });
                      }
                    });
                });
            }
          });
        }
      );
    });
  });

  return bulkSelectionArr;
};

export const handleRoomAllSurfacesCheckboxChange = (
  e,
  appState,
  parentRoomId,
  roomId,
  actionId,
  selectedToggle
) => {
  if (!e.target.checked) return [];
  let bulkSelectionArr = [];

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
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId] &&
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]['dimensions']
            ).map((dId) => {
              selectedToggle === 'colors'
                ? Object.keys(
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][actionId]['dimensions'][dId]['products']
                  ).find(
                    (productId) =>
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['actions'][actionId]['dimensions'][dId]['products'][
                        productId
                      ]['has_coats']
                  ) &&
                  bulkSelectionArr.push({
                    parentRoomId: parentRoomId,
                    roomId: roomId,
                    parentSurfaceId: parentSurfaceId,
                    surfaceId: null,
                    actionId: actionId,
                    dimensionKey: dId,
                  })
                : bulkSelectionArr.push({
                    parentRoomId: parentRoomId,
                    roomId: roomId,
                    parentSurfaceId: parentSurfaceId,
                    surfaceId: null,
                    actionId: actionId,
                    dimensionKey: dId,
                  });
            });
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
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId] &&
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
            ).map((dId) => {
              selectedToggle === 'colors'
                ? Object.keys(
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                      dId
                    ]['products']
                  ).find(
                    (productId) =>
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][actionId][
                        'dimensions'
                      ][dId]['products'][productId]['has_coats']
                  ) &&
                  bulkSelectionArr.push({
                    parentRoomId: parentRoomId,
                    roomId: roomId,
                    parentSurfaceId: parentSurfaceId,
                    surfaceId: surfaceId,
                    actionId: actionId,
                    dimensionKey: dId,
                  })
                : bulkSelectionArr.push({
                    parentRoomId: parentRoomId,
                    roomId: roomId,
                    parentSurfaceId: parentSurfaceId,
                    surfaceId: surfaceId,
                    actionId: actionId,
                    dimensionKey: dId,
                  });
            });
        }
      });
    }
  );

  return bulkSelectionArr;
};

export const getUniqueSurfaces = (appState) => {
  const uniqueSurfaces = {};
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
              if (uniqueSurfaces[parentSurfaceId]) {
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions']
                ).map((aId) => {
                  if (
                    Object.entries(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['actions'][aId]['dimensions']
                    ).length < 1
                  )
                    return;
                  uniqueSurfaces[parentSurfaceId]['actions'][aId]
                    ? (uniqueSurfaces[parentSurfaceId]['actions'][aId]['room'][
                        roomId
                      ] = {
                        ...appState[parentRoomId]['bedrooms'][roomId],
                        parentRoomId: parentRoomId,
                      })
                    : (uniqueSurfaces[parentSurfaceId]['actions'][aId] = {
                        ...appState[parentRoomId]['bedrooms'][roomId][
                          'surfaces'
                        ][parentSurfaceId]['actions'][aId],
                        room: {
                          [roomId]: {
                            ...appState[parentRoomId]['bedrooms'][roomId],
                            parentRoomId: parentRoomId,
                          },
                        },
                      });
                });
              } else {
                uniqueSurfaces[parentSurfaceId] = {
                  ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ],
                  parent_id: '',
                  actions: {},
                };

                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions']
                ).map((aId) => {
                  if (
                    Object.entries(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['actions'][aId]['dimensions']
                    ).length < 1
                  )
                    return;
                  uniqueSurfaces[parentSurfaceId]['actions'][aId] = {
                    ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][aId],
                    room: {
                      [roomId]: {
                        ...appState[parentRoomId]['bedrooms'][roomId],
                        parentRoomId: parentRoomId,
                      },
                    },
                  };
                });
              }
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
              !uniqueSurfaces[parentSurfaceId] &&
                (uniqueSurfaces[parentSurfaceId] = {
                  ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ],
                  surfaces: {},
                });

              if (uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]) {
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions']
                ).map((aId) => {
                  if (
                    Object.entries(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][aId]['dimensions']
                    ).length < 1
                  )
                    return;
                  uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                    'actions'
                  ][aId]
                    ? (uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                        'actions'
                      ][aId]['room'][roomId] = {
                        ...appState[parentRoomId]['bedrooms'][roomId],
                        parentRoomId: parentRoomId,
                      })
                    : (uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                        'actions'
                      ][aId] = {
                        ...appState[parentRoomId]['bedrooms'][roomId][
                          'surfaces'
                        ][parentSurfaceId]['surfaces'][surfaceId]['actions'][
                          aId
                        ],
                        room: {
                          [roomId]: {
                            ...appState[parentRoomId]['bedrooms'][roomId],
                            parentRoomId: parentRoomId,
                          },
                        },
                      });
                });
              } else {
                uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId] = {
                  ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId],
                  actions: {},
                };

                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions']
                ).map((aId) => {
                  if (
                    Object.entries(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][aId]['dimensions']
                    ).length < 1
                  )
                    return;
                  uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                    'actions'
                  ][aId] = {
                    ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][aId],
                    room: {
                      [roomId]: {
                        ...appState[parentRoomId]['bedrooms'][roomId],
                        parentRoomId: parentRoomId,
                      },
                    },
                  };
                });
              }
            }
          });
        }
      );
    });
  });
  return uniqueSurfaces;
};

export function isAnyRoomHasAnyIncludedSurface(appState) {
  if (Object.entries(appState).length === 0) return false;
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
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['included'] && count++;
            return;
          }
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces']
          ).map((surfaceId) => {
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['included'] && count++;
            return;
          });
        }
      );
    });
  });
  if (count > 0) return true;
  return false;
}

export function getAllActionFromApp(appState) {
  if (Object.entries(appState).length === 0) return [];
  const allActions = [];

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
              Object.keys(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions']
              ).map((actionId) => {
                Object.entries(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][actionId]['dimensions']
                ).length > 0 &&
                  allActions.push({
                    ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][actionId],
                    actionId: actionId,
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
              Object.keys(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions']
              ).map((actionId) => {
                Object.entries(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
                ).length > 0 &&
                  allActions.push({
                    ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][actionId],
                    actionId: actionId,
                  });
              });
            }
          });
        }
      );
    });
  });

  return [
    ...new Map(allActions.map((item) => [item['actionId'], item])).values(),
  ];
}

export function getAllActionAgainstRoom(appState, parentRoomId, roomId) {
  if (Object.entries(appState).length === 0) return [];
  const allActions = [];

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
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions']
          ).map((actionId) => {
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]['dimensions']
            ).length > 0 &&
              allActions.push({
                ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][actionId],
                actionId: actionId,
              });
          });
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
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions']
          ).map((actionId) => {
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
            ).length > 0 &&
              allActions.push({
                ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][actionId],
                actionId: actionId,
              });
          });
        }
      });
    }
  );

  return [
    ...new Map(allActions.map((item) => [item['actionId'], item])).values(),
  ];
}

export const calculateProductCost = (
  appState,
  productState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  surface_id,
  actionId,
  surfaceProductionRatesState,
  productId,
  dimensionKey,
  has_coats,
  coats
) => {
  const surfaceProduct = surfaceProductionRatesState[surface_id][
    'surface_products_production_rates'
  ].find((p) => p.action_id == actionId && p.product_id == productId);
  if (surfaceProduct == undefined) {
    return 0;
  }
  const actions = surfaceId
    ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions']
    : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ];

  const productCost =
    parseFloat(
      (parseFloat(
        eval(
          getConvertedSurfaceFormula(
            actionId,
            dimensionKey,
            surface_id,
            surfaceProductionRatesState
          )
        )
      ) +
        parseFloat(
          actions[actionId]['dimensions'][dimensionKey]['areaAdjustment']
            ? actions[actionId]['dimensions'][dimensionKey]['areaAdjustment']
            : 0
        )) /
        surfaceProduct['pupo']
    ) * productState[actionId][productId]['cost_after_markup'];

  if (!has_coats) return isNaN(productCost) ? 0 : productCost;
  if (!coats) return 0;

  const additionalCoats = coats - 1;

  return isNaN(
    productCost + additionalCoats * surfaceProduct['pupo_factor'] * productCost
  )
    ? 0
    : productCost +
        additionalCoats * surfaceProduct['pupo_factor'] * productCost;
};

export const isAnyActionHasDimensions = (actions) => {
  let status = false;
  Object.keys(actions).map((actionId) => {
    if (Object.entries(actions[actionId]['dimensions']).length > 0)
      status = true;
  });
  return status;
};

export const isSurfaceHasDimensions = (surfaces) => {
  let status = false;
  Object.keys(surfaces).map((surfaceId) => {
    Object.keys(surfaces[surfaceId]['actions']).map((actionId) => {
      if (
        Object.entries(surfaces[surfaceId]['actions'][actionId]['dimensions'])
          .length > 0
      )
        status = true;
    });
  });

  return status;
};

export const IsDimHasAnyCoatsAssociatedProd = (
  actions,
  actionId,
  dimensionId
) => {
  let status = false;
  Object.keys(actions[actionId]['dimensions'][dimensionId]['products']).map(
    (prodId) => {
      actions[actionId]['dimensions'][dimensionId]['products'][prodId][
        'has_coats'
      ] && (status = true);
    }
  );
  return status;
};

export const filterSelectionArrOnBasisOfCoatsAssociatedProd = (
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actionId,
  dimensionId
) => {
  const dimension = surfaceId
    ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions'][actionId]['dimensions'][dimensionId]
    : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ][actionId]['dimensions'][dimensionId];

  let status = false;

  Object.keys(dimension['products']).map((prodId) => {
    dimension['products'][prodId]['has_coats'] && (status = true);
  });

  return status;
};

export const IsActionHasAnyCoatsAssociatedProd = (
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actionId
) => {
  const action = surfaceId
    ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions'][actionId]
    : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ][actionId];

  let status = false;

  Object.keys(action['dimensions']).map((dimensionId) => {
    Object.keys(action['dimensions'][dimensionId]['products']).map((prodId) => {
      action['dimensions'][dimensionId]['products'][prodId]['has_coats'] &&
        (status = true);
    });
  });

  return status;
};

export const getTotalProductCost = (
  surfaceProductionRatesState,
  productState,
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId
) => {
  let totalCost = 0;
  let actions;
  let surface_id;
  surfaceId
    ? (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'])
    : (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ]);

  surfaceId
    ? (surface_id =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['surface_id'])
    : (surface_id =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surface_id'
        ]);

  Object.keys(actions).map((actionId) => {
    Object.keys(actions[actionId]['dimensions']).map((dimensionKey) => {
      Object.keys(
        actions[actionId]['dimensions'][dimensionKey]['products']
      ).map((productId) => {
        totalCost += calculateProductCost(
          appState,
          productState,
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          surface_id,
          actionId,
          surfaceProductionRatesState,
          productId,
          dimensionKey,
          productState[actionId][productId]['product_category_id'] ==
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              actionId
            ]['product_category_id'] &&
            productState[actionId][productId]['has_coats'],
          surfaceId
            ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                dimensionKey
              ]['no_of_coats']
            : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]['dimensions'][dimensionKey]['no_of_coats']
        );
      });
    });
  });
  return isNaN(totalCost) ? 0 : totalCost;
};

export const getProductCost = (
  surfaceProductionRatesState,
  productState,
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actionId
) => {
  let totalCost = 0;
  let actions;
  let surface_id;
  surfaceId
    ? (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'])
    : (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ]);

  surfaceId
    ? (surface_id =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['surface_id'])
    : (surface_id =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surface_id'
        ]);

  Object.keys(actions[actionId]['dimensions']).map((dimensionKey) => {
    Object.keys(actions[actionId]['dimensions'][dimensionKey]['products']).map(
      (productId) => {
        totalCost += calculateProductCost(
          appState,
          productState,
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          surface_id,
          actionId,
          surfaceProductionRatesState,
          productId,
          dimensionKey,
          productState[actionId][productId]['product_category_id'] ==
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              actionId
            ]['product_category_id'] &&
            productState[actionId][productId]['has_coats'],
          surfaceId
            ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
                dimensionKey
              ]['no_of_coats']
            : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][actionId]['dimensions'][dimensionKey]['no_of_coats']
        );
      }
    );
  });
  return isNaN(totalCost) ? 0 : totalCost;
};
export const getCommonColor = (bulkSelectionArr, appState) => {
  let tempCommonColor = {};
  let noNeedToGoFurther = false;
  bulkSelectionArr.map((b, index) => {
    if (noNeedToGoFurther) {
      return;
    }
    if (b.surfaceId) {
      if (index > 0) {
        if (Object.entries(tempCommonColor).length === 0) {
          noNeedToGoFurther = true;
          return;
        }

        !Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).find((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
              b.dimensionKey
            ]['products'][pId],
          };
          if (
            product.has_coats &&
            product.colorManufacturer &&
            product.colorManufacturer.id ===
              tempCommonColor.colorManufacturer.id &&
            (product.colorManufacturer.color === undefined &&
            tempCommonColor.colorManufacturer.color === undefined
              ? true
              : product.colorManufacturer.color &&
                tempCommonColor.colorManufacturer.color &&
                product.colorManufacturer.color.id ===
                  tempCommonColor.colorManufacturer.color.id)
          ) {
            return true;
          }

          return false;
        }) &&
          (noNeedToGoFurther = true) &&
          (tempCommonColor = {});

        return;
      }
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).map((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
              b.dimensionKey
            ]['products'][pId],
          };
          if (product.has_coats) {
            product.colorManufacturer &&
              (tempCommonColor = {
                colorManufacturer: { ...product.colorManufacturer },
              });
          }
        });
      } else {
        noNeedToGoFurther = true;
      }
    } else {
      if (index > 0) {
        if (Object.entries(tempCommonColor).length === 0) {
          noNeedToGoFurther = true;
          return;
        }

        !Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).find((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products'][
              pId
            ],
          };

          if (
            product.has_coats &&
            product.colorManufacturer &&
            product.colorManufacturer.id ===
              tempCommonColor.colorManufacturer.id &&
            (product.colorManufacturer.color === undefined &&
            tempCommonColor.colorManufacturer.color === undefined
              ? true
              : product.colorManufacturer.color &&
                tempCommonColor.colorManufacturer.color &&
                product.colorManufacturer.color.id ===
                  tempCommonColor.colorManufacturer.color.id)
          ) {
            return true;
          }

          return false;
        }) &&
          (noNeedToGoFurther = true) &&
          (tempCommonColor = {});

        return;
      }
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).map((pId) => {
          let product = {
            ...appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products'][
              pId
            ],
          };
          if (product.has_coats) {
            product.colorManufacturer &&
              (tempCommonColor = {
                colorManufacturer: { ...product.colorManufacturer },
              });
          }
        });
      } else {
        noNeedToGoFurther = true;
      }
    }
  });
  return tempCommonColor;
};

export const IsSurfaceHasAnyCoatsAssociatedProd = (
  appState,
  PSId,
  SId,
  AId
) => {
  let status = false;
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
            ).length < 1 &&
            !SId
          ) {
            if (parentSurfaceId == PSId) {
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions']
              ).length > 0 &&
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][AId] &&
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][AId]['dimensions']
                ).map((dimensionId) => {
                  Object.keys(
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][AId]['dimensions'][dimensionId]['products']
                  ).map((prodId) => {
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][AId]['dimensions'][dimensionId]['products'][
                      prodId
                    ]['has_coats'] && (status = true);
                  });
                });
            }
            return;
          } else if (SId) {
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).map((surfaceId) => {
              if (surfaceId == SId) {
                Object.entries(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions']
                ).length > 0 &&
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][AId] &&
                  Object.keys(
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][AId]['dimensions']
                  ).map((dimensionId) => {
                    Object.keys(
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][AId]['dimensions'][
                        dimensionId
                      ]['products']
                    ).map((prodId) => {
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][AId]['dimensions'][
                        dimensionId
                      ]['products'][prodId]['has_coats'] && (status = true);
                    });
                  });
              }
            });
          }
        }
      );
    });
  });

  return status;
};

export const getCommonPaints = (bulkSelectionArr, appState) => {
  let tempCommonPaint = [];
  bulkSelectionArr.map((b, index) => {
    if (b.surfaceId) {
      if (index > 0) {
        tempCommonPaint = tempCommonPaint.filter((t) => {
          return Object.keys(
            appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
              b.dimensionKey
            ]['products']
          ).find((pId) => t.productId == pId);
        });
        return;
      }
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['surfaces'][b.surfaceId]['actions'][b.actionId]['dimensions'][
            b.dimensionKey
          ]['products']
        ).map((pId) => {
          tempCommonPaint.push({
            productId: pId,
          });
        });
      }
    } else {
      if (index > 0) {
        tempCommonPaint = tempCommonPaint.filter((t) => {
          return Object.keys(
            appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
              b.parentSurfaceId
            ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
          ).find((pId) => t.productId == pId);
        });
        return;
      }
      if (
        Object.entries(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).length > 0
      ) {
        Object.keys(
          appState[b.parentRoomId]['bedrooms'][b.roomId]['surfaces'][
            b.parentSurfaceId
          ]['actions'][b.actionId]['dimensions'][b.dimensionKey]['products']
        ).map((pId) => {
          tempCommonPaint.push({
            productId: pId,
          });
        });
      }
    }
  });
  return tempCommonPaint;
};
export const getProductQuantity = (
  appState,
  surfaceProductionRatesState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  surface_id,
  actionId,
  productId,
  dimensionKey,
  has_coats,
  coats
) => {
  const surfaceProduct = surfaceProductionRatesState[surface_id][
    'surface_products_production_rates'
  ].find((p) => p.action_id == actionId && p.product_id == productId);
  if (surfaceProduct == undefined) {
    return 0;
  }
  const actions = surfaceId
    ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions']
    : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ];

  const productCost = parseFloat(
    (parseFloat(
      eval(
        getConvertedSurfaceFormula(
          actionId,
          dimensionKey,
          surface_id,
          surfaceProductionRatesState
        )
      )
    ) +
      parseFloat(
        actions[actionId]['dimensions'][dimensionKey]['areaAdjustment']
          ? actions[actionId]['dimensions'][dimensionKey]['areaAdjustment']
          : 0
      )) /
      surfaceProduct['pupo']
  );

  const defaultNoOfCoats =
    surfaceProductionRatesState[surface_id]['surface_production_rates'][
      actionId
    ]['no_of_coats'];

  if (!has_coats) return isNaN(productCost) ? 0 : productCost;
  if (!coats) return 0;
  if (coats == defaultNoOfCoats) return isNaN(productCost) ? 0 : productCost;

  const additionalCoats = Math.abs(
    (coats - defaultNoOfCoats) / defaultNoOfCoats
  );
  if (coats < defaultNoOfCoats) {
    return isNaN(
      productCost -
        additionalCoats * surfaceProduct['pupo_factor'] * productCost
    )
      ? 0
      : productCost -
          additionalCoats * surfaceProduct['pupo_factor'] * productCost;
  }

  return isNaN(
    productCost + additionalCoats * surfaceProduct['pupo_factor'] * productCost
  )
    ? 0
    : productCost +
        additionalCoats * surfaceProduct['pupo_factor'] * productCost;
};
