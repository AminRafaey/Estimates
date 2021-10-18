import React, { useState } from 'react';
import { styled, Box } from '@material-ui/core';
import { Accordion } from '../../../UI/Accordion/Accordion';
import { AccordionSummary } from '../../../UI/Accordion/AccordionSummary';
import { AccordionDetails } from '../../../UI/Accordion/AccordionDetails';
import { Alert as MuiAlert } from '@material-ui/lab';
import Table from './Table';
import PanelHeader from './PanelHeader';
import { IsSurfaceHasAnyCoatsAssociatedProd } from '../../utility';
import { useAppState } from '../../../../Context/AppContext';

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
  uniqueSurfaces,
  selectedActionId,
  surfaceId,
  parentSurfaceId,
  surface,
  bulkSelectionArr,
  setBulkSelectionArr,
  commonProducts,
  selectedToggle,
}) => {
  const [expandIcon, setExpandIcon] = useState('More');
  const [expanded, setExpanded] = useState(false);

  const [AccordionCommonProducts, setAccordionCommonProducts] = useState({});
  const [surfaceBulkSelectionArr, setSurfaceBulkSelectionArr] = useState([]);
  const appState = useAppState();
  return (
    <SelectionWrapper>
      <Accordion key={surfaceId} expanded={expanded} type={'controlled'}>
        <AccordionSummary
          className="scrollElement"
          style={{ overflowY: 'scroll' }}
        >
          <PanelHeader
            uniqueSurfaces={uniqueSurfaces}
            selectedActionId={selectedActionId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            surface={surface}
            expandIcon={expandIcon}
            setExpandIcon={setExpandIcon}
            setExpanded={setExpanded}
            bulkSelectionArr={bulkSelectionArr}
            setBulkSelectionArr={setBulkSelectionArr}
            AccordionCommonProducts={AccordionCommonProducts}
            setAccordionCommonProducts={setAccordionCommonProducts}
            surfaceBulkSelectionArr={surfaceBulkSelectionArr}
            setSurfaceBulkSelectionArr={setSurfaceBulkSelectionArr}
            commonProducts={commonProducts}
            selectedToggle={selectedToggle}
          />
        </AccordionSummary>
        <AccordionDetails>
          {Object.entries(surface['actions']).length < 1 ? (
            <Alert severity="warning">
              Please select actions to continue...
            </Alert>
          ) : (
            <LeafNodeWrapper>
              {selectedToggle === 'colors' &&
              !IsSurfaceHasAnyCoatsAssociatedProd(
                appState,
                parentSurfaceId,
                surfaceId,
                selectedActionId
              ) ? (
                <Alert severity="warning">
                  Please select Coats Associated product or enter coats to
                  continue...
                </Alert>
              ) : (
                <Table
                  uniqueSurfaces={uniqueSurfaces}
                  selectedActionId={selectedActionId}
                  parentSurfaceId={parentSurfaceId}
                  surfaceId={surfaceId}
                  bulkSelectionArr={bulkSelectionArr}
                  setBulkSelectionArr={setBulkSelectionArr}
                  commonProducts={commonProducts}
                  AccordionCommonProducts={AccordionCommonProducts}
                  setAccordionCommonProducts={setAccordionCommonProducts}
                  surfaceBulkSelectionArr={surfaceBulkSelectionArr}
                  setSurfaceBulkSelectionArr={setSurfaceBulkSelectionArr}
                  selectedToggle={selectedToggle}
                />
              )}
            </LeafNodeWrapper>
          )}
        </AccordionDetails>
      </Accordion>
    </SelectionWrapper>
  );
};
export default function Surface(props) {
  const {
    uniqueSurfaces,
    selectedActionId,
    parentSurfaceId,
    bulkSelectionArr,
    setBulkSelectionArr,
    commonProducts,
    selectedToggle,
  } = props;

  if (Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length < 1) {
    if (uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId])
      return (
        <ParentLessNodeWrapper>
          <Header
            uniqueSurfaces={uniqueSurfaces}
            selectedActionId={selectedActionId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={null}
            surface={uniqueSurfaces[parentSurfaceId]}
            bulkSelectionArr={bulkSelectionArr}
            setBulkSelectionArr={setBulkSelectionArr}
            commonProducts={commonProducts}
            selectedToggle={selectedToggle}
          />
        </ParentLessNodeWrapper>
      );
  }
  return (
    <SelectionWrapper>
      {Object.keys(uniqueSurfaces[parentSurfaceId]['surfaces']).map(
        (surfaceId, index) => {
          if (
            uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
              selectedActionId
            ]
          )
            return (
              <Header
                key={surfaceId}
                uniqueSurfaces={uniqueSurfaces}
                selectedActionId={selectedActionId}
                parentSurfaceId={parentSurfaceId}
                surfaceId={surfaceId}
                surface={uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]}
                bulkSelectionArr={bulkSelectionArr}
                setBulkSelectionArr={setBulkSelectionArr}
                commonProducts={commonProducts}
                selectedToggle={selectedToggle}
              />
            );
        }
      )}
    </SelectionWrapper>
  );
}
