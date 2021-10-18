import React, { useEffect, useState } from 'react';
import makePure from 'recompose/pure';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Checkbox as MUICheckbox, MuiSwitch, AbsoluteScroll } from '../../UI';
import {
  styled,
  Box,
  Typography,
  FormControlLabel,
  Button,
  withStyles,
} from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import SurfaceMultiSelect from './SurfaceMultiSelect';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useSurfaceSelectionState } from '../../../Context/SurfaceSelectionContext';
import { cloneState } from '../../EstimateProduct/stateClone';
import {
  useAppState,
  useAppDispatch,
  updateApp,
  updateParentLessNode,
} from '../../../Context/AppContext';
import { countTrueAndFalseOnes, getAllLeafNodes } from '../index';
import SurfaceContainer, {
  AlignCenterWrapper,
  RenderCheckboxWrapper,
  PanelInnerWrapper,
  RowWrapper,
  ColWrapper,
} from './SurfaceContainer';
import {
  getHierarchy,
  getRoomSwitchStatus,
  getAllAncesstorIds,
  countIncluded,
  getDataFromHash,
} from '../utility';
import { useSessionDispatch } from '../../../Context/Session';
const FasterCheckbox = makePure(MUICheckbox);
const roomMinWidth = {
  minWidth: 120,
  width: 120,
  maxWidth: 120,
};

export const rowStyle = {
  display: 'table',
};
export const colStyle = {
  display: 'table-cell',
  padding: '11px',
  textAlign: 'center',
  background: '#ffff',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const mappingOption = {
  fontSize: '13px',
};

const RoomHeaderWrapper = styled(Box)({
  padding: '5px',
});

const IncludeWrapper = styled(Box)({
  float: 'left',
  color: '#9b9d9f',
  fontSize: '10px',
});
const SaveSurfacesWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '40px 0px',
  marginRight: 95,
});
const ExcludeWrapper = styled(Box)({
  float: 'right',
  color: '#9b9d9f',
  fontSize: '10px',
});

const OptionsWrapper = styled(Box)({
  marginTop: '50px',
  marginRight: '90px',
  marginBottom: '20px',
  display: 'flex',
  justifyContent: 'flex-end',
});

const OptionsTyp = styled(Typography)({
  ...mappingOption,
  color: 'black',
});

const ASRowWrapper = styled(Box)({
  ...rowStyle,
});

const DefaultRoomWrapper = styled(Box)({
  minWidth: '385px',
  display: 'table-cell',
  position: 'sticky',
  left: 0,
  zIndex: 1,
  backgroundColor: 'rgb(233, 238, 245)',
});

const CSCheckboxWrapper = styled(Box)({
  ...colStyle,
  ...roomMinWidth,
  verticalAlign: 'bottom',
  '&:nth-child(odd)': {
    background: '#ffff',
  },
  '&:nth-child(even)': {
    background: '#f5f6f8',
  },
});

const CSNameTyp = styled(Typography)({
  fontSize: '13px',
  maxWidth: '125px',
  lineHeight: '1.2',
  fontFamily: 'Medium',
  color: 'black',
  wordBreak: 'break-word',
});

const CSSwitchWrapper = styled(Box)({});

const DropdownWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginRight: 95,
});

const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});
const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);
function SurfaceMapping(props) {
  const [showInclusion, setShowInclusion] = useState(true);
  const [showExclusion, setShowExclusion] = useState(false);
  const [showAmntAndHr, setShowAmntAndHr] = useState(false);

  const estimateSurface = useSurfaceSelectionState();

  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const surfaceProductionRatesState = useSurfaceProductionRatesState();

  const updateContext = (
    checkboxEvent,
    parentSurface,
    childSurface,
    roomParentId,
    roomId
  ) => {
    const checkboxName = checkboxEvent.target.name;
    const checkboxValue = checkboxEvent.target.checked;
    if (childSurface.surfaces && childSurface.surfaces.length < 1) {
      if (childSurface.parent_id) {
        const { id, name, selected, surface_id } = childSurface;
        const newSurface = {
          name,
          included: false,
          excluded: false,
          selected,
          surface_id,
          [checkboxName]: checkboxValue,
          ...(checkboxValue &&
            (checkboxName === 'included'
              ? { excluded: !checkboxValue }
              : { included: !checkboxValue })),
        };
        updateApp(appDispatch, {
          parentSurface: parentSurface,
          hierarchy: getHierarchy(estimateSurface, parentSurface.id)
            .hierarchy.reverse()
            .join(' > '),
          newSurfaceId: id,
          newSurface: newSurface,
          parentRoomId: roomParentId,
          roomId: roomId,
          checkboxName: checkboxName,
          allAncesstorIds: getAllAncesstorIds(estimateSurface, parentSurface.id)
            .hierarchy,
          defaultActions: getSurfaceDefaultActions(surface_id),
        });
      } else {
        const { id, name, selected, surface_id } = childSurface;

        const newSurface = {
          id,
          name,
          surface_id,
          included: false,
          excluded: false,
          selected,
          [checkboxName]: checkboxValue,
          ...(checkboxValue &&
            (checkboxName === 'included'
              ? { excluded: !checkboxValue }
              : { included: !checkboxValue })),
        };

        updateParentLessNode(appDispatch, {
          parentSurface: newSurface,
          parentRoomId: roomParentId,
          roomId: roomId,
          defaultActions: getSurfaceDefaultActions(surface_id),
        });
      }
    } else {
      const newSurfacesArr = getAllLeafNodes(childSurface).filter(
        (l) => l.newSurface.selected
      );
      for (let c1 = 0; c1 < newSurfacesArr.length; c1++) {
        const { parentSurface } = newSurfacesArr[c1];
        const { id, ...newSurface } = newSurfacesArr[c1].newSurface;

        const included = getDataFromHash(appState, [
          roomParentId,
          'bedrooms',
          roomId,
          'surfaces',
          parentSurface.id,
          'surfaces',
          id,
          'included',
        ]);
        const excluded = getDataFromHash(appState, [
          roomParentId,
          'bedrooms',
          roomId,
          'surfaces',
          parentSurface.id,
          'surfaces',
          id,
          'excluded',
        ]);
        updateApp(appDispatch, {
          parentSurface: parentSurface,
          hierarchy: getHierarchy(estimateSurface, parentSurface.id)
            .hierarchy.reverse()
            .join(' > '),
          newSurfaceId: id,
          newSurface: {
            ...newSurface,
            included: included ? included : false,
            excluded: excluded ? excluded : false,
            [checkboxName]: checkboxValue,
            ...(checkboxValue &&
              (checkboxName === 'included'
                ? { excluded: !checkboxValue }
                : { included: !checkboxValue })),
          },
          parentRoomId: roomParentId,
          roomId: roomId,
          checkboxName: checkboxName,
          allAncesstorIds: getAllAncesstorIds(estimateSurface, parentSurface.id)
            .hierarchy,
          defaultActions: getSurfaceDefaultActions(newSurface.surface_id),
        });
      }
    }
  };

  const getSurfaceDefaultActions = (id) => {
    const defaultActions = {};

    if (surfaceProductionRatesState[id]) {
      Object.keys(surfaceProductionRatesState[id]['default_actions']).map(
        (actionId) => {
          const action =
            surfaceProductionRatesState[id]['default_actions'][actionId];

          defaultActions[actionId] = {
            name: action.name,
            selected: true,
            ...(surfaceProductionRatesState[id]['surface_production_rates'][
              actionId
            ]['no_of_coats'] && {
              no_of_coats:
                surfaceProductionRatesState[id]['surface_production_rates'][
                  actionId
                ]['no_of_coats'],
            }),
            dimensions: {},
          };
        }
      );
    }
    return defaultActions;
  };

  const allSelectedLeafNodes = getAllLeafNodes({
    id: null,
    surfaces: estimateSurface,
  }).filter((l) => l['newSurface']['selected']);

  // takes array of indeces in args and let you know if value exists in obj. Return value or undifned.

  const PanelHeader = (appState) => {
    return (
      <RowWrapper>
        <ColWrapper>
          <PanelInnerWrapper>
            <AlignCenterWrapper>
              <SurfaceMultiSelect width={'358px'} />
            </AlignCenterWrapper>
          </PanelInnerWrapper>
        </ColWrapper>

        {Object.keys(appState).map((Pkey) => {
          return Object.keys(appState[Pkey]['bedrooms']).map((key) => {
            if (
              !(
                appState[Pkey]['bedrooms'][key]['included'] &&
                appState[Pkey]['bedrooms'][key]['selected']
              )
            )
              return;
            return (
              <RenderCheckboxWrapper key={key}>
                <Box />
              </RenderCheckboxWrapper>
            );
          });
        })}
      </RowWrapper>
    );
  };

  const renderRoomHeader = () => {
    if (showInclusion == true && showExclusion == true) {
      return (
        <RoomHeaderWrapper>
          <IncludeWrapper>Include</IncludeWrapper>
          <ExcludeWrapper>Exclude</ExcludeWrapper>
        </RoomHeaderWrapper>
      );
    } else {
      return <Box />;
    }
  };

  const surfaceSwitchAction = (
    switchEvent,
    surfaceCategroy,
    parentSurface = null
  ) => {
    Object.keys(appState).map((Pkey) => {
      return Object.keys(appState[Pkey]['bedrooms']).map((key, index) => {
        if (
          !(
            appState[Pkey]['bedrooms'][key]['included'] &&
            appState[Pkey]['bedrooms'][key]['selected']
          )
        )
          return;
        if (surfaceCategroy.surfaces.length < 1) {
          surfaceCategroy.parent_id
            ? updateContext(
                {
                  target: {
                    name: showInclusion ? 'included' : 'excluded',
                    checked: switchEvent.target.checked,
                  },
                },
                parentSurface,
                surfaceCategroy,
                Pkey,
                key
              )
            : updateContext(
                {
                  target: {
                    name: showInclusion ? 'included' : 'excluded',
                    checked: switchEvent.target.checked,
                  },
                },
                {},
                surfaceCategroy,
                Pkey,
                key
              );
        }
        const leafNodes = getAllLeafNodes(surfaceCategroy).filter(
          (l) => l['newSurface']['selected']
        );

        leafNodes.map((l) =>
          updateContext(
            {
              target: {
                name: showInclusion ? 'included' : 'excluded',
                checked: switchEvent.target.checked,
              },
            },
            l['parentSurface'].id ? l['parentSurface'] : {},
            { ...l['newSurface'], surfaces: [] },
            Pkey,
            key
          )
        );
      });
    });
  };

  const RoomSwitchAction = (roomSwitchEvent, parentRoomId, roomId) => {
    const switchStatus = roomSwitchEvent.target.checked;
    allSelectedLeafNodes.map((l) =>
      updateContext(
        {
          target: {
            name: showInclusion ? 'included' : 'excluded',
            checked: switchStatus,
          },
        },
        l['parentSurface'].id ? l['parentSurface'] : {},
        { ...l['newSurface'], surfaces: [] },
        parentRoomId,
        roomId
      )
    );
  };

  if (countIncluded(appState) === 0) {
    return <Alert severity="warning">Please select rooms to continue...</Alert>;
  }
  return (
    <React.Fragment>
      <DropdownWrapper>
        <SurfaceMultiSelect type={'Header'} />
      </DropdownWrapper>

      <div>
        <OptionsWrapper>
          <FormControlLabel
            control={
              <FasterCheckbox
                checked={showInclusion}
                onChange={(e) => {
                  setShowInclusion(e.target.checked);
                  e.target.checked &&
                    showAmntAndHr &&
                    setShowAmntAndHr(!e.target.checked);
                  !e.target.checked &&
                    !showExclusion &&
                    setShowAmntAndHr(!e.target.checked);
                }}
              />
            }
            label={<OptionsTyp>Inclusion</OptionsTyp>}
          />
          <FormControlLabel
            control={
              <FasterCheckbox
                checked={showExclusion}
                onChange={(e) => {
                  setShowExclusion(e.target.checked);

                  e.target.checked &&
                    showAmntAndHr &&
                    setShowAmntAndHr(!e.target.checked);
                  !e.target.checked &&
                    !showInclusion &&
                    setShowAmntAndHr(!e.target.checked);
                }}
              />
            }
            label={<OptionsTyp>Exclusion</OptionsTyp>}
          />

          <FormControlLabel
            control={
              <FasterCheckbox
                checked={showAmntAndHr}
                onChange={(e) => {
                  setShowAmntAndHr(e.target.checked);
                  e.target.checked &&
                    showInclusion &&
                    setShowInclusion(!e.target.checked);
                  e.target.checked &&
                    showExclusion &&
                    setShowExclusion(!e.target.checked);
                  !e.target.checked && setShowInclusion(!e.target.checked);
                }}
              />
            }
            label={<OptionsTyp>Show Amounts & Hours</OptionsTyp>}
          />
        </OptionsWrapper>
      </div>

      <AbsoluteScroll>
        <div>
          <ASRowWrapper>
            <DefaultRoomWrapper></DefaultRoomWrapper>

            {Object.keys(appState).map((Pkey) => {
              return Object.keys(appState[Pkey]['bedrooms']).map(
                (key, index) => {
                  if (
                    !(
                      appState[Pkey]['bedrooms'][key]['included'] &&
                      appState[Pkey]['bedrooms'][key]['selected']
                    )
                  )
                    return;
                  return (
                    <CSCheckboxWrapper key={key}>
                      <CSNameTyp>
                        {appState[Pkey]['bedrooms'][key]['name']}
                      </CSNameTyp>

                      <CSSwitchWrapper
                        style={{
                          ...(allSelectedLeafNodes.length < 1 && {
                            visibility: 'hidden',
                          }),
                        }}
                      >
                        {!(showInclusion && showExclusion) &&
                          !(!showInclusion && !showExclusion) && (
                            <MuiSwitch
                              onChange={(e) => RoomSwitchAction(e, Pkey, key)}
                              checked={getRoomSwitchStatus(
                                appState,
                                allSelectedLeafNodes,
                                showInclusion,
                                Pkey,
                                key
                              )}
                            />
                          )}
                      </CSSwitchWrapper>
                      {renderRoomHeader()}
                    </CSCheckboxWrapper>
                  );
                }
              );
            })}
          </ASRowWrapper>
        </div>
        <Box>
          {PanelHeader(appState)}

          {cloneState(estimateSurface)
            .sort((a, b) =>
              a['position'] >= 0 && b['position'] >= 0
                ? a['position'] - b['position']
                : a['position'] >= 0
                ? -1
                : b['position'] >= 0
                ? 1
                : 0
            )
            .map((surfaceCategroy, index) => {
              if (!surfaceCategroy.selected) {
                switch (true) {
                  case surfaceCategroy.surfaces &&
                    surfaceCategroy.surfaces.length < 1:
                    return;
                  default:
                    if (
                      countTrueAndFalseOnes(surfaceCategroy.surfaces)
                        .trueOnes === 0
                    )
                      return;
                }
              }
              return (
                <SurfaceContainer
                  key={index}
                  surfaceCategroy={surfaceCategroy}
                  showInclusion={showInclusion}
                  showExclusion={showExclusion}
                  showAmntAndHr={showAmntAndHr}
                  updateContext={updateContext}
                  surfaceSwitchAction={surfaceSwitchAction}
                />
              );
            })}
        </Box>
      </AbsoluteScroll>
      <SaveSurfacesWrapper>
        <Link
          to={{ pathname: `/estimates/measurements`, prevPath: 'surfaces' }}
        >
          <StyledButton size="large" color="primary" variant="contained">
            Save And Continue
          </StyledButton>
        </Link>
      </SaveSurfacesWrapper>
    </React.Fragment>
  );
}

SurfaceMapping.defaultProps = {};

SurfaceMapping.propTypes = {
  estimateSurface: PropTypes.array,
};

export default SurfaceMapping;
