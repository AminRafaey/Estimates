import React from 'react';
import { cloneState } from '../components/EstimateProduct/stateClone';

const AppStateContext = React.createContext(null);
const AppDispatchContext = React.createContext(null);

function AppReducer(state, action) {
  const stateClone = cloneState(state);
  const {
    parentSurface,
    hierarchy,
    newSurfaceId,
    newSurface,
    parentRoomId,
    roomId,
    allAncesstorIds,
    defaultActions,
  } = action.payload;
  const { parentSurfaceId, surfaceId, newAction } = action.payload;
  const {
    actionId,
    newProductId,
    newProduct,
    nonRemovableActions,
  } = action.payload;
  const { roomName } = action.payload;
  const { fieldName, fieldValue, dimension, dimensionKey } = action.payload;
  const { prodFeatureId, prodFeatureName, prodFeatureVal } = action.payload;
  const { roomsState, productId } = action.payload;
  const { surfaceProductionRatesState, products } = action.payload;
  const { surfaceName, no_of_coats } = action.payload;
  const { surfaceIds, surfaceDefaultActions } = action.payload;

  switch (action.type) {
    case 'UPDATE_APP':
      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces']
        ? stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurface.id
          ]
          ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurface.id
            ]['surfaces'][newSurfaceId] = {
              ...(stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurface.id
              ]['surfaces'][newSurfaceId]
                ? {
                    ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurface.id
                    ]['surfaces'][newSurfaceId],
                  }
                : { actions: defaultActions }),
              ...newSurface,
            })
          : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurface.id
            ] = {
              name: parentSurface.name,
              actual_name: parentSurface.name,
              hierarchy: hierarchy,
              numOfChildren: parentSurface.numOfChildren,
              ...(parentSurface.parent_id && {
                parent_id: parentSurface.parent_id,
              }),
              surfaces: {
                [newSurfaceId]: { ...newSurface, actions: defaultActions },
              },
            })
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'] = {
            [parentSurface.id]: {
              hierarchy: hierarchy,
              name: parentSurface.name,
              actual_name: parentSurface.name,
              numOfChildren: parentSurface.numOfChildren,
              ...(parentSurface.parent_id && {
                parent_id: parentSurface.parent_id,
              }),
              surfaces: {
                [newSurfaceId]: { ...newSurface, actions: defaultActions },
              },
            },
          });

      allAncesstorIds.map((key) => {
        if (!stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key])
          return;

        const childrens = cloneState(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key][
            'surfaces'
          ]
        );

        Object.keys(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces']
        ).map((surfaceId) => {
          if (
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][surfaceId][
              'parent_id'
            ] == key
          ) {
            childrens[surfaceId] = {
              ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                surfaceId
              ],
            };
          }
        });
        let parentSurfaceRef =
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key];
        const includedOnes = Object.keys(childrens).filter(
          (s) => childrens[s]['included']
        ).length;
        const excludedOnes = Object.keys(childrens).filter(
          (s) => childrens[s]['excluded']
        ).length;
        const includedIntermediateOnes = Object.keys(childrens).filter(
          (s) => childrens[s]['includedIntermediate']
        ).length;
        const excludedIntermediateOnes = Object.keys(childrens).filter(
          (s) => childrens[s]['excludedIntermediate']
        ).length;
        if (includedOnes === 0 && includedIntermediateOnes === 0) {
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key] = {
            ...parentSurfaceRef,
            ['included']: false,
            ['includedIntermediate']: false,
          };
        } else if (includedOnes === parentSurfaceRef['numOfChildren']) {
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key] = {
            ...parentSurfaceRef,
            ['included']: true,
            ['includedIntermediate']: false,
          };
        } else {
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key] = {
            ...parentSurfaceRef,
            ['included']: false,
            ['includedIntermediate']: true,
          };
        }

        parentSurfaceRef =
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key];
        if (excludedOnes === 0 && excludedIntermediateOnes === 0) {
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key] = {
            ...parentSurfaceRef,

            ['excluded']: false,
            ['excludedIntermediate']: false,
          };
        } else if (excludedOnes === parentSurfaceRef['numOfChildren']) {
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key] = {
            ...parentSurfaceRef,
            ['excluded']: true,
            ['excludedIntermediate']: false,
          };
        } else {
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][key] = {
            ...parentSurfaceRef,
            ['excluded']: false,
            ['excludedIntermediate']: true,
          };
        }
      });
      return {
        ...stateClone,
      };
    case 'PARENT_LESS_NODE':
      const newParentSurface = {
        ...(stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'] &&
        stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
          parentSurface.id
        ]
          ? {
              ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurface.id
              ],
            }
          : { actions: defaultActions }),

        hierarchy: '',
        name: parentSurface.name,
        included: parentSurface.included,
        excluded: parentSurface.excluded,
        selected: parentSurface.selected,
        surface_id: parentSurface.surface_id,
        actual_name: parentSurface.name,
        surfaces: {},
      };

      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces']
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurface.id
          ] = newParentSurface)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'] = {
            [parentSurface.id]: newParentSurface,
          });

      return {
        ...stateClone,
      };

    case 'ADD_DEFAULT_ACTIONS_AGAINST_SURFACES':
      Object.keys(stateClone).map((parentRoomId) => {
        Object.keys(stateClone[parentRoomId]['bedrooms']).map((roomId) => {
          if (
            !stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
            !stateClone[parentRoomId]['bedrooms'][roomId]['included']
          )
            return;

          Object.keys(
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces']
          ).map((parentSurfaceId) => {
            if (
              Object.entries(
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).length < 1
            ) {
              if (
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['included']
              ) {
                surfaceIds.find(
                  (id) =>
                    id ==
                    stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surface_id']
                ) &&
                  (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'] =
                    surfaceDefaultActions[
                      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surface_id']
                    ]);
              }
            }
            Object.keys(
              stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).map((surfaceId) => {
              if (
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['included']
              ) {
                surfaceIds.find(
                  (id) =>
                    id ==
                    stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['surface_id']
                ) &&
                  (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'] =
                    surfaceDefaultActions[
                      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['surface_id']
                    ]);
              }
            });
          });
        });
      });

      return {
        ...stateClone,
      };
    case 'ADD_ACTION':
      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions'][newAction.id]
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id]['selected'] = true)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id] = {
            name: newAction.name,
            selected: true,
            ...(newAction.no_of_coats && {
              no_of_coats: newAction.no_of_coats,
            }),
            dimensions: {},
          });
      return {
        ...stateClone,
      };
    case 'ADD_ACTION_AND_REMOVE_ALL_OTHER':
      surfaceId
        ? newAction.id &&
          (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id] = {
            dimensions: {},
            ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][newAction.id],
            name: newAction.name,
            ...(newAction.no_of_coats && {
              no_of_coats: newAction.no_of_coats,
            }),
            selected: true,
          })
        : newAction.id &&
          (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id] = {
            dimensions: {},
            ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][newAction.id],
            name: newAction.name,
            ...(newAction.no_of_coats && {
              no_of_coats: newAction.no_of_coats,
            }),
            selected: true,
          });
      if (surfaceId) {
        Object.keys(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions']
        ).map((actionId) => {
          actionId !== newAction.id &&
            !nonRemovableActions.find((id) => actionId == id) &&
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId] &&
            (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['selected'] = false);
        });
      } else {
        Object.keys(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions']
        ).map((actionId) => {
          actionId !== newAction.id &&
            !nonRemovableActions.find((id) => actionId == id) &&
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId] &&
            (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['selected'] = false);
        });
      }

      return {
        ...stateClone,
      };
    case 'REMOVE_ACTION':
      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions'][newAction.id]['selected'] = false;
      return {
        ...stateClone,
      };
    case 'ADD_ACTION_OF_PARENTLESS_NODE':
      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ][newAction.id]
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id]['selected'] = true)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id] = {
            name: newAction.name,
            selected: true,
            ...(newAction.no_of_coats && {
              no_of_coats: newAction.no_of_coats,
            }),
            dimensions: {},
          });
      return {
        ...stateClone,
      };
    case 'REMOVE_ACTION_OF_PARENTLESS_NODE':
      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ][newAction.id]['selected'] = false;
      return {
        ...stateClone,
      };
    case 'UPDATE_COATS_AGAINST_ACTION':
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId][
            'no_of_coats'
          ] = no_of_coats)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['no_of_coats'] = no_of_coats);

      return {
        ...stateClone,
      };
    case 'ADD_DIMENSIONS': {
      const dimensions = surfaceId
        ? stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id]['dimensions']
        : stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id]['dimensions'];

      const uniqueId =
        Object.entries(dimensions).length > 0
          ? Math.max(...Object.keys(dimensions)) + 1
          : 0;

      if (surfaceId) {
        stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
          parentSurfaceId
        ]['surfaces'][surfaceId]['actions'][newAction.id]['dimensions'][
          uniqueId
        ] = { ...dimension };

        const productionRate = surfaceProductionRatesState[
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['surface_id']
        ]['surface_products_production_rates'].find(
          (pr) => pr.action_id == newAction.id && pr.default_product
        );

        if (productionRate) {
          const defaultProdId = productionRate['product_id'];
          const defaultProd = cloneState(products[newAction.id][defaultProdId]);
          const { components, sheens, ...rest } = defaultProd;
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id]['dimensions'][
            uniqueId
          ]['products'][defaultProdId] = {
            ...rest,
            ...(productionRate['default_component'] && {
              component: components.find(
                (c) => c.id == productionRate['default_component']
              ),
            }),
            ...(productionRate['default_sheen'] && {
              sheen: sheens.find(
                (c) => c.id == productionRate['default_sheen']
              ),
            }),
            timeStamp: Date.now(),
          };
        }
      } else {
        stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
          parentSurfaceId
        ]['actions'][newAction.id]['dimensions'][uniqueId] = {
          ...dimension,
        };

        const productionRate = surfaceProductionRatesState[
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surface_id']
        ]['surface_products_production_rates'].find(
          (pr) => pr.action_id == newAction.id && pr.default_product
        );

        if (productionRate) {
          const defaultProdId = productionRate['product_id'];
          const defaultProd = cloneState(products[newAction.id][defaultProdId]);
          const { components, sheens, ...rest } = defaultProd;
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id]['dimensions'][uniqueId]['products'][
            defaultProdId
          ] = {
            ...rest,
            ...(productionRate['default_component'] && {
              component: components.find(
                (c) => c.id == productionRate['default_component']
              ),
            }),
            ...(productionRate['default_sheen'] && {
              sheen: sheens.find(
                (c) => c.id == productionRate['default_sheen']
              ),
            }),
            timeStamp: Date.now(),
          };
        }
      }

      return {
        ...stateClone,
      };
    }

    case 'COPY_DIMENSIONS': {
      let idCount = parseInt(dimensionKey) + 1;

      if (surfaceId) {
        const dimensions = cloneState(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions']
        );

        let found = false;
        Object.keys(dimensions).map((key) => {
          if (key == dimensionKey) {
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
              idCount
            ] = dimensions[key];
            found = true;
            idCount += 1;
          } else if (found) {
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
              idCount
            ] = dimensions[key];
            idCount += 1;
          }
        });
      } else {
        const dimensions = cloneState(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions']
        );

        let found = false;
        Object.keys(dimensions).map((key) => {
          if (key == dimensionKey) {
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['dimensions'][idCount] = dimensions[key];
            found = true;
            idCount += 1;
          } else if (found) {
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['dimensions'][idCount] = dimensions[key];
            idCount += 1;
          }
        });
      }

      return {
        ...stateClone,
      };
    }

    case 'REMOVE_DIMENSION':
      surfaceId
        ? delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id]['dimensions'][
            dimensionKey
          ]
        : delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id]['dimensions'][dimensionKey];

      return {
        ...stateClone,
      };
    case 'UPDATE_DIMENSION': {
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id]['dimensions'][
            dimensionKey
          ][fieldName] = fieldValue)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id]['dimensions'][dimensionKey][
            fieldName
          ] = fieldValue);

      return {
        ...stateClone,
      };
    }

    case 'UPDATE_ADJUSTMENT_FIELD': {
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][newAction.id]['dimensions'][
            dimensionKey
          ][fieldName] = fieldValue)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][newAction.id]['dimensions'][dimensionKey][
            fieldName
          ] = fieldValue);

      return {
        ...stateClone,
      };
    }

    case 'ADD_PRODUCT':
      if (newProduct.has_coats) {
        const productsClone = cloneState(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products']
        );
        const prodId = Object.keys(productsClone).find(
          (p) => productsClone[p].has_coats
        );
        prodId &&
          delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][prodId];
      }
      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions'][actionId]['dimensions'][dimensionKey]['products'][
        newProductId
      ] = {
        timeStamp: Date.now(),
        ...newProduct,
      };
      return {
        ...stateClone,
      };
    case 'ADD_COMPONENT':
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][newProductId] = {
            ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
              dimensionKey
            ]['products'][newProductId],
            component: {
              id: prodFeatureId,
              name: prodFeatureName,
            },
          })
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            newProductId
          ] = {
            ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
              newProductId
            ],
            component: {
              id: prodFeatureId,
              name: prodFeatureName,
            },
          });
      return {
        ...stateClone,
      };
    case 'REMOVE_COMPONENT': {
      surfaceId
        ? delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][newProductId]['component']
        : delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            newProductId
          ]['component'];

      return {
        ...stateClone,
      };
    }
    case 'ADD_SHEEN':
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][newProductId] = {
            ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
              dimensionKey
            ]['products'][newProductId],
            sheen: {
              id: prodFeatureId,
              name: prodFeatureName,
            },
          })
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            newProductId
          ] = {
            ...stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
              newProductId
            ],
            sheen: {
              id: prodFeatureId,
              name: prodFeatureName,
            },
          });
      return {
        ...stateClone,
      };

    case 'REMOVE_SHEEN': {
      surfaceId
        ? delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][newProductId]['sheen']
        : delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            newProductId
          ]['sheen'];
      return {
        ...stateClone,
      };
    }

    case 'REMOVE_PRODUCT':
      surfaceId
        ? delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][newProductId]
        : delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            newProductId
          ];
      return {
        ...stateClone,
      };
    case 'ADD_PRODUCT_IN_PARENTLESS_NODE':
      if (newProduct.has_coats) {
        const productsClone = cloneState(
          stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products']
        );

        const prodId = Object.keys(productsClone).find(
          (p) => productsClone[p].has_coats
        );
        prodId &&
          delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            prodId
          ];
      }
      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ][actionId]['dimensions'][dimensionKey]['products'][newProductId] = {
        timeStamp: Date.now(),
        ...newProduct,
      };
      return {
        ...stateClone,
      };
    case 'UPDATE_BEDROOM_NAME':
      stateClone[parentRoomId]['bedrooms'][roomId]['name'] = roomName;
      return {
        ...stateClone,
      };
    case 'LOAD_ROOMS':
      return {
        ...cloneState(action.payload.rooms),
      };
    case 'INSERT_FIELDS':
      {
        const { surfaceProductionRates } = action.payload;
        Object.keys(stateClone).map((parentRoomId) => {
          Object.keys(stateClone[parentRoomId]['bedrooms']).map((roomId) => {
            if (!stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'])
              return;
            Object.keys(
              stateClone[parentRoomId]['bedrooms'][roomId]['surfaces']
            ).map((parentSurfaceId) => {
              if (
                Object.entries(
                  stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces']
                ).length < 1
              ) {
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['included'] &&
                  surfaceProductionRates[
                    stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surface_id']
                  ] &&
                  Object.keys(
                    surfaceProductionRates[
                      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surface_id']
                    ]['surface_fields']
                  ).map((fId) => {
                    stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ] = {
                      ...stateClone[parentRoomId]['bedrooms'][roomId][
                        'surfaces'
                      ][parentSurfaceId],
                      [surfaceProductionRates[
                        stateClone[parentRoomId]['bedrooms'][roomId][
                          'surfaces'
                        ][parentSurfaceId]['surface_id']
                      ]['surface_fields'][fId]['name']]: '',
                    };
                  });
                return;
              }
              Object.keys(
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).map((surfaceId) => {
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['included'] &&
                  surfaceProductionRates[
                    stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['surface_id']
                  ] &&
                  Object.keys(
                    surfaceProductionRates[
                      stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['surface_id']
                    ]['surface_fields']
                  ).map((fId) => {
                    stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId] = {
                      ...stateClone[parentRoomId]['bedrooms'][roomId][
                        'surfaces'
                      ][parentSurfaceId]['surfaces'][surfaceId],
                      [surfaceProductionRates[
                        stateClone[parentRoomId]['bedrooms'][roomId][
                          'surfaces'
                        ][parentSurfaceId]['surfaces'][surfaceId]['surface_id']
                      ]['surface_fields'][fId]['name']]: '',
                    };
                  });
              });
            });
          });
        });
      }
      return {
        ...stateClone,
      };
    case 'UPDATE_FIELD_VALUE': {
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId][fieldName] = fieldValue)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ][fieldName] = fieldValue);
      return {
        ...stateClone,
      };
    }
    case 'UPDATE_APP_CONTEXT':
      Object.keys(roomsState).map((parentRoomId) => {
        if (stateClone[parentRoomId]) {
          Object.keys(roomsState[parentRoomId]['bedrooms']).map((roomId) => {
            if (stateClone[parentRoomId]['bedrooms'][roomId]) {
              stateClone[parentRoomId]['bedrooms'][roomId] = {
                ...roomsState[parentRoomId]['bedrooms'][roomId],
                surfaces:
                  stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'],
              };
            } else {
              stateClone[parentRoomId]['bedrooms'][roomId] = {
                ...roomsState[parentRoomId]['bedrooms'][roomId],
              };
              Object.keys(stateClone).map((pKey) => {
                Object.keys(stateClone[pKey]['bedrooms']).map((key) => {
                  roomId === key &&
                    pKey !== parentRoomId &&
                    delete stateClone[pKey]['bedrooms'][key];
                });
              });
            }
          });
        } else {
          stateClone[parentRoomId] = { ...roomsState[parentRoomId] };
        }
      });
      return {
        ...stateClone,
      };
    case 'ADD_MANUFACTURER':
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][productId]['colorManufacturer'] = prodFeatureVal)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            productId
          ]['colorManufacturer'] = prodFeatureVal);
      return {
        ...stateClone,
      };
    case 'ADD_COLOR':
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][productId]['colorManufacturer'] = prodFeatureVal)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            productId
          ]['colorManufacturer'] = prodFeatureVal);
      return {
        ...stateClone,
      };
    case 'REMOVE_COLOR':
      surfaceId
        ? delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][productId]['colorManufacturer']['color']
        : delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            productId
          ]['colorManufacturer']['color'];
      return {
        ...stateClone,
      };
    case 'REMOVE_MANUFACTURER':
      surfaceId
        ? delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['dimensions'][
            dimensionKey
          ]['products'][productId]['colorManufacturer']
        : delete stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['dimensions'][dimensionKey]['products'][
            productId
          ]['colorManufacturer'];
      return {
        ...stateClone,
      };

    case 'UPDATE_SURFACE_NAME_FOR_ALL_ROOMS':
      Object.keys(stateClone).map((parentRoomId) => {
        Object.keys(stateClone[parentRoomId]['bedrooms']).map((roomId) => {
          if (!stateClone[parentRoomId]['bedrooms'][roomId]['surfaces']) return;
          Object.keys(
            stateClone[parentRoomId]['bedrooms'][roomId]['surfaces']
          ).map((parentSurfaceId) => {
            if (parentSurfaceId == surfaceId) {
              stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['name'] = surfaceName;
              stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actual_name'] = surfaceName;
              return;
            }
            if (
              Object.entries(
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).length > 0
            ) {
              Object.keys(
                stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).map((sId) => {
                if (sId == surfaceId) {
                  stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][sId]['name'] = surfaceName;
                  stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][sId]['actual_name'] = surfaceName;
                }
              });
            }
          });
        });
      });
      return {
        ...stateClone,
      };
    case 'UPDATE_SURFACE_NAME_FOR_SINGLE_ROOMS':
      surfaceId
        ? (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['name'] = surfaceName)
        : (stateClone[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['name'] = surfaceName);
      return {
        ...stateClone,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AppProvider({ children, rooms }) {
  const [state, dispatch] = React.useReducer(
    AppReducer,
    rooms ? { ...rooms } : {}
  );
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used inside a AppProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error('useAppDispatch must be used inside a AppProvider');
  }
  return context;
}

export {
  AppProvider,
  useAppState,
  useAppDispatch,
  updateApp,
  updateParentLessNode,
  addAction,
  addDefaultActionsAgainstSurfaces,
  removeAction,
  addActionOfParentLessNode,
  removeActionOfParentLessNode,
  addProduct,
  addComponent,
  removeComponent,
  addSheen,
  removeSheen,
  removeProduct,
  addProductInParentLessNode,
  updateBedroomName,
  loadRoomsInAppContext,
  insertFields,
  updateFieldValue,
  addDimensions,
  copyDimensions,
  removeDimension,
  updateDimension,
  updateAppContext,
  addActionAndRemoveAllOther,
  addManufacturer,
  addColor,
  removeManufacturer,
  removeColor,
  updateSurfaceNameForAllRooms,
  updateSurfaceNameForSingleRoom,
  updateAdjustmentField,
  updateCoatsAgainstAction,
};

function updateApp(dispatch, data) {
  dispatch({
    type: 'UPDATE_APP',
    payload: data,
  });
}

function updateParentLessNode(dispatch, data) {
  dispatch({
    type: 'PARENT_LESS_NODE',
    payload: data,
  });
}

function addAction(dispatch, data) {
  dispatch({
    type: 'ADD_ACTION',
    payload: data,
  });
}
function addDefaultActionsAgainstSurfaces(dispatch, data) {
  dispatch({
    type: 'ADD_DEFAULT_ACTIONS_AGAINST_SURFACES',
    payload: data,
  });
}

function addActionAndRemoveAllOther(dispatch, data) {
  dispatch({
    type: 'ADD_ACTION_AND_REMOVE_ALL_OTHER',
    payload: data,
  });
}

function removeAction(dispatch, data) {
  dispatch({
    type: 'REMOVE_ACTION',
    payload: data,
  });
}

function addActionOfParentLessNode(dispatch, data) {
  dispatch({
    type: 'ADD_ACTION_OF_PARENTLESS_NODE',
    payload: data,
  });
}

function removeActionOfParentLessNode(dispatch, data) {
  dispatch({
    type: 'REMOVE_ACTION_OF_PARENTLESS_NODE',
    payload: data,
  });
}
function addProduct(dispatch, data) {
  dispatch({
    type: 'ADD_PRODUCT',
    payload: data,
  });
}
function addComponent(dispatch, data) {
  dispatch({
    type: 'ADD_COMPONENT',
    payload: data,
  });
}
function removeComponent(dispatch, data) {
  dispatch({
    type: 'REMOVE_COMPONENT',
    payload: data,
  });
}
function addSheen(dispatch, data) {
  dispatch({
    type: 'ADD_SHEEN',
    payload: data,
  });
}
function removeSheen(dispatch, data) {
  dispatch({
    type: 'REMOVE_SHEEN',
    payload: data,
  });
}

function removeProduct(dispatch, data) {
  dispatch({
    type: 'REMOVE_PRODUCT',
    payload: data,
  });
}

function addProductInParentLessNode(dispatch, data) {
  dispatch({
    type: 'ADD_PRODUCT_IN_PARENTLESS_NODE',
    payload: data,
  });
}

function updateBedroomName(dispatch, data) {
  dispatch({
    type: 'UPDATE_BEDROOM_NAME',
    payload: data,
  });
}

function loadRoomsInAppContext(dispatch, data) {
  dispatch({
    type: 'LOAD_ROOMS',
    payload: data,
  });
}

function insertFields(dispatch, data) {
  dispatch({
    type: 'INSERT_FIELDS',
    payload: data,
  });
}

function updateFieldValue(dispatch, data) {
  dispatch({
    type: 'UPDATE_FIELD_VALUE',
    payload: data,
  });
}

function addDimensions(dispatch, data) {
  dispatch({
    type: 'ADD_DIMENSIONS',
    payload: data,
  });
}

function copyDimensions(dispatch, data) {
  dispatch({
    type: 'COPY_DIMENSIONS',
    payload: data,
  });
}

function removeDimension(dispatch, data) {
  dispatch({
    type: 'REMOVE_DIMENSION',
    payload: data,
  });
}
function updateDimension(dispatch, data) {
  dispatch({
    type: 'UPDATE_DIMENSION',
    payload: data,
  });
}

function updateAppContext(dispatch, data) {
  dispatch({
    type: 'UPDATE_APP_CONTEXT',
    payload: data,
  });
}

function addManufacturer(dispatch, data) {
  dispatch({
    type: 'ADD_MANUFACTURER',
    payload: data,
  });
}

function addColor(dispatch, data) {
  dispatch({
    type: 'ADD_COLOR',
    payload: data,
  });
}
function removeManufacturer(dispatch, data) {
  dispatch({
    type: 'REMOVE_MANUFACTURER',
    payload: data,
  });
}
function removeColor(dispatch, data) {
  dispatch({
    type: 'REMOVE_COLOR',
    payload: data,
  });
}

function updateSurfaceNameForAllRooms(dispatch, data) {
  dispatch({
    type: 'UPDATE_SURFACE_NAME_FOR_ALL_ROOMS',
    payload: data,
  });
}

function updateSurfaceNameForSingleRoom(dispatch, data) {
  dispatch({
    type: 'UPDATE_SURFACE_NAME_FOR_SINGLE_ROOMS',
    payload: data,
  });
}
function updateAdjustmentField(dispatch, data) {
  dispatch({
    type: 'UPDATE_ADJUSTMENT_FIELD',
    payload: data,
  });
}

function updateCoatsAgainstAction(dispatch, data) {
  dispatch({
    type: 'UPDATE_COATS_AGAINST_ACTION',
    payload: data,
  });
}
