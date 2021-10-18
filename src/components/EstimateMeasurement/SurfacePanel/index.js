import React, { useEffect, useState } from 'react';
import { styled, Box } from '@material-ui/core';
import Surface from '../Surface';
import { useAppState } from '../../../Context/AppContext';
import ParentSurface from '../ParentSurface';

const SelectionWrapper = styled(Box)({
  margin: 'auto',
  paddingTop: '35px',
});

export default function SurfacePanel(props) {
  const {
    selectedRoom,
    bulkSelectionArr,
    setBulkSelectionArr,
    hourlyRate,
    fieldsLinkingList,
    setFieldsLinkingList,
  } = props;
  const appState = useAppState();
  const [addAllFieldsCurrentSID, setAddAllFieldsCurrentSID] = useState(null);

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
              hourlyRate={hourlyRate}
              fieldsLinkingList={fieldsLinkingList}
              setFieldsLinkingList={setFieldsLinkingList}
              addAllFieldsCurrentSID={addAllFieldsCurrentSID}
              setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
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
          )
        ) {
          return (
            <ParentSurface
              key={index}
              parentSurfaceId={parentSurfaceId}
              bulkSelectionArr={bulkSelectionArr}
              setBulkSelectionArr={setBulkSelectionArr}
              selectedRoom={selectedRoom}
              index={index}
              hourlyRate={hourlyRate}
              fieldsLinkingList={fieldsLinkingList}
              setFieldsLinkingList={setFieldsLinkingList}
              addAllFieldsCurrentSID={addAllFieldsCurrentSID}
              setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
            />
          );
        }
      })}
    </SelectionWrapper>
  );
}
