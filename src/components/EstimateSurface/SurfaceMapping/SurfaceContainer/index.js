import React, { useState } from 'react';
import makePure from 'recompose/pure';
import {
  Accordion,
  AccordionSummary,
  Checkbox as MUICheckbox,
  MuiSwitch,
} from '../../../UI';
import {
  getTotalCostOfSurface,
  getTotalHours,
} from '../../../EstimateSummary/utility';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../../Context/ProductContext';
import { styled, Box, Typography, TextField } from '@material-ui/core';
import AccordionArrow from '../../../../resources/AccordionArrowIcon';
import ChildSurface from '../ChildSurface';
import AccordionSelect from '../AccordionSelect';
import {
  useSurfaceSelectionDispatch,
  updateSurfaceName,
} from '../../../../Context/SurfaceSelectionContext';
import {
  countTrueAndFalseOnes,
  getAllLeafNodes,
  countIncludedRooms,
} from '../../index';
import {
  useAppState,
  useAppDispatch,
  updateSurfaceNameForAllRooms,
} from '../../../../Context/AppContext';
import { getCheckboxState, getSurfaceSwitchStatus } from '../../utility';
import { Tooltip } from '../../../UI';
const FasterCheckbox = makePure(MUICheckbox);
export const rowStyle = {
  display: 'table',
};
const textFieldStyle = {
  background: '#ffff',
};
export const leftSideeNav = {
  display: 'table-cell',
  minWidth: '385px',
  padding: '13px',
  background: '#ffff',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};
export const collapseLink = {
  lineHeight: '0',
};
export const AlignCenterWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});
const CollapseBtn = styled(Box)({
  display: 'flex',
  fontFamily: 'Medium',
  alignItems: 'center',
});
export const colStyle = {
  display: 'table-cell',
  padding: '7px',
  textAlign: 'center',
  background: '#ffff',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};
export const checboxCenter = {
  textAlign: 'center',
  verticalAlign: 'middle',
};
const roomMinWidth = {
  minWidth: 120,
  width: 120,
  maxWidth: 120,
};
export const RowWrapper = styled(Box)({
  ...rowStyle,
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
export const ColWrapper = styled(Box)({
  position: 'sticky',
  float: 'left',
  left: 0,
  zIndex: 1,
});

export const PanelInnerWrapper = styled(Box)({
  ...leftSideeNav,
  ...collapseLink,
});
export const AmntAndHrTyp = styled(Typography)({
  display: '-webkit-box',
  '-webkit-line-clamp': 2,
  '-webkit-box-orient': 'vertical',
  fontSize: 13,
});
const NameTyp = styled(Typography)({
  fontSize: '15px',
  fontFamily: 'Medium',
  color: 'black',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});

const HideSurfaceTyp = styled(Typography)({
  fontSize: 13,
  marginTop: 5,
  display: 'inline-block',
  color: '#76b9fd',
  fontFamily: 'Medium',
  lineHeight: '0.2',
});

const HideSurfaceWrapper = styled(Box)({
  width: 130,
  display: 'flex',
  justifyContent: 'flex-end',
});

const PHSwitchWrapper = styled(Box)({
  float: 'right',
  display: 'flex',
});

export const RenderCheckboxWrapper = styled(Box)({
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
export default function SurfaceContainer(props) {
  const {
    surfaceCategroy,
    showInclusion,
    showExclusion,
    showAmntAndHr,
    updateContext,
    surfaceSwitchAction,
  } = props;

  const [openSelectSurface, setOpenSelectSurface] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [expandIcon, setExpandIcon] = useState('Less');
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const surfaceSelectionDispatch = useSurfaceSelectionDispatch();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();
  const allSelectedLeafNodes = getAllLeafNodes(surfaceCategroy).filter(
    (l) => l.newSurface.selected
  );

  const PanelHeader = (surfaceCategroy, appState) => {
    const [showEditableField, setShowEditableField] = useState(false);

    const handleOnBlurOfSurfaceNameField = (e) => {
      updateSurfaceName(surfaceSelectionDispatch, {
        surfaceId: surfaceCategroy.id,
        surfaceName: e.target.value,
      });
      setShowEditableField(false);
      updateSurfaceNameForAllRooms(appDispatch, {
        surfaceId: surfaceCategroy.id,
        surfaceName: e.target.value,
      });
    };
    return (
      <React.Fragment>
        <RowWrapper>
          <ColWrapper>
            <PanelInnerWrapper
              style={{
                ...(((showInclusion && showExclusion) ||
                  (!showInclusion && !showExclusion) ||
                  (surfaceCategroy.surfaces.length > 0 &&
                    allSelectedLeafNodes.length < 1) ||
                  surfaceCategroy.surfaces.length < 1 ||
                  countIncludedRooms(appState) === 0) &&
                  !openSelectSurface && {
                    padding: '18px 13px 18px',
                  }),
              }}
            >
              <AlignCenterWrapper>
                {showEditableField ? (
                  <TextField
                    autoFocus={true}
                    style={{ ...textFieldStyle, width: 120 }}
                    size="small"
                    variant="outlined"
                    defaultValue={surfaceCategroy.name}
                    onBlur={handleOnBlurOfSurfaceNameField}
                    onKeyUp={(e) =>
                      e.key === 'Enter' && handleOnBlurOfSurfaceNameField(e)
                    }
                  />
                ) : (
                  <NameTyp
                    onClick={() => setShowEditableField(true)}
                    style={{
                      ...(openSelectSurface ? { width: 50 } : { width: 120 }),
                    }}
                  >
                    {surfaceCategroy.name}
                  </NameTyp>
                )}
                {openSelectSurface
                  ? Object.entries(surfaceCategroy.surfaces).length > 0 && (
                      <HideSurfaceWrapper style={{ width: '100%' }}>
                        <AccordionSelect
                          estimateSurface={surfaceCategroy.surfaces}
                          openSelectSurface={openSelectSurface}
                          setOpenSelectSurface={setOpenSelectSurface}
                          setExpanded={setExpanded}
                          setExpandIcon={setExpandIcon}
                          expanded={expanded}
                        />
                      </HideSurfaceWrapper>
                    )
                  : Object.entries(surfaceCategroy.surfaces).length > 0 && (
                      <HideSurfaceWrapper>
                        <HideSurfaceTyp
                          onClick={() => setOpenSelectSurface(true)}
                        >
                          Select sub surfaces
                        </HideSurfaceTyp>
                      </HideSurfaceWrapper>
                    )}

                <PHSwitchWrapper
                  onClick={(event) => event.stopPropagation()}
                  hidden={
                    surfaceCategroy.surfaces.length > 0 &&
                    allSelectedLeafNodes.length < 1
                  }
                >
                  {!(showInclusion && showExclusion) &&
                    !(!showInclusion && !showExclusion) && (
                      <MuiSwitch
                        onChange={(e) =>
                          surfaceSwitchAction(e, surfaceCategroy)
                        }
                        checked={getSurfaceSwitchStatus(
                          appState,
                          showInclusion,
                          surfaceCategroy
                        )}
                      />
                    )}
                  <CollapseBtn
                    onClick={() => {
                      setExpanded(expandIcon === 'More' ? true : false);
                      expandIcon === 'More'
                        ? setExpandIcon('Less')
                        : setExpandIcon('More');
                    }}
                    hidden={
                      surfaceCategroy.surfaces.length == 0 ||
                      (surfaceCategroy.surfaces.length > 0 &&
                        countTrueAndFalseOnes(surfaceCategroy.surfaces)
                          .trueOnes < 1)
                    }
                  >
                    <AccordionArrow iconType={expandIcon} />
                  </CollapseBtn>
                </PHSwitchWrapper>
              </AlignCenterWrapper>
            </PanelInnerWrapper>
          </ColWrapper>

          {Object.keys(appState).map((Pkey) => {
            return Object.keys(appState[Pkey]['bedrooms']).map((key, index) => {
              if (
                !(
                  appState[Pkey]['bedrooms'][key]['included'] &&
                  appState[Pkey]['bedrooms'][key]['selected']
                )
              )
                return;
              if (showAmntAndHr) {
                if (
                  surfaceCategroy.surfaces.length === 0 &&
                  getCheckboxState(
                    appState,
                    surfaceCategroy,
                    'included',
                    Pkey,
                    key
                  ) === 'checked' &&
                  Object.entries(
                    appState[Pkey]['bedrooms'][key]['surfaces'][
                      surfaceCategroy.id
                    ]['actions']
                  ).length > 0
                ) {
                  const amountAndHour =
                    '$ ' +
                    getTotalCostOfSurface(
                      surfaceProductionRatesState,
                      productState,
                      appState,
                      Pkey,
                      key,
                      surfaceCategroy.id,
                      undefined,
                      appState[Pkey]['bedrooms'][key]['surfaces'][
                        surfaceCategroy.id
                      ]['surface_id'],
                      appState[Pkey]['bedrooms'][key]['surfaces'][
                        surfaceCategroy.id
                      ]['actions']
                    ).toFixed(2) +
                    ` (${getTotalHours(
                      Pkey,
                      key,
                      surfaceCategroy.id,
                      undefined,
                      appState[Pkey]['bedrooms'][key]['surfaces'][
                        surfaceCategroy.id
                      ]['actions'],
                      appState[Pkey]['bedrooms'][key]['surfaces'][
                        surfaceCategroy.id
                      ]['surface_id'],
                      appState,
                      surfaceProductionRatesState
                    ).toFixed(2)} Hours)`;
                  return (
                    <RenderCheckboxWrapper
                      onClick={(event) => event.stopPropagation()}
                      key={key + index + surfaceCategroy.id}
                    >
                      <Tooltip title={amountAndHour}>
                        <AmntAndHrTyp>{amountAndHour}</AmntAndHrTyp>
                      </Tooltip>
                    </RenderCheckboxWrapper>
                  );
                }

                return (
                  <RenderCheckboxWrapper
                    onClick={(event) => event.stopPropagation()}
                    key={key + index + surfaceCategroy.id}
                  />
                );
              }
              return (
                <RenderCheckboxWrapper
                  onClick={(event) => event.stopPropagation()}
                  key={key + index + surfaceCategroy.id}
                >
                  {renderChecboxes(surfaceCategroy, Pkey, key)}
                </RenderCheckboxWrapper>
              );
            });
          })}
        </RowWrapper>
      </React.Fragment>
    );
  };

  const renderChecboxes = (surface, roomParentId, roomId) => {
    let includedCheckboxState;
    let excludedCheckboxState;
    const includedSelectedRooms = countIncludedRooms(appState);
    includedCheckboxState = getCheckboxState(
      appState,
      surface,
      'included',
      roomParentId,
      roomId
    );
    excludedCheckboxState = getCheckboxState(
      appState,
      surface,
      'excluded',
      roomParentId,
      roomId
    );
    return (
      <CheckboxParentWrapper>
        <LeftCheckboxWrapper
          style={{ ...(!showInclusion && { display: 'none' }) }}
        >
          <FasterCheckbox
            hidden={
              (surface.surfaces.length > 0 &&
                allSelectedLeafNodes.length < 1) ||
              includedSelectedRooms === 0
            }
            name={'included'}
            onChange={(e) => {
              includedCheckboxState === 'intermediate' &&
                (e.target.checked = false);
              updateContext(e, {}, surface, roomParentId, roomId);
            }}
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
              (surface.surfaces.length > 0 &&
                allSelectedLeafNodes.length < 1) ||
              includedSelectedRooms === 0
            }
            name={'excluded'}
            onChange={(e) => {
              excludedCheckboxState === 'intermediate' &&
                (e.target.checked = false);
              updateContext(e, {}, surface, roomParentId, roomId);
            }}
            checked={excludedCheckboxState === 'checked' ? true : false}
            indeterminate={
              excludedCheckboxState === 'intermediate' ? true : false
            }
          />
        </RightCheckWrapper>
      </CheckboxParentWrapper>
    );
  };

  return (
    <Accordion type={'controlled'} expanded={expanded}>
      <AccordionSummary>
        {PanelHeader(surfaceCategroy, appState)}
      </AccordionSummary>
      <ChildSurface
        showInclusion={showInclusion}
        showExclusion={showExclusion}
        showAmntAndHr={showAmntAndHr}
        surface={surfaceCategroy}
        rooms={appState}
        rowsPadding={20}
        updateContext={updateContext}
        surfaceSwitchAction={surfaceSwitchAction}
      />
    </Accordion>
  );
}
