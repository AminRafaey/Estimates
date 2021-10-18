import React, { useState } from 'react';
import { styled, Box } from '@material-ui/core';
import { Accordion } from '../../UI/Accordion/Accordion';
import { AccordionSummary } from '../../UI/Accordion/AccordionSummary';
import { AccordionDetails } from '../../UI/Accordion/AccordionDetails';
import { useAppState } from '../../../Context/AppContext';

import Table from './Table';
import PanelHeader from './PanelHeader';
import { Alert as MuiAlert } from '@material-ui/lab';
import {
  isAnyActionHasDimensions,
  IsActionHasAnyCoatsAssociatedProd,
} from '../utility';

const SelectionWrapper = styled(Box)({
  margin: 'auto',
  width: '100%',
});

const LeafNodeWrapper = styled(Box)({
  display: 'block',
  width: '100%',
});
const ParentLessNodeWrapper = styled(Box)({
  marginTop: -2,
});

const Alert = styled(MuiAlert)({
  margin: '30px auto 30px',
  maxWidth: 800,
});

const Header = ({
  parentRoomId,
  roomId,
  surfaceId,
  parentSurfaceId,
  surface,
  bulkSelectionArr,
  setBulkSelectionArr,
  commonProducts,
  selectedToggle,
  selectedActionId,
}) => {
  const [expandIcon, setExpandIcon] = useState('More');
  const [expanded, setExpanded] = useState(false);
  const appState = useAppState();
  const [AccordionCommonProducts, setAccordionCommonProducts] = useState([]);
  const [surfaceBulkSelectionArr, setSurfaceBulkSelectionArr] = useState([]);
  return (
    <SelectionWrapper>
      <Accordion key={roomId} expanded={expanded} type={'controlled'}>
        <AccordionSummary
          className="scrollElement"
          style={{ overflowY: 'scroll' }}
        >
          <PanelHeader
            parentRoomId={parentRoomId}
            roomId={roomId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            surface={surface}
            expandIcon={expandIcon}
            setExpandIcon={setExpandIcon}
            setExpanded={setExpanded}
            bulkSelectionArr={bulkSelectionArr}
            setBulkSelectionArr={setBulkSelectionArr}
            selectedToggle={selectedToggle}
            AccordionCommonProducts={AccordionCommonProducts}
            setAccordionCommonProducts={setAccordionCommonProducts}
            surfaceBulkSelectionArr={surfaceBulkSelectionArr}
            setSurfaceBulkSelectionArr={setSurfaceBulkSelectionArr}
            commonProducts={commonProducts}
            selectedActionId={selectedActionId}
          />
        </AccordionSummary>
        <AccordionDetails>
          {selectedToggle === 'colors' &&
          !IsActionHasAnyCoatsAssociatedProd(
            appState,
            parentRoomId,
            roomId,
            parentSurfaceId,
            surfaceId,
            selectedActionId
          ) ? (
            <Alert severity="warning">
              Please select Coats Associated product or enter coats to
              continue...
            </Alert>
          ) : (
            <LeafNodeWrapper>
              <Table
                parentRoomId={parentRoomId}
                roomId={roomId}
                parentSurfaceId={parentSurfaceId}
                surfaceId={surfaceId}
                bulkSelectionArr={bulkSelectionArr}
                setBulkSelectionArr={setBulkSelectionArr}
                commonProducts={commonProducts}
                selectedToggle={selectedToggle}
                AccordionCommonProducts={AccordionCommonProducts}
                setAccordionCommonProducts={setAccordionCommonProducts}
                surfaceBulkSelectionArr={surfaceBulkSelectionArr}
                setSurfaceBulkSelectionArr={setSurfaceBulkSelectionArr}
                selectedActionId={selectedActionId}
              />
            </LeafNodeWrapper>
          )}
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
    commonProducts,
    selectedToggle,
    selectedActionId,
  } = props;

  const appState = useAppState();
  if (
    Object.entries(
      appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ]
    ).length < 1
  ) {
    if (
      !appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'included'
      ] ||
      !(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ][selectedActionId] &&
        Object.entries(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][selectedActionId]['dimensions']
        ).length > 0
      )
    )
      return <React.Fragment key={parentSurfaceId + roomId + parentRoomId} />;

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
          commonProducts={commonProducts}
          selectedToggle={selectedToggle}
          selectedActionId={selectedActionId}
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
          ]['surfaces'][surfaceId]['included'] ||
          !(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][selectedActionId] &&
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][selectedActionId][
                'dimensions'
              ]
            ).length > 0
          )
        )
          return (
            <React.Fragment
              key={surfaceId + parentSurfaceId + roomId + parentRoomId}
            />
          );
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
            commonProducts={commonProducts}
            selectedToggle={selectedToggle}
            selectedActionId={selectedActionId}
          />
        );
      })}
    </SelectionWrapper>
  );
}
