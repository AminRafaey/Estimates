import { updateParentState } from '../../Context/utility';
import { cloneState } from '../EstimateProduct/stateClone';

export const getFilteredRooms = (estimateRooms) => {
  let filteredEstimateRooms = cloneState(estimateRooms);
  Object.keys(estimateRooms).map((parentRoomId) => {
    Object.keys(estimateRooms[parentRoomId]['bedrooms']).map((roomId) => {
      if (
        !estimateRooms[parentRoomId]['bedrooms'][roomId]['name'] &&
        !estimateRooms[parentRoomId]['bedrooms'][roomId]['estimate_room_id'] &&
        !estimateRooms[parentRoomId]['bedrooms'][roomId]['room_id']
      ) {
        delete filteredEstimateRooms[parentRoomId]['bedrooms'][roomId];
        filteredEstimateRooms = updateParentState(
          filteredEstimateRooms,
          parentRoomId
        );
      }
    });
  });
  return filteredEstimateRooms;
};

export const insertUniqueIdsInRooms = (estimateRooms) => {
  let clonedEstimateRooms = cloneState(estimateRooms);
  let uniqueId = 1;
  Object.keys(clonedEstimateRooms).map((parentRoomId) => {
    clonedEstimateRooms[parentRoomId]['ui_id'] = uniqueId;
    uniqueId++;
    Object.keys(clonedEstimateRooms[parentRoomId]['bedrooms']).map((roomId) => {
      clonedEstimateRooms[parentRoomId]['bedrooms'][roomId]['ui_id'] = uniqueId;
      uniqueId++;
    });
  });
  return clonedEstimateRooms;
};
