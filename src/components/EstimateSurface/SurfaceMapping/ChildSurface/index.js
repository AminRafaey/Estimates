import React from 'react';
import makePure from 'recompose/pure';
import {
  AccordionDetails,
  Checkbox as MUICheckbox,
  MuiSwitch,
  Tooltip,
} from '../../../UI';
import { styled, Box, Typography } from '@material-ui/core';
import {
  getTotalCostOfSurface,
  getTotalHours,
} from '../../../EstimateSummary/utility';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../../Context/ProductContext';
import EditableNameField from '../EditableNameField';
import {
  countTrueAndFalseOnes,
  getAllLeafNodes,
  countIncludedRooms,
} from '../../index';
import { useRoomsState } from '../../../../Context/RoomSelectionContext';
import { cloneState } from '../../../EstimateProduct/stateClone';
import { useAppState } from '../../../../Context/AppContext';
import { getCheckboxState, getSurfaceSwitchStatus } from '../../utility';
import { AmntAndHrTyp } from '../SurfaceContainer';
const FasterCheckbox = makePure(MUICheckbox);
export const rowStyle = {
  display: 'table',
};

export const collapseLink = {
  lineHeight: '1',
};

export const leftSideeNav = {
  display: 'table-cell',
  minWidth: '385px',
  padding: '10px',
  background: '#ffff',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

export const colStyle = {
  display: 'table-cell',
  padding: '7px',
  textAlign: 'center',
  background: '#ffff',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const checboxCenter = {
  textAlign: 'center',
  verticalAlign: 'middle',
};

export const roomMinWidth = {
  minWidth: 120,
  width: 120,
  maxWidth: 120,
};

const childSurface = {
  background: '#f7fafc',
};

const ChildPadding = {
  padding: '10.5px',
  paddingRight: '10px',
};

const RowWrapper = styled(Box)({
  ...rowStyle,
});

const ColWrapper = styled(Box)({
  position: 'sticky',
  float: 'left',
  left: 0,
  zIndex: 1,
});

const SurfaceNameWrapper = styled(Box)({
  ...leftSideeNav,
  ...childSurface,
  ...collapseLink,
  ...ChildPadding,
  display: 'flex',
  alignItems: 'center',
});

const SurfaceNameTyp = styled(Typography)({
  fontSize: '15px',
  color: 'black',
});

const SurfaceSwitchWrapper = styled(Box)({
  marginLeft: 'auto',
});

const RenderChecboxWrapper = styled(Box)({
  ...colStyle,
  ...checboxCenter,
  ...roomMinWidth,
  '&:nth-child(odd)': {
    background: '#ffff',
  },
  '&:nth-child(even)': {
    background: '#f5f6f8',
  },
  height: 58,
  overflow: 'hidden',
});
const CheckboxParentWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
});
const LeftCheckboxWrapper = styled(Box)({
  display: 'inline',
});

const RightCheckWrapper = styled(Box)({
  display: 'inline',
});

const ChildSurface = ({
  showInclusion,
  showExclusion,
  showAmntAndHr,
  surface,
  rooms,
  rowsPadding,
  updateContext,
  surfaceSwitchAction,
}) => {
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();
  const renderChecboxes = (childSurface, roomParentId, roomId) => {
    let includedCheckboxState;
    let excludedCheckboxState;
    const allSelectedLeafNodes = getAllLeafNodes(childSurface).filter(
      (l) => l.newSurface.selected
    );
    const includedSelectedRooms = countIncludedRooms(appState);
    includedCheckboxState = getCheckboxState(
      appState,
      childSurface,
      'included',
      roomParentId,
      roomId,
      surface.id,
      childSurface.id
    );
    excludedCheckboxState = getCheckboxState(
      appState,
      childSurface,
      'excluded',
      roomParentId,
      roomId,
      surface.id,
      childSurface.id
    );
    return (
      <CheckboxParentWrapper>
        <LeftCheckboxWrapper
          style={{ ...(!showInclusion && { display: 'none' }) }}
        >
          <FasterCheckbox
            hidden={
              (childSurface.surfaces.length > 0 &&
                allSelectedLeafNodes.length < 1) ||
              includedSelectedRooms === 0
            }
            name={'included'}
            onChange={(e) =>
              updateContext(e, surface, childSurface, roomParentId, roomId)
            }
            checked={includedCheckboxState === 'checked' ? true : false}
            indeterminate={
              includedCheckboxState === 'intermediate' ? true : false
            }
          />
        </LeftCheckboxWrapper>
        <RightCheckWrapper
          style={{ ...(!showExclusion && { display: 'none' }) }}
        >
          <FasterCheckbox
            hidden={
              (childSurface.surfaces.length > 0 &&
                allSelectedLeafNodes.length < 1) ||
              includedSelectedRooms === 0
            }
            name={'excluded'}
            onChange={(e) =>
              updateContext(e, surface, childSurface, roomParentId, roomId)
            }
            checked={excludedCheckboxState === 'checked' ? true : false}
            indeterminate={
              excludedCheckboxState === 'intermediate' ? true : false
            }
          />
        </RightCheckWrapper>
      </CheckboxParentWrapper>
    );
  };
  return cloneState(surface.surfaces)
    .sort((a, b) =>
      a['position'] >= 0 && b['position'] >= 0
        ? a['position'] - b['position']
        : a['position'] >= 0
        ? -1
        : b['position'] >= 0
        ? 1
        : 0
    )
    .map((childSurface, index) => {
      if (!childSurface.selected) {
        switch (true) {
          case childSurface.surfaces && childSurface.surfaces.length < 1:
            return;
          default:
            if (countTrueAndFalseOnes(childSurface.surfaces).trueOnes === 0)
              return;
        }
      }
      const allSelectedLeafNodes = getAllLeafNodes(childSurface).filter(
        (l) => l.newSurface.selected
      );
      return (
        <React.Fragment key={childSurface.id + rowsPadding}>
          <AccordionDetails>
            <RowWrapper>
              <ColWrapper>
                <SurfaceNameWrapper
                  style={{
                    ...(((showInclusion && showExclusion) ||
                      (!showInclusion && !showExclusion) ||
                      (childSurface.surfaces.length > 0 &&
                        allSelectedLeafNodes.length < 1) ||
                      countIncludedRooms(appState) === 0) && {
                      padding: '19px 10px 19px',
                    }),
                  }}
                >
                  <EditableNameField
                    childSurface={childSurface}
                    rowsPadding={rowsPadding}
                  />

                  <SurfaceSwitchWrapper
                    hidden={
                      (childSurface.surfaces.length > 0 &&
                        allSelectedLeafNodes.length < 1) ||
                      countIncludedRooms(appState) === 0
                    }
                  >
                    {!(showInclusion && showExclusion) &&
                      !(!showInclusion && !showExclusion) && (
                        <MuiSwitch
                          onChange={(e) =>
                            surfaceSwitchAction(e, childSurface, surface)
                          }
                          checked={getSurfaceSwitchStatus(
                            appState,
                            showInclusion,
                            childSurface
                          )}
                        />
                      )}
                  </SurfaceSwitchWrapper>
                </SurfaceNameWrapper>
              </ColWrapper>

              {Object.keys(rooms).map((pKey) => {
                return Object.keys(rooms[pKey]['bedrooms']).map((key) => {
                  if (
                    !(
                      rooms[pKey]['bedrooms'][key]['included'] &&
                      rooms[pKey]['bedrooms'][key]['selected']
                    )
                  )
                    return;

                  if (showAmntAndHr) {
                    if (
                      childSurface.surfaces.length === 0 &&
                      getCheckboxState(
                        appState,
                        childSurface,
                        'included',
                        pKey,
                        key,
                        surface.id,
                        childSurface.id
                      ) === 'checked' &&
                      Object.entries(
                        appState[pKey]['bedrooms'][key]['surfaces'][surface.id][
                          'surfaces'
                        ][childSurface.id]['actions']
                      ).length > 0
                    ) {
                      const amountAndHour =
                        '$ ' +
                        getTotalCostOfSurface(
                          surfaceProductionRatesState,
                          productState,
                          appState,
                          pKey,
                          key,
                          surface.id,
                          childSurface.id,
                          appState[pKey]['bedrooms'][key]['surfaces'][
                            surface.id
                          ]['surfaces'][childSurface.id]['surface_id'],
                          appState[pKey]['bedrooms'][key]['surfaces'][
                            surface.id
                          ]['surfaces'][childSurface.id]['actions']
                        ).toFixed(2) +
                        ` (${getTotalHours(
                          pKey,
                          key,
                          surface.id,
                          childSurface.id,
                          appState[pKey]['bedrooms'][key]['surfaces'][
                            surface.id
                          ]['surfaces'][childSurface.id]['actions'],
                          appState[pKey]['bedrooms'][key]['surfaces'][
                            surface.id
                          ]['surfaces'][childSurface.id]['surface_id'],
                          appState,
                          surfaceProductionRatesState
                        ).toFixed(2)} Hours)`;
                      return (
                        <RenderChecboxWrapper
                          key={key + index + childSurface.id}
                        >
                          <Tooltip title={amountAndHour}>
                            <AmntAndHrTyp>{amountAndHour}</AmntAndHrTyp>
                          </Tooltip>
                        </RenderChecboxWrapper>
                      );
                    }
                    return (
                      <RenderChecboxWrapper
                        key={key + index + childSurface.id}
                      />
                    );
                  }

                  return (
                    <RenderChecboxWrapper key={key + index + childSurface.id}>
                      {renderChecboxes(childSurface, pKey, key)}
                    </RenderChecboxWrapper>
                  );
                });
              })}
            </RowWrapper>
          </AccordionDetails>
          {childSurface.surfaces && childSurface.surfaces.length ? (
            <ChildSurface
              showInclusion={showInclusion}
              showExclusion={showExclusion}
              showAmntAndHr={showAmntAndHr}
              surface={childSurface}
              rooms={rooms}
              rowsPadding={rowsPadding + 30}
              updateContext={updateContext}
              surfaceSwitchAction={surfaceSwitchAction}
            />
          ) : undefined}
        </React.Fragment>
      );
    });
};

export default ChildSurface;
