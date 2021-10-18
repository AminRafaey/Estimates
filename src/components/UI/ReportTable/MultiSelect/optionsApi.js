import { isRoomHasAnyDim } from '../../../EstimateSummary/utility';

export default function optionsApi(endpoint, payload) {
  const { appState } = payload;
  switch (endpoint) {
    case 'Hours and cost by room':
      return getRoomsFromApp(appState);
    case 'Products by action':
      return getActionsFromApp(appState);
    case 'Products by room':
      return getRoomsFromApp(appState);
    case 'Hours by Surface':
      return getRoomsFromApp(appState);
    default:
      return [];
  }
}

export const getRoomsFromApp = (appState) => {
  const rooms = [];
  Object.keys(appState).map((parentRoomId) => {
    Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
      if (!isRoomHasAnyDim(appState, parentRoomId, roomId)) return;
      rooms.push({
        id: roomId,
        parentRoomId: parentRoomId,
        roomId: roomId,
        name: appState[parentRoomId]['bedrooms'][roomId]['name'],
      });
    });
  });
  return rooms;
};

export function getActionsFromApp(appState) {
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
                    actionId,
                    id: actionId,
                    name:
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['actions'][actionId]['name'],
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
                    actionId,
                    id: actionId,
                    name:
                      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][actionId]['name'],
                  });
              });
            }
          });
        }
      );
    });
  });
  return [
    ...allActions.filter(function (c) {
      return this.has(c.id) ? false : this.add(c.id);
    }, new Set()),
  ];
}
