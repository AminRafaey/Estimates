import React, { useEffect } from 'react';
import { styled, Box } from '@material-ui/core';
import Surface from '../Surface';
import { useAppState } from '../../../Context/AppContext';
import ParentSurface from '../ParentSurface';
import { isSurfaceHasDimensions } from '../utility';

const SelectionWrapper = styled(Box)({
  margin: 'auto',
  paddingTop: '35px',
});

export default function SurfacePanel(props) {
  const {
    selectedRoom,
    bulkSelectionArr,
    setBulkSelectionArr,
    commonProducts,
    selectedToggle,
    hourlyRate,
    selectedActionId,
    showActionBar,
    setShowActionBar,
  } = props;
  const appState = useAppState();

  useEffect(() => {
    if (selectedActionId != null && selectedToggle === 'paint') {
      let flag = false;
      const includedSurfaces = [];

      Object.keys(appState).map((parentRoomId) => {
        Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
          if (
            !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
            !appState[parentRoomId]['bedrooms'][roomId]['included']
          )
            return;
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces']
          ).map((parentSurfaceId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).length < 1
            ) {
              let actualChilds = 0;
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['included'] &&
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][selectedActionId]
              ) {
                actualChilds += Object.entries(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][selectedActionId]['dimensions']
                ).length;
              }

              const selectedChild = bulkSelectionArr.filter(
                (b) =>
                  parentRoomId == b.parentRoomId &&
                  roomId == b.roomId &&
                  parentSurfaceId == b.parentSurfaceId
              ).length;

              if (actualChilds === selectedChild && actualChilds != 0) {
                flag = true;
                includedSurfaces.push({
                  parentSurfaceId: parentSurfaceId,
                  surfaceId: null,
                });
              }

              return;
            }
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).map((surfaceId) => {
              let actualChilds = 0;
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['included'] &&
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][selectedActionId]
              ) {
                actualChilds += Object.entries(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][selectedActionId][
                    'dimensions'
                  ]
                ).length;
              }
              const selectedChild = bulkSelectionArr.filter(
                (b) =>
                  parentRoomId == b.parentRoomId &&
                  roomId == b.roomId &&
                  parentSurfaceId == b.parentSurfaceId &&
                  b.surfaceId == surfaceId
              ).length;

              if (actualChilds === selectedChild && actualChilds != 0) {
                flag = true;
                includedSurfaces.push({
                  parentSurfaceId: parentSurfaceId,
                  surfaceId: surfaceId,
                });
              }
            });
          });
        });
      });

      if (flag) {
        !showActionBar && setShowActionBar(true);
        const filteredBulkSelectionArr = bulkSelectionArr.filter((b) =>
          includedSurfaces.find(
            (i) =>
              i.parentSurfaceId == b.parentSurfaceId &&
              i.surfaceId == b.surfaceId
          )
        );
        bulkSelectionArr.length !== filteredBulkSelectionArr.length &&
          setBulkSelectionArr(filteredBulkSelectionArr);
      } else {
        showActionBar && setShowActionBar(false);
      }
    }
  }, [bulkSelectionArr]);

  useEffect(() => {
    if (selectedActionId != null && selectedToggle === 'colors') {
      let flag = false;
      const includedSurfaces = [];

      Object.keys(appState).map((parentRoomId) => {
        Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
          if (
            !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
            !appState[parentRoomId]['bedrooms'][roomId]['included']
          )
            return;
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces']
          ).map((parentSurfaceId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces']
              ).length < 1
            ) {
              let actualChilds = 0;
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['included'] &&
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][selectedActionId]
              ) {
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][selectedActionId]['dimensions']
                ).map((dimensionId) => {
                  Object.keys(
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][selectedActionId]['dimensions'][dimensionId][
                      'products'
                    ]
                  ).find(
                    (productId) =>
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['actions'][selectedActionId]['dimensions'][dimensionId][
                        'products'
                      ][productId]['has_coats']
                  ) && actualChilds++;
                });
              }

              const selectedChild = bulkSelectionArr.filter(
                (b) =>
                  parentRoomId == b.parentRoomId &&
                  roomId == b.roomId &&
                  parentSurfaceId == b.parentSurfaceId
              ).length;

              if (actualChilds === selectedChild && actualChilds != 0) {
                flag = true;
                includedSurfaces.push({
                  parentSurfaceId: parentSurfaceId,
                  surfaceId: null,
                });
              }

              return;
            }
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).map((surfaceId) => {
              let actualChilds = 0;
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['included'] &&
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][selectedActionId]
              ) {
                Object.keys(
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][selectedActionId][
                    'dimensions'
                  ]
                ).map((dimesnionId) => {
                  Object.keys(
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][selectedActionId][
                      'dimensions'
                    ][dimesnionId]['products']
                  ).find(
                    (productId) =>
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][selectedActionId][
                        'dimensions'
                      ][dimesnionId]['products'][productId]['has_coats']
                  ) && actualChilds++;
                });
              }
              const selectedChild = bulkSelectionArr.filter(
                (b) =>
                  parentRoomId == b.parentRoomId &&
                  roomId == b.roomId &&
                  parentSurfaceId == b.parentSurfaceId &&
                  b.surfaceId == surfaceId
              ).length;

              if (actualChilds === selectedChild && actualChilds != 0) {
                flag = true;
                includedSurfaces.push({
                  parentSurfaceId: parentSurfaceId,
                  surfaceId: surfaceId,
                });
              }
            });
          });
        });
      });

      if (flag) {
        !showActionBar && setShowActionBar(true);
        const filteredBulkSelectionArr = bulkSelectionArr.filter((b) =>
          includedSurfaces.find(
            (i) =>
              i.parentSurfaceId == b.parentSurfaceId &&
              i.surfaceId == b.surfaceId
          )
        );
        bulkSelectionArr.length !== filteredBulkSelectionArr.length &&
          setBulkSelectionArr(filteredBulkSelectionArr);
      } else {
        showActionBar && setShowActionBar(false);
      }
    }
  }, [bulkSelectionArr]);

  useEffect(() => {
    setBulkSelectionArr([]);
  }, [selectedActionId]);

  return (
    <SelectionWrapper>
      {Object.keys(
        appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
          'surfaces'
        ]
      ).map((parentSurfaceId, index) => {
        if (
          Object.entries(
            appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
              'surfaces'
            ][parentSurfaceId]['surfaces']
          ).length < 1
        ) {
          if (
            !appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
              'surfaces'
            ][parentSurfaceId]['included']
          ) {
            return;
          }

          return (
            <Surface
              key={parentSurfaceId + selectedRoom.id + selectedRoom.parent_id}
              parentRoomId={selectedRoom.parent_id}
              roomId={selectedRoom.id}
              parentSurfaceId={parentSurfaceId}
              bulkSelectionArr={bulkSelectionArr}
              setBulkSelectionArr={setBulkSelectionArr}
              commonProducts={commonProducts}
              selectedToggle={selectedToggle}
              hourlyRate={hourlyRate}
              selectedActionId={selectedActionId}
            />
          );
        }
      })}

      {Object.keys(
        appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
          'surfaces'
        ]
      ).map((parentSurfaceId, index) => {
        if (
          Object.keys(
            appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
              'surfaces'
            ][parentSurfaceId]['surfaces']
          ).find(
            (key) =>
              appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
                'surfaces'
              ][parentSurfaceId]['surfaces'][key]['included']
          ) &&
          isSurfaceHasDimensions(
            appState[selectedRoom.parent_id]['bedrooms'][selectedRoom.id][
              'surfaces'
            ][parentSurfaceId]['surfaces']
          )
        ) {
          return (
            <ParentSurface
              key={index}
              parentSurfaceId={parentSurfaceId}
              bulkSelectionArr={bulkSelectionArr}
              setBulkSelectionArr={setBulkSelectionArr}
              commonProducts={commonProducts}
              selectedToggle={selectedToggle}
              selectedRoom={selectedRoom}
              index={index}
              hourlyRate={hourlyRate}
              selectedActionId={selectedActionId}
            />
          );
        }
      })}
    </SelectionWrapper>
  );
}
