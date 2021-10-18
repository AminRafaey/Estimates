export const setFirstRoomDefault = (appState, setSelectedRoom) => {
  let found = false;
  Object.keys(appState).map((parentRoomId) => {
    Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
      if (
        !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
        !appState[parentRoomId]['bedrooms'][roomId]['included']
      )
        return;

      !found &&
        (found = true) &&
        setSelectedRoom({
          parent_id: parentRoomId,
          id: roomId,
        });
    });
  });
};

export const getUniqueSurfacesFromState = (appState) => {
  let uniqueSurfaceIds = [];
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
              ]['included'] ||
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions']
              ).length > 0
            ) {
              uniqueSurfaceIds.push(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surface_id']
              );
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
              ]['surfaces'][surfaceId]['included'] ||
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions']
              ).length > 0
            ) {
              uniqueSurfaceIds.push(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['surface_id']
              );
            }
          });
        }
      );
    });
  });
  return uniqueSurfaceIds.filter((v, i, a) => a.indexOf(v) === i);
};

export function isRoomHasAnyIncludedSurface(parentRoomId, roomId, appState) {
  if (roomId === -1) return false;
  let count = 0;
  Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
    (parentSurfaceId) => {
      if (
        Object.entries(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).length < 1
      ) {
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'included'
        ] && count++;
        return;
      }
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ]
      ).map((surfaceId) => {
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['included'] && count++;
        return;
      });
    }
  );
  if (count > 0) return true;
  return false;
}

export const idsNotExistInPRContext = (appState, arr1) => {
  const arr2 = getUniqueSurfacesFromState(appState);
  return arr2.filter((x) => !arr1.find((s) => s == x));
};

export const getLaborCost = (
  surfaceProductionRatesState,
  formula,
  surface_id,
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  hourlyRate
) => {
  let result = 0;
  surfaceProductionRatesState[surface_id]['surface_actions'].map((a) => {
    if (surfaceId) {
      if (
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'][a.id] &&
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'][a.id]['selected']
      ) {
        const laborCost =
          (eval(formula) /
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              a.id
            ]['pulo']) *
          hourlyRate;

        const no_of_coats =
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][a.id]['no_of_coats'];
        const surfaceProductionRate =
          surfaceProductionRatesState[surface_id]['surface_production_rates'][
            a.id
          ];

        if (!no_of_coats) {
          result += laborCost;
          return;
        }

        const additionalCoats = no_of_coats - 1;

        !isNaN(
          laborCost +
            additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost
        ) &&
          (result +=
            laborCost +
            additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost);
      }
    } else {
      if (
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ][a.id] &&
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ][a.id]['selected']
      ) {
        const laborCost =
          (eval(formula) /
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              a.id
            ]['pulo']) *
          hourlyRate;

        const no_of_coats =
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][a.id]['no_of_coats'];
        const surfaceProductionRate =
          surfaceProductionRatesState[surface_id]['surface_production_rates'][
            a.id
          ];

        if (!no_of_coats) {
          result += laborCost;
          return;
        }

        const additionalCoats = no_of_coats - 1;

        !isNaN(
          laborCost +
            additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost
        ) &&
          (result +=
            laborCost +
            additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost);
      }
    }
  });

  return isNaN(result) ? 0 : result;
};
export const getLinkingList = (
  fieldName,
  surfaceId,
  linkingList,
  fieldsLinking,
  didPushAnything = false
) => {
  Object.keys(fieldsLinking).map((gId) => {
    Object.keys(fieldsLinking[gId]).map((fName) => {
      if (
        fName === fieldName &&
        fieldsLinking[gId][fName].find((s) => s.surfaceId == surfaceId)
      ) {
        Object.keys(fieldsLinking[gId]).map((fName) => {
          fieldsLinking[gId][fName].map((s) => {
            if (
              linkingList.find(
                (l) => l.surfaceId == s['surfaceId'] && l.fieldName == fName
              )
            )
              return;
            didPushAnything = true;
            linkingList.push({
              fieldName: fName,
              groupId: gId,
              surfaceName: s['surfaceName'],
              surfaceId: s['surfaceId'],
            });
          });
        });
      }
    });
  });
  return { linkingList: linkingList, didPushAnything: didPushAnything };
};

export const getLinking = (
  fieldName,
  surfaceId,
  parentSurfaceId,
  fieldsLinking
) => {
  const { linkingList } = getLinkingList(
    fieldName,
    surfaceId ? surfaceId : parentSurfaceId,
    [],
    fieldsLinking
  );
  let c1 = 0;
  while (true) {
    if (c1 == linkingList.length - 1 || linkingList.length === 0) {
      break;
    }
    if (
      getLinkingList(
        linkingList[c1]['fieldName'],
        linkingList[c1]['surfaceId'],
        linkingList,
        fieldsLinking
      ).didPushAnything
    ) {
      c1 = 0;
      continue;
    }
    c1++;
  }
  return linkingList
    .map((l, i) => {
      return {
        surfaceName: l.surfaceName,
        surfaceId: l.surfaceId,
        fields: linkingList
          .filter((lf) => lf.surfaceId == l.surfaceId)
          .map((l) => l.fieldName)
          .filter((item, i, ar) => ar.indexOf(item) === i),
      };
    })
    .filter(
      (obj, pos, arr) =>
        arr.map((mapObj) => mapObj['surfaceId']).indexOf(obj['surfaceId']) ===
        pos
    );
};

export const getFieldValue = (
  surfaceId,
  fieldName,
  appState,
  parentRoomId,
  roomId
) => {
  let outputValue = '';
  Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
    (parentSurfaceId) => {
      if (
        Object.entries(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).length < 1
      ) {
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'included'
        ] &&
          surfaceId == parentSurfaceId &&
          (outputValue =
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ][fieldName]);
        return;
      }
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ]
      ).map((sId) => {
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][sId]['included'] &&
          surfaceId == sId &&
          (outputValue =
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][sId][fieldName]);
      });
    }
  );
  return outputValue;
};

export const getFieldStatus = (surfaceId, appState, parentRoomId, roomId) => {
  let outputValue = true;
  Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
    (parentSurfaceId) => {
      if (
        Object.entries(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).length < 1
      ) {
        surfaceId == parentSurfaceId &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['included'] &&
          (outputValue = false);
        return;
      }
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ]
      ).map((sId) => {
        surfaceId == sId &&
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][sId]['included'] &&
          (outputValue = false);
      });
    }
  );
  return outputValue;
};

export const insertNumOfActionInList = (
  appState,
  surfaceProductionRatesState,
  fieldsLinkingList,
  parentRoomId,
  roomId
) =>
  fieldsLinkingList.map((f) => {
    let output = { ...f };
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
          ]['included'] &&
            f.surfaceId == parentSurfaceId &&
            (output.numOfActions =
              surfaceProductionRatesState[
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surface_id']
              ]['surface_actions'].length);
          return;
        }
        Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).map((sId) => {
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][sId]['included'] &&
            f.surfaceId == sId &&
            (output.numOfActions =
              surfaceProductionRatesState[
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][sId]['surface_id']
              ]['surface_actions'].length);
          return;
        });
      }
    );
    return { ...output };
  });

export const insertNumOfSelectedAction = (
  appState,
  fieldsLinkingList,
  parentRoomId,
  roomId
) =>
  fieldsLinkingList.map((f) => {
    let output = { ...f };
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
          ]['included'] &&
            f.surfaceId == parentSurfaceId &&
            (output.numOfSelectedActions = Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions']
            ).filter(
              (aId) =>
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][aId]['selected']
            ).length);
          return;
        }
        Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).map((sId) => {
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][sId]['included'] &&
            f.surfaceId == sId &&
            (output.numOfSelectedActions = Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][sId]['actions']
            ).filter(
              (aId) =>
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][sId]['actions'][aId]['selected']
            ).length);
          return;
        });
      }
    );
    return { ...output };
  });

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
              if (!uniqueSurfaces[parentSurfaceId]) {
                uniqueSurfaces[parentSurfaceId] = {
                  ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ],
                  parent_id: '',
                };
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

              if (!uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]) {
                uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId] = {
                  ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId],
                  actions: {},
                };
              }
            }
          });
        }
      );
    });
  });
  return uniqueSurfaces;
};

export const handleAllSUrfacesChange = (e, appState, roomId, parentRoomId) => {
  if (!e.target.checked) return [];
  let bulkSelectionArr = [];

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
          bulkSelectionArr.push({
            parentRoomId: parentRoomId,
            roomId: roomId,
            parentSurfaceId: parentSurfaceId,
            surfaceId: null,
            surface_id:
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surface_id'],
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
          bulkSelectionArr.push({
            parentRoomId: parentRoomId,
            roomId: roomId,
            parentSurfaceId: parentSurfaceId,
            surfaceId: surfaceId,
            surface_id:
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['surface_id'],
          });
        }
      });
    }
  );

  return bulkSelectionArr;
};

export function getCommonActions(appState, parentSurfaceId, surfaceId) {
  let commonActions = [];
  let initialEmptyFlag = true;
  Object.keys(appState).map((parentRoomId) => {
    if (commonActions.length < 1 && !initialEmptyFlag) {
      return;
    }
    Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
      if (
        !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
        !appState[parentRoomId]['bedrooms'][roomId]['included']
      )
        return;
      Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
        (PSId) => {
          if (
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                'surfaces'
              ]
            ).length < 1
          ) {
            if (
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                'included'
              ] &&
              PSId === parentSurfaceId
            ) {
              if (initialEmptyFlag) {
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                    'actions'
                  ]
                ).map((actionId) => {
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                    'actions'
                  ][actionId]['selected'] &&
                    commonActions.push({
                      ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        PSId
                      ]['actions'][actionId],
                      id: actionId,
                    });
                });
                initialEmptyFlag = false;
                return;
              }
              commonActions.map((a) => {
                !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'actions'
                ][a.id]?.selected &&
                  (commonActions = commonActions.filter((c) => c.id != a.id));
              });
            }
            return;
          }
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
              'surfaces'
            ]
          ).map((SId) => {
            if (
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                'surfaces'
              ][SId]['included'] &&
              SId == surfaceId
            ) {
              initialEmptyFlag &&
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                    'surfaces'
                  ][surfaceId]['actions']
                ).map((actionId) => {
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                    'surfaces'
                  ][surfaceId]['actions'][actionId]['selected'] &&
                    commonActions.push({
                      ...appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        PSId
                      ]['surfaces'][surfaceId]['actions'][actionId],
                      id: actionId,
                    });
                });
              if (initialEmptyFlag) {
                initialEmptyFlag = false;

                return;
              }
              commonActions.map((a) => {
                !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'surfaces'
                ][surfaceId]['actions'][a.id]?.selected &&
                  (commonActions = commonActions.filter((c) => c.id != a.id));
              });
            }
          });
        }
      );
    });
  });
  return commonActions;
}

export const getConvertedSurfaceFormula = (
  actionKey,
  dKey,
  surface_id,
  surfaceProductionRatesState
) => {
  let surface_formula = surfaceProductionRatesState[surface_id][
    'surface_formula'
  ].trim();
  Object.keys(surfaceProductionRatesState[surface_id]['surface_fields']).map(
    (key) => {
      surface_formula = surface_formula.replaceAll(
        surfaceProductionRatesState[surface_id]['surface_fields'][key]['name'],
        `(surfaceId?appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId]['surfaces'][surfaceId]['actions'][${actionKey}]['dimensions'][${dKey}][surfaceProductionRatesState[surface_id]['surface_fields'][${key}][
        'name'
      ]]:
appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId]['actions'][${actionKey}]['dimensions'][${dKey}][surfaceProductionRatesState[surface_id]['surface_fields'][${key}][
        'name'
      ]])`
      );
    }
  );
  return surface_formula;
};

export const getTotalLaborCost = (
  surfaceProductionRatesState,
  appState,
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  actions,
  surface_id,
  actionId,
  dimensionKey,
  hourlyRate
) => {
  const laborCost =
    parseFloat(
      parseFloat(
        parseFloat(
          parseFloat(
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
                ? actions[actionId]['dimensions'][dimensionKey][
                    'areaAdjustment'
                  ]
                : 0
            )
        ) /
          surfaceProductionRatesState[surface_id]['surface_production_rates'][
            actionId
          ]['pulo']
      ) +
        parseFloat(
          actions[actionId]['dimensions'][dimensionKey]['hoursAdjustment']
            ? actions[actionId]['dimensions'][dimensionKey]['hoursAdjustment']
            : 0
        )
    ) * hourlyRate;

  const no_of_coats =
    actions[actionId]['dimensions'][dimensionKey]['no_of_coats'];
  const surfaceProductionRate =
    surfaceProductionRatesState[surface_id]['surface_production_rates'][
      actionId
    ];

  if (!no_of_coats) return isNaN(laborCost) ? 0 : laborCost;
  if (no_of_coats == surfaceProductionRate['no_of_coats']) {
    return isNaN(laborCost) ? 0 : laborCost;
  }
  const additionalCoats = Math.abs(
    (no_of_coats - surfaceProductionRate['no_of_coats']) /
      surfaceProductionRate['no_of_coats']
  );
  if (no_of_coats < surfaceProductionRate['no_of_coats']) {
    {
      return isNaN(
        laborCost -
          additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost
      )
        ? 0
        : laborCost -
            additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost;
    }
  }
  return isNaN(
    laborCost +
      additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost
  )
    ? 0
    : laborCost +
        additionalCoats * surfaceProductionRate['pulo_factor'] * laborCost;
};
export const isAnyRoomHasIncludedSurface = (appState) => {
  if (Object.entries(appState).length < 1) {
    return false;
  }
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
            ).length === 0
          ) {
            if (
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['included']
            ) {
              count++;
              return;
            }
          } else {
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
                count++;
                return;
              }
            });
          }
        }
      );
    });
  });
  if (count > 0) return true;
  return false;
};

export function getMaxFieldCount(
  appState,
  surfaceProductionRatesState,
  parentRoomId,
  roomId
) {
  let count = 0;

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
          count <
            Object.entries(
              surfaceProductionRatesState[
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surface_id']
              ]['surface_fields']
            ).length &&
            (count = Object.entries(
              surfaceProductionRatesState[
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surface_id']
              ]['surface_fields']
            ).length);
          return;
        }
      } else {
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
            count <
              Object.entries(
                surfaceProductionRatesState[
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['surface_id']
                ]['surface_fields']
              ).length &&
              (count = Object.entries(
                surfaceProductionRatesState[
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['surface_id']
                ]['surface_fields']
              ).length);

            return;
          }
        });
      }
    }
  );

  return count;
}
