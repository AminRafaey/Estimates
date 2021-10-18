import React from 'react';
import { cloneState } from '../components/EstimateProduct/stateClone.js';
import { updateParentState } from './utility';

const RoomsStateContext = React.createContext(null);
const RoomsDispatchContext = React.createContext(null);

function RoomsReducer(state, action) {
  const {
    roomCategory_Id,
    room_Id,
    selected,
    value,
    selectedValue,
    roomName,
    included,
    newRoomCategoryId,
    newRoomId,
    updatedContext,
  } = action.payload;
  let stateClone = cloneState(state);

  switch (action.type) {
    case 'UPDATE_CHECKBOX':
      stateClone[roomCategory_Id]['bedrooms'][room_Id][selected] = value;
      value &&
        (stateClone[roomCategory_Id]['bedrooms'][room_Id][
          selected === 'included' ? 'excluded' : 'included'
        ] = !value);
      stateClone = updateParentState(stateClone, roomCategory_Id);
      return {
        ...stateClone,
      };

    case 'UPDATE_NAME':
      stateClone[roomCategory_Id]['bedrooms'][room_Id]['name'] = value;
      return stateClone;

    case 'UPDATE_MAIN_CHECKBOX':
      // updating all rooms in a single group/category
      Object.keys(stateClone[roomCategory_Id]['bedrooms']).map((key) => {
        if (!stateClone[roomCategory_Id]['bedrooms'][key]['selected']) return;
        let temp = {
          ...stateClone[roomCategory_Id]['bedrooms'][key],
          [selected]: value,
          ...(value &&
            (selected === 'included'
              ? { excluded: !value }
              : { included: !value })),
        };
        stateClone[roomCategory_Id]['bedrooms'][key] = temp;
      });

      // updating included/excluded for category/group
      stateClone[roomCategory_Id][selected] = value;
      value &&
        (stateClone[roomCategory_Id][
          selected === 'included' ? 'excluded' : 'included'
        ] = !value);

      // updating includeIntermediate/excludeIntermediate for category/group
      value &&
        (stateClone[roomCategory_Id][
          selected === 'included'
            ? 'excludedIntermediate'
            : 'includedIntermediate'
        ] = !value);
      stateClone[roomCategory_Id][`${selected}Intermediate`] = false;

      //returning updated state
      return {
        ...state,
        [roomCategory_Id]: {
          ...stateClone[roomCategory_Id],
          ...(value &&
            (selected === 'included'
              ? { excluded: !value }
              : { included: !value })),
        },
      };

    case 'LOAD_ROOM_CONTEXT':
      return {
        ...action.payload.rooms,
      };
    case 'ADD_SELECTED_VALUE': {
      selectedValue && (stateClone[roomCategory_Id]['selected'] = true);
      stateClone[roomCategory_Id]['bedrooms'][room_Id][
        'selected'
      ] = selectedValue;
      stateClone = updateParentState(stateClone, roomCategory_Id);
      return {
        ...stateClone,
      };
    }
    case 'ADD_NEW_ROOM': {
      stateClone[roomCategory_Id]['selected'] = true;
      stateClone[roomCategory_Id]['bedrooms'][room_Id] = {
        name: roomName,
        included: included ? included : false,
        excluded: false,
        selected: true,
        position:
          Math.max(
            ...Object.keys(stateClone[roomCategory_Id]['bedrooms']).map(
              (key) => stateClone[roomCategory_Id]['bedrooms'][key]['position']
            )
          ) + 1,
      };
      stateClone = updateParentState(stateClone, roomCategory_Id);
      return {
        ...stateClone,
      };
    }
    case 'DELETE_ROOM': {
      delete stateClone[roomCategory_Id]['bedrooms'][room_Id];
      stateClone = updateParentState(stateClone, roomCategory_Id);
      return {
        ...stateClone,
      };
    }
    case 'UPDATE_PARENT': {
      const positionsArr = Object.keys(
        stateClone[newRoomCategoryId]['bedrooms']
      ).sort(
        (a, b) =>
          stateClone[newRoomCategoryId]['bedrooms'][a]['position'] -
          stateClone[newRoomCategoryId]['bedrooms'][b]['position']
      );

      stateClone[newRoomCategoryId]['bedrooms'][room_Id] = {
        ...stateClone[roomCategory_Id]['bedrooms'][room_Id],
        position:
          positionsArr.length > 0
            ? stateClone[newRoomCategoryId]['bedrooms'][
                positionsArr[positionsArr.length - 1]
              ]['position'] + 1
            : 0,
      };
      delete stateClone[roomCategory_Id]['bedrooms'][room_Id];

      [roomCategory_Id, newRoomCategoryId].map((category_Id) => {
        stateClone = updateParentState(stateClone, category_Id);
      });
      return {
        ...stateClone,
      };
    }
    case 'ADD_SELECTED_VALUE_OF_PARENT': {
      stateClone[roomCategory_Id]['selected'] = selectedValue;
      return {
        ...stateClone,
      };
    }
    case 'DELETE_ROOM':
      delete stateClone[roomCategory_Id]['bedrooms'][room_Id];
      return {
        ...stateClone,
      };
    case 'UPDATE_ROOM_POSITION': {
      let roomIds = Object.keys(stateClone[roomCategory_Id]['bedrooms']);
      let active = false;
      roomIds
        .sort(
          (a, b) =>
            stateClone[roomCategory_Id]['bedrooms'][a]['position'] -
            stateClone[roomCategory_Id]['bedrooms'][b]['position']
        )
        .map((rId, i) => {
          if (rId == newRoomId) {
            return;
          }
          if (rId == room_Id) {
            stateClone[roomCategory_Id]['bedrooms'][newRoomId]['position'] =
              i + 1;
            stateClone[roomCategory_Id]['bedrooms'][room_Id]['position'] = i;
            active = true;
            return;
          }
          active
            ? (stateClone[roomCategory_Id]['bedrooms'][rId]['position'] = i + 1)
            : (stateClone[roomCategory_Id]['bedrooms'][rId]['position'] = i);
        });
      return {
        ...stateClone,
      };
    }

    case 'ADD_ROOM_ON_TOP': {
      let roomIds = Object.keys(stateClone[roomCategory_Id]['bedrooms']).filter(
        (r) => r !== room_Id
      );
      stateClone[roomCategory_Id]['bedrooms'][room_Id]['position'] = 0;
      roomIds
        .sort(
          (a, b) =>
            stateClone[roomCategory_Id]['bedrooms'][a]['position'] -
            stateClone[roomCategory_Id]['bedrooms'][b]['position']
        )
        .map((rId, i) => {
          stateClone[roomCategory_Id]['bedrooms'][rId]['position'] = i + 1;
        });
      return {
        ...stateClone,
      };
    }
    case 'UPDATE_CATEGORY_NAME':
      stateClone[roomCategory_Id]['name'] = value;
      return {
        ...stateClone,
      };
    case 'ADD_NEW_CATEGORY':
      stateClone[roomCategory_Id] = {
        name: value,
        selected: true,
        included: false,
        excluded: false,
        includedIntermediate: false,
        excludedIntermediate: false,
        bedrooms: {},
        position:
          Math.max(
            ...Object.keys(stateClone).map((key) => stateClone[key]['position'])
          ) + 1,
      };
      return {
        ...stateClone,
      };
    case 'ADD_ROOM_ABOVE_FROM_CURRENT': {
      let roomIds = Object.keys(stateClone[roomCategory_Id]['bedrooms']);
      let active = false;
      roomIds
        .sort(
          (a, b) =>
            stateClone[roomCategory_Id]['bedrooms'][a]['position'] -
            stateClone[roomCategory_Id]['bedrooms'][b]['position']
        )
        .map((rId, i) => {
          if (rId == room_Id) {
            return;
          }
          if (rId == newRoomId) {
            stateClone[roomCategory_Id]['bedrooms'][newRoomId]['position'] =
              i + 1;
            stateClone[roomCategory_Id]['bedrooms'][room_Id]['position'] = i;
            active = true;
            return;
          }
          active
            ? (stateClone[roomCategory_Id]['bedrooms'][rId]['position'] = i + 1)
            : (stateClone[roomCategory_Id]['bedrooms'][rId]['position'] = i);
        });
      return {
        ...stateClone,
      };
    }
    case 'ADD_CATEGORY_BELOW_FROM_CURRENT': {
      let roomCategoryIds = Object.keys(stateClone);
      let active = false;
      roomCategoryIds
        .sort((a, b) => stateClone[a]['position'] - stateClone[b]['position'])
        .map((rId, i) => {
          if (rId == newRoomCategoryId) {
            return;
          }
          if (rId == roomCategory_Id) {
            stateClone[newRoomCategoryId]['position'] = i + 1;
            stateClone[roomCategory_Id]['position'] = i;
            active = true;
            return;
          }
          active
            ? (stateClone[rId]['position'] = i + 1)
            : (stateClone[rId]['position'] = i);
        });
      return {
        ...stateClone,
      };
    }
    case 'ADD_CATEGORY_ABOVE_FROM_CURRENT': {
      let roomCategoryIds = Object.keys(stateClone);
      let active = false;
      roomCategoryIds
        .sort((a, b) => stateClone[a]['position'] - stateClone[b]['position'])
        .map((rId, i) => {
          if (rId == newRoomCategoryId) {
            return;
          }
          if (rId == roomCategory_Id) {
            stateClone[roomCategory_Id]['position'] = i + 1;
            stateClone[newRoomCategoryId]['position'] = i;
            active = true;
            return;
          }
          active
            ? (stateClone[rId]['position'] = i + 1)
            : (stateClone[rId]['position'] = i);
        });
      return {
        ...stateClone,
      };
    }
    case 'REPLACE_CONTEXT_WITH_UPDATED_ONE':
      return {
        ...updatedContext,
      };
    case 'INSERT_IDS':
      Object.keys(updatedContext).map((parentRoomId) => {
        Object.keys(stateClone).map((pRId) => {
          if (
            updatedContext[parentRoomId]['ui_id'] == stateClone[pRId]['ui_id']
          ) {
            if (!stateClone[pRId]['estimate_room_group_id']) {
              const cloneParentRoom = cloneState(stateClone[pRId]);
              delete stateClone[pRId];
              stateClone[parentRoomId] = {
                ...cloneParentRoom,
                estimate_room_group_id:
                  updatedContext[parentRoomId]['estimate_room_group_id'],
                ...(updatedContext[parentRoomId]['room_group_id'] && {
                  room_group_id: updatedContext[parentRoomId]['room_group_id'],
                }),
              };
            }
          }
        });
      });
      Object.keys(updatedContext).map((parentRoomId) => {
        Object.keys(updatedContext[parentRoomId]['bedrooms']).map((roomId) => {
          Object.keys(stateClone).map((pRId) => {
            Object.keys(stateClone[pRId]['bedrooms']).map((rId) => {
              if (
                updatedContext[parentRoomId]['bedrooms'][roomId]['ui_id'] ==
                stateClone[pRId]['bedrooms'][rId]['ui_id']
              ) {
                if (!stateClone[pRId]['bedrooms'][rId]['estimate_room_id']) {
                  const cloneRoom = cloneState(
                    stateClone[pRId]['bedrooms'][rId]
                  );
                  delete stateClone[pRId]['bedrooms'][rId];
                  stateClone[pRId]['bedrooms'][roomId] = {
                    ...cloneRoom,
                    estimate_room_id:
                      updatedContext[parentRoomId]['bedrooms'][roomId][
                        'estimate_room_id'
                      ],
                    ...(updatedContext[parentRoomId]['bedrooms'][roomId][
                      'room_id'
                    ] && {
                      room_id:
                        updatedContext[parentRoomId]['bedrooms'][roomId][
                          'room_id'
                        ],
                    }),
                  };
                }
              }
            });
          });
        });
      });
      return {
        ...stateClone,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function RoomsProvider({ children, rooms }) {
  const [state, dispatch] = React.useReducer(
    RoomsReducer,
    rooms ? { ...rooms } : {}
  );
  return (
    <RoomsStateContext.Provider value={state}>
      <RoomsDispatchContext.Provider value={dispatch}>
        {children}
      </RoomsDispatchContext.Provider>
    </RoomsStateContext.Provider>
  );
}

function useRoomsState() {
  const context = React.useContext(RoomsStateContext);
  if (context === undefined) {
    throw new Error('useRoomsState must be used inside a RoomsProvider');
  }
  return context;
}

function useRoomsDispatch() {
  const context = React.useContext(RoomsDispatchContext);
  if (context === undefined) {
    throw new Error('useRoomsDispatch must be used inside a RoomsProvider');
  }
  return context;
}

export {
  RoomsProvider,
  useRoomsState,
  useRoomsDispatch,
  updateCheckbox,
  updateName,
  updateMainCheckbox,
  loadRoomContext,
  addSelectedValue,
  addNewRoom,
  deleteRoom,
  updateParent,
  addSelectedValueOfParent,
  updateRoomPosition,
  updateCategoryName,
  addNewCategory,
  addRoomOnTop,
  addRoomAboveFromCurrent,
  addCategoryBelowFromCurrent,
  addCategoryAboveFromCurrent,
  replaceContextWithUpdatedOne,
  insertIds,
};

function updateCheckbox(dispatch, data) {
  dispatch({
    type: 'UPDATE_CHECKBOX',
    payload: data,
  });
}

function updateName(dispatch, data) {
  dispatch({
    type: 'UPDATE_NAME',
    payload: data,
  });
}

function updateMainCheckbox(dispatch, data) {
  dispatch({
    type: 'UPDATE_MAIN_CHECKBOX',
    payload: data,
  });
}

function loadRoomContext(dispatch, data) {
  dispatch({
    type: 'LOAD_ROOM_CONTEXT',
    payload: data,
  });
}

function addSelectedValue(dispatch, data) {
  dispatch({
    type: 'ADD_SELECTED_VALUE',
    payload: data,
  });
}

function addNewRoom(dispatch, data) {
  dispatch({
    type: 'ADD_NEW_ROOM',
    payload: data,
  });
}

function deleteRoom(dispatch, data) {
  dispatch({
    type: 'DELETE_ROOM',
    payload: data,
  });
}

function updateParent(dispatch, data) {
  dispatch({
    type: 'UPDATE_PARENT',
    payload: data,
  });
}

function addSelectedValueOfParent(dispatch, data) {
  dispatch({
    type: 'ADD_SELECTED_VALUE_OF_PARENT',
    payload: data,
  });
}

function updateRoomPosition(dispatch, data) {
  dispatch({
    type: 'UPDATE_ROOM_POSITION',
    payload: data,
  });
}

function addRoomOnTop(dispatch, data) {
  dispatch({
    type: 'ADD_ROOM_ON_TOP',
    payload: data,
  });
}

function updateCategoryName(dispatch, data) {
  dispatch({
    type: 'UPDATE_CATEGORY_NAME',
    payload: data,
  });
}

function addNewCategory(dispatch, data) {
  dispatch({
    type: 'ADD_NEW_CATEGORY',
    payload: data,
  });
}

function addRoomAboveFromCurrent(dispatch, data) {
  dispatch({
    type: 'ADD_ROOM_ABOVE_FROM_CURRENT',
    payload: data,
  });
}
function addCategoryBelowFromCurrent(dispatch, data) {
  dispatch({
    type: 'ADD_CATEGORY_BELOW_FROM_CURRENT',
    payload: data,
  });
}
function addCategoryAboveFromCurrent(dispatch, data) {
  dispatch({
    type: 'ADD_CATEGORY_ABOVE_FROM_CURRENT',
    payload: data,
  });
}
function replaceContextWithUpdatedOne(dispatch, data) {
  dispatch({
    type: 'REPLACE_CONTEXT_WITH_UPDATED_ONE',
    payload: data,
  });
}
function insertIds(dispatch, data) {
  dispatch({
    type: 'INSERT_IDS',
    payload: data,
  });
}
