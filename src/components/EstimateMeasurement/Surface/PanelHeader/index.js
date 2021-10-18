import React, { useState } from 'react';
import { styled, Box, Grid, Typography, TextField } from '@material-ui/core';
import AccordionArrowIcon from '../../../../resources/AccordionArrowIcon';
import {
  useAppState,
  useAppDispatch,
  updateSurfaceNameForSingleRoom,
} from '../../../../Context/AppContext';
import ActionSelect from '../../ActionSelect';
import { Checkbox as MUICheckbox } from '../../../UI';
import SurfaceFields from '../../SurfaceFields';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import SurfaceCost from '../../SurfaceFields/SurfaceCost';
const textFieldStyle = {
  background: '#ffff',
  width: 120,
};

const PHNameWrapper = styled(Box)({
  background: '#F7FAFC',
  padding: '8px',
  lineHeight: 0,
  display: 'flex',
  alignItems: 'center',
  borderWidth: '0px 1px 1px 1px',
  borderColor: '#E3E8EE',
  borderStyle: 'solid',
  minWidth: '100%',
});

const PHNameTyp = styled(Typography)({
  fontSize: 14,
  paddingRight: 8,
  wordBreak: 'break-word',
});
const NameWrapper = styled(Box)({
  display: 'flex',

  alignItems: 'center',

  height: '100%',
  minWidth: 200,
  maxWidth: 200,
});

const FieldWrapper = styled(Box)({
  paddingRight: 16,
  paddingBottom: 8,
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100%',
  display: 'flex',
  minWidth: 300,
  maxWidth: 300,
});

const FieldTyp = styled(Typography)({ fontSize: 14, paddingLeft: 4 });

const PanelWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
});
const ButtonWrapper = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
});

export default function PanelHeader({
  parentRoomId,
  roomId,
  parentSurfaceId,
  surfaceId,
  surface,
  expandIcon,
  setExpandIcon,
  setExpanded,
  bulkSelectionArr,
  setBulkSelectionArr,
  hourlyRate,
  surface_id,
  fieldsLinkingList,
  setFieldsLinkingList,
  addAllFieldsCurrentSID,
  setAddAllFieldsCurrentSID,
  maxFieldCount,
}) {
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const appDispatch = useAppDispatch();
  const [showEditableField, setShowEditableField] = useState(false);

  const handleOnBlurOfSurfaceNameField = (e) => {
    setShowEditableField(false);
    updateSurfaceNameForSingleRoom(appDispatch, {
      surfaceName: e.target.value,
      parentRoomId,
      roomId,
      parentSurfaceId,
      surfaceId,
    });
  };
  return (
    <PHNameWrapper
      style={{
        ...(Object.entries(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).length === 0 && { borderTop: '1px solid #E3E8EE' }),
      }}
    >
      <NameWrapper>
        <MUICheckbox
          style={{
            ...(Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces']
            ).length > 0 && { marginLeft: 20 }),
          }}
          checked={
            bulkSelectionArr.find(
              (b) =>
                b.parentRoomId == parentRoomId &&
                b.roomId == roomId &&
                b.parentSurfaceId == parentSurfaceId &&
                (surfaceId ? b.surfaceId == surfaceId : true)
            )
              ? true
              : false
          }
          onChange={(e) => {
            fieldsLinkingList.length > 0 && setFieldsLinkingList([]);
            e.target.checked
              ? setBulkSelectionArr([
                  ...bulkSelectionArr,
                  {
                    parentRoomId,
                    roomId,
                    parentSurfaceId,
                    surfaceId,
                    surface_id,
                  },
                ])
              : setBulkSelectionArr(
                  bulkSelectionArr.filter(
                    (b) =>
                      !(
                        JSON.stringify(b) ===
                        JSON.stringify({
                          parentRoomId,
                          roomId,
                          parentSurfaceId,
                          surfaceId,
                          surface_id,
                        })
                      )
                  )
                );
          }}
        />
        <Box width="100%">
          {showEditableField ? (
            <TextField
              autoFocus={true}
              style={{ ...textFieldStyle }}
              size="small"
              variant="outlined"
              defaultValue={surface.name}
              onBlur={handleOnBlurOfSurfaceNameField}
              onKeyUp={(e) =>
                e.key === 'Enter' && handleOnBlurOfSurfaceNameField(e)
              }
            />
          ) : (
            <PHNameTyp onClick={() => setShowEditableField(true)}>
              {`${surface.name} ${
                surface.name !== surface.actual_name && surface.actual_name
                  ? '(' + surface.actual_name + ')'
                  : ''
              }`}
            </PHNameTyp>
          )}
          <SurfaceCost
            parentRoomId={parentRoomId}
            roomId={roomId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            hourlyRate={hourlyRate}
            surface_id={surface_id}
            bulkSelectionArr={bulkSelectionArr}
            fieldsLinkingList={fieldsLinkingList}
            setFieldsLinkingList={setFieldsLinkingList}
            addAllFieldsCurrentSID={addAllFieldsCurrentSID}
            setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
            maxFieldCount={maxFieldCount}
          />
        </Box>
      </NameWrapper>

      <FieldWrapper>
        <FieldTyp>Select Actions:</FieldTyp>
        <Box
          style={{
            ...((surfaceId
              ? fieldsLinkingList.find((f) => f.surfaceId == surfaceId)
              : fieldsLinkingList.find(
                  (f) => f.surfaceId == parentSurfaceId
                )) &&
              (surfaceId
                ? fieldsLinkingList.find((f) => f.surfaceId == surfaceId)
                : fieldsLinkingList.find((f) => f.surfaceId == parentSurfaceId)
              ).numOfSelectedActions < 1 && {
                border: '1px dashed red',
                borderTop: '2px dashed red',
                borderRadius: 4,
              }),
          }}
        >
          <ActionSelect
            parentRoomId={parentRoomId}
            roomId={roomId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            surface_id={surface_id}
            fieldsLinkingList={fieldsLinkingList}
            setFieldsLinkingList={setFieldsLinkingList}
          />
        </Box>
      </FieldWrapper>

      <PanelWrapper>
        {surfaceProductionRatesState[surface_id] && (
          <SurfaceFields
            parentRoomId={parentRoomId}
            roomId={roomId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            hourlyRate={hourlyRate}
            surface_id={surface_id}
            bulkSelectionArr={bulkSelectionArr}
            fieldsLinkingList={fieldsLinkingList}
            setFieldsLinkingList={setFieldsLinkingList}
            addAllFieldsCurrentSID={addAllFieldsCurrentSID}
            setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
            maxFieldCount={maxFieldCount}
          />
        )}
      </PanelWrapper>

      <ButtonWrapper>
        <Box
          hidden={
            Object.keys(surface['actions']).find(
              (actionId) =>
                Object.entries(surface['actions'][actionId]['dimensions'])
                  .length > 0
            )
              ? false
              : true
          }
          onClick={() => {
            setExpanded(expandIcon === 'More' ? true : false);
            expandIcon === 'More'
              ? setExpandIcon('Less')
              : setExpandIcon('More');
          }}
        >
          <AccordionArrowIcon iconType={expandIcon} />
        </Box>
      </ButtonWrapper>
    </PHNameWrapper>
  );
}
