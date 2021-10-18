import React, { useRef, useState } from 'react';
import { styled, Box } from '@material-ui/core';
import { Accordion } from '../../UI/Accordion/Accordion';
import { AccordionSummary } from '../../UI/Accordion/AccordionSummary';
import { AccordionDetails } from '../../UI/Accordion/AccordionDetails';
import { useAppState } from '../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { getMaxFieldCount } from '../utility';
import Table from './Table';
import PanelHeader from './PanelHeader';

const SelectionWrapper = styled(Box)({
  margin: 'auto',
  width: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
});

const LeafNodeWrapper = styled(Box)({
  display: 'block',
  width: '100%',
});
const ParentLessNodeWrapper = styled(Box)({
  marginTop: -2,
});

const Header = ({
  parentRoomId,
  roomId,
  surfaceId,
  parentSurfaceId,
  surface,
  bulkSelectionArr,
  setBulkSelectionArr,
  hourlyRate,
  surface_id,
  fieldsLinkingList,
  setFieldsLinkingList,
  addAllFieldsCurrentSID,
  setAddAllFieldsCurrentSID,
}) => {
  const [expandIcon, setExpandIcon] = useState('More');
  const [expanded, setExpanded] = useState(false);
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const appState = useAppState();
  const maxFieldCount = useRef(
    getMaxFieldCount(
      appState,
      surfaceProductionRatesState,
      parentRoomId,
      roomId
    )
  );
  return (
    <SelectionWrapper className="scrollElement">
      <Accordion
        key={roomId}
        expanded={expanded}
        type={'controlled'}
        style={{
          minWidth: 809 + maxFieldCount.current * 90,
          marginBottom: 1,
        }}
      >
        <AccordionSummary style={{ minWidth: '100%' }}>
          <PanelHeader
            parentRoomId={parentRoomId}
            roomId={roomId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            surface={surface}
            expandIcon={expandIcon}
            setExpandIcon={setExpandIcon}
            expanded={expanded}
            setExpanded={setExpanded}
            bulkSelectionArr={bulkSelectionArr}
            setBulkSelectionArr={setBulkSelectionArr}
            hourlyRate={hourlyRate}
            surface_id={surface_id}
            fieldsLinkingList={fieldsLinkingList}
            setFieldsLinkingList={setFieldsLinkingList}
            addAllFieldsCurrentSID={addAllFieldsCurrentSID}
            setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
            maxFieldCount={maxFieldCount.current}
          />
        </AccordionSummary>
        <AccordionDetails>
          <LeafNodeWrapper>
            {Object.keys(surface['actions']).find(
              (actionId) =>
                Object.entries(surface['actions'][actionId]['dimensions'])
                  .length > 0
            ) && (
              <Table
                parentRoomId={parentRoomId}
                roomId={roomId}
                parentSurfaceId={parentSurfaceId}
                surfaceId={surfaceId}
                surface_id={surface_id}
                hourlyRate={hourlyRate}
                maxFieldCount={maxFieldCount.current}
              />
            )}
          </LeafNodeWrapper>
        </AccordionDetails>
      </Accordion>
    </SelectionWrapper>
  );
};
export default function Surface(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    bulkSelectionArr,
    setBulkSelectionArr,
    hourlyRate,
    fieldsLinkingList,
    setFieldsLinkingList,
    addAllFieldsCurrentSID,
    setAddAllFieldsCurrentSID,
  } = props;
  const appState = useAppState();
  if (
    Object.entries(
      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ]
    ).length < 1
  ) {
    return (
      <ParentLessNodeWrapper>
        <Header
          parentRoomId={parentRoomId}
          roomId={roomId}
          parentSurfaceId={parentSurfaceId}
          surfaceId={null}
          surface={
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]
          }
          bulkSelectionArr={bulkSelectionArr}
          setBulkSelectionArr={setBulkSelectionArr}
          hourlyRate={hourlyRate}
          surface_id={
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surface_id']
          }
          fieldsLinkingList={fieldsLinkingList}
          setFieldsLinkingList={setFieldsLinkingList}
          addAllFieldsCurrentSID={addAllFieldsCurrentSID}
          setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
        />
      </ParentLessNodeWrapper>
    );
  }
  return (
    <SelectionWrapper>
      {Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ]
      ).map((surfaceId, index) => {
        if (
          !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['included']
        )
          return;
        return (
          <Header
            key={surfaceId + parentSurfaceId + roomId + parentRoomId}
            parentRoomId={parentRoomId}
            roomId={roomId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            surface={
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]
            }
            bulkSelectionArr={bulkSelectionArr}
            setBulkSelectionArr={setBulkSelectionArr}
            hourlyRate={hourlyRate}
            surface_id={
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['surface_id']
            }
            fieldsLinkingList={fieldsLinkingList}
            setFieldsLinkingList={setFieldsLinkingList}
            addAllFieldsCurrentSID={addAllFieldsCurrentSID}
            setAddAllFieldsCurrentSID={setAddAllFieldsCurrentSID}
          />
        );
      })}
    </SelectionWrapper>
  );
}
