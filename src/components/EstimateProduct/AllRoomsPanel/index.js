import React, { useState, useEffect } from 'react';
import SurfacePanel from './SurfacePanel';
import { cloneState } from '../stateClone';
import { Checkbox } from '../../UI';
import { Alert as MuiAlert } from '@material-ui/lab';
import {
  Grid,
  styled,
  Box,
  Typography,
  withStyles,
  CircularProgress,
} from '@material-ui/core';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useAppState } from '../../../Context/AppContext';

import {
  isAnyRoomHasAnyIncludedSurface,
  handleAllSUrfacesChange,
  getUniqueSurfaces,
  getAllActionFromApp,
} from '../utility';
import { StyledToggleButton } from '../index';

const RoomWrapper = styled(Box)({});
export const headingStyling = {
  fontSize: '14px',
};

const Heading = styled(Typography)({
  fontFamily: 'Medium',
  fontSize: 16,
  color: 'black',
  display: 'flex',
  alignItems: 'center',
});

const LabelTyp = styled(Typography)({
  paddingBottom: 1,
  display: 'flex',
  fontSize: 14,
});

const AllSurfacesWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});
const HeadingWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

const AllSurfacesParentWrapper = styled(Box)({
  display: 'flex',
  marginLeft: -11,
  marginTop: 22,
});
const ActionsWrapper = styled(Box)({
  display: 'flex',
  marginLeft: -11,
  marginRight: 22,
});

const LoadingWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'calc(100vh - 250px)',
});

const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});

export default function AllRoomsPanel(props) {
  const {
    bulkSelectionArr,
    setBulkSelectionArr,
    commonProducts,
    selectedToggle,
    setSelectedToggle,
    showActionBar,
    setShowActionBar,
  } = props;
  const appState = useAppState();
  const [uniqueSurfaces, setUniqueSurfaces] = useState({});
  const [selectedActionId, setSelectedActionId] = useState(null);
  const [allIncludedActions, setAllIncludedActions] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setUniqueSurfaces(getUniqueSurfaces(cloneState(appState)));
  }, [appState]);

  useEffect(() => {
    const includedActions = getAllActionFromApp(cloneState(appState));
    setAllIncludedActions(includedActions);
    setSelectedToggle('paint');
    if (includedActions.length > 0) {
      setSelectedActionId(includedActions[0]['actionId']);
    }
    setTimeout(() => setLoader(false), 500);
    return () => setSelectedToggle('paint');
  }, []);

  useEffect(() => {
    setBulkSelectionArr([]);
  }, [selectedActionId]);
  useEffect(() => {
    if (selectedActionId != null && selectedToggle === 'paint') {
      let flag = false;
      const includedSurfaces = [];
      Object.keys(uniqueSurfaces).map((parentSurfaceId, index) => {
        if (
          Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length < 1
        ) {
          if (uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]) {
            Object.keys(
              uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                'room'
              ]
            ).map((roomId, index) => {
              const pId =
                uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                  'room'
                ][roomId]['parentRoomId'];

              let actualChilds = 0;
              Object.keys(
                uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                  'room'
                ]
              ).map((roomId) => {
                actualChilds += Object.entries(
                  uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                    'room'
                  ][roomId]['surfaces'][parentSurfaceId]['actions'][
                    selectedActionId
                  ]['dimensions']
                ).length;
              });

              const selectedChild = bulkSelectionArr.filter(
                (b) => parentSurfaceId == b.parentSurfaceId
              ).length;

              if (actualChilds === selectedChild && actualChilds != 0) {
                flag = true;
                includedSurfaces.push({
                  parentSurfaceId: parentSurfaceId,
                  surfaceId: null,
                });
              }
            });
          }
        } else {
          Object.keys(uniqueSurfaces[parentSurfaceId]['surfaces']).map(
            (surfaceId, index) => {
              if (
                uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                  'actions'
                ][selectedActionId]
              ) {
                Object.keys(
                  uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                    'actions'
                  ][selectedActionId]['room']
                ).map((roomId, index) => {
                  const pId =
                    uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                      'actions'
                    ][selectedActionId]['room'][roomId]['parentRoomId'];

                  let actualChilds = 0;
                  Object.keys(
                    uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                      'actions'
                    ][selectedActionId]['room']
                  ).map((roomId) => {
                    actualChilds += Object.entries(
                      uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                        'actions'
                      ][selectedActionId]['room'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][selectedActionId][
                        'dimensions'
                      ]
                    ).length;
                  });

                  const selectedChild = bulkSelectionArr.filter(
                    (b) =>
                      parentSurfaceId == b.parentSurfaceId &&
                      b.surfaceId == surfaceId
                  ).length;

                  if (actualChilds === selectedChild && actualChilds != 0) {
                    flag = true;
                    includedSurfaces.push({
                      parentSurfaceId: parentSurfaceId,
                      surfaceId: surfaceId,
                    });
                  }
                });
              }
            }
          );
        }
      });

      if (flag) {
        !showActionBar && setShowActionBar(true);
        const filteredBulkSelectionArr = bulkSelectionArr.filter((b) =>
          includedSurfaces.find(
            (i) =>
              i.parentSurfaceId == b.parentSurfaceId &&
              i.surfaceId == b.surfaceId
          )
        );
        bulkSelectionArr.length !== filteredBulkSelectionArr.length &&
          setBulkSelectionArr(filteredBulkSelectionArr);
      } else {
        showActionBar && setShowActionBar(false);
      }
    }
  }, [bulkSelectionArr, selectedActionId]);

  useEffect(() => {
    if (selectedActionId != null && selectedToggle === 'colors') {
      let flag = false;
      const includedSurfaces = [];
      Object.keys(uniqueSurfaces).map((parentSurfaceId, index) => {
        if (
          Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces']).length < 1
        ) {
          if (uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]) {
            Object.keys(
              uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                'room'
              ]
            ).map((roomId, index) => {
              const pId =
                uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                  'room'
                ][roomId]['parentRoomId'];

              let actualChilds = 0;
              Object.keys(
                uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                  'room'
                ]
              ).map((roomId) => {
                Object.keys(
                  uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                    'room'
                  ][roomId]['surfaces'][parentSurfaceId]['actions'][
                    selectedActionId
                  ]['dimensions']
                ).map((dimensionId) => {
                  Object.keys(
                    uniqueSurfaces[parentSurfaceId]['actions'][
                      selectedActionId
                    ]['room'][roomId]['surfaces'][parentSurfaceId]['actions'][
                      selectedActionId
                    ]['dimensions'][dimensionId]['products']
                  ).find(
                    (productId) =>
                      uniqueSurfaces[parentSurfaceId]['actions'][
                        selectedActionId
                      ]['room'][roomId]['surfaces'][parentSurfaceId]['actions'][
                        selectedActionId
                      ]['dimensions'][dimensionId]['products'][productId][
                        'has_coats'
                      ]
                  ) && actualChilds++;
                });
              });

              const selectedChild = bulkSelectionArr.filter(
                (b) => parentSurfaceId == b.parentSurfaceId
              ).length;

              if (actualChilds === selectedChild && actualChilds != 0) {
                flag = true;
                includedSurfaces.push({
                  parentSurfaceId: parentSurfaceId,
                  surfaceId: null,
                });
              }
            });
          }
        } else {
          Object.keys(uniqueSurfaces[parentSurfaceId]['surfaces']).map(
            (surfaceId, index) => {
              if (
                uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                  'actions'
                ][selectedActionId]
              ) {
                Object.keys(
                  uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                    'actions'
                  ][selectedActionId]['room']
                ).map((roomId, index) => {
                  const pId =
                    uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                      'actions'
                    ][selectedActionId]['room'][roomId]['parentRoomId'];

                  let actualChilds = 0;
                  Object.keys(
                    uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                      'actions'
                    ][selectedActionId]['room']
                  ).map((roomId) => {
                    Object.keys(
                      uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                        'actions'
                      ][selectedActionId]['room'][roomId]['surfaces'][
                        parentSurfaceId
                      ]['surfaces'][surfaceId]['actions'][selectedActionId][
                        'dimensions'
                      ]
                    ).map((dimesnionId) => {
                      Object.keys(
                        uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                          'actions'
                        ][selectedActionId]['room'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surfaces'][surfaceId]['actions'][selectedActionId][
                          'dimensions'
                        ][dimesnionId]['products']
                      ).find(
                        (productId) =>
                          uniqueSurfaces[parentSurfaceId]['surfaces'][
                            surfaceId
                          ]['actions'][selectedActionId]['room'][roomId][
                            'surfaces'
                          ][parentSurfaceId]['surfaces'][surfaceId]['actions'][
                            selectedActionId
                          ]['dimensions'][dimesnionId]['products'][productId][
                            'has_coats'
                          ]
                      ) && actualChilds++;
                    });
                  });

                  const selectedChild = bulkSelectionArr.filter(
                    (b) =>
                      parentSurfaceId == b.parentSurfaceId &&
                      b.surfaceId == surfaceId
                  ).length;

                  if (actualChilds === selectedChild && actualChilds != 0) {
                    flag = true;
                    includedSurfaces.push({
                      parentSurfaceId: parentSurfaceId,
                      surfaceId: surfaceId,
                    });
                  }
                });
              }
            }
          );
        }
      });

      if (flag) {
        !showActionBar && setShowActionBar(true);
        const filteredBulkSelectionArr = bulkSelectionArr.filter((b) =>
          includedSurfaces.find(
            (i) =>
              i.parentSurfaceId == b.parentSurfaceId &&
              i.surfaceId == b.surfaceId
          )
        );
        bulkSelectionArr.length !== filteredBulkSelectionArr.length &&
          setBulkSelectionArr(filteredBulkSelectionArr);
      } else {
        showActionBar && setShowActionBar(false);
      }
    }
  }, [bulkSelectionArr, selectedActionId]);
  if (loader)
    return (
      <LoadingWrapper>
        <CircularProgress color="primary" />
      </LoadingWrapper>
    );

  if (!isAnyRoomHasAnyIncludedSurface(appState))
    return (
      <Alert severity="warning">Please select Surfaces to continue...</Alert>
    );
  if (selectedActionId == null)
    return (
      <Alert severity="warning">Please select Actions to continue...</Alert>
    );

  return (
    <RoomWrapper>
      <Grid container>
        <Grid item xs={12}>
          <React.Fragment>
            <HeadingWrapper>
              <Heading>Showing results for</Heading>

              <ToggleButtonGroup value={selectedToggle}>
                {[
                  { label: 'Paint', value: 'paint' },
                  { label: 'Colors', value: 'colors' },
                ].map((t) => {
                  return (
                    <StyledToggleButton
                      disableRipple={true}
                      onClick={() => setSelectedToggle(t.value)}
                      value={t.value}
                      key={t.value}
                    >
                      {t.label}
                    </StyledToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </HeadingWrapper>
            <Box display="flex">
              {allIncludedActions.map((action, index) => (
                <ActionsWrapper key={index}>
                  <AllSurfacesWrapper>
                    <Checkbox
                      checked={selectedActionId == action.actionId}
                      onChange={(e) => setSelectedActionId(action.actionId)}
                    />
                  </AllSurfacesWrapper>
                  <AllSurfacesWrapper>
                    <LabelTyp>{action['name']}</LabelTyp>
                  </AllSurfacesWrapper>
                </ActionsWrapper>
              ))}
            </Box>
            <AllSurfacesParentWrapper>
              <AllSurfacesWrapper>
                <Checkbox
                  checked={
                    handleAllSUrfacesChange(
                      { target: { checked: true } },
                      appState,
                      selectedActionId,
                      selectedToggle
                    ).length === bulkSelectionArr.length
                  }
                  onChange={(e) =>
                    setBulkSelectionArr(
                      handleAllSUrfacesChange(
                        e,
                        appState,
                        selectedActionId,
                        selectedToggle
                      )
                    )
                  }
                />
              </AllSurfacesWrapper>
              <AllSurfacesWrapper>
                <LabelTyp>All Surfaces</LabelTyp>
              </AllSurfacesWrapper>
            </AllSurfacesParentWrapper>
            <Grid item xs={12}>
              <SurfacePanel
                selectedActionId={selectedActionId}
                uniqueSurfaces={uniqueSurfaces}
                bulkSelectionArr={bulkSelectionArr}
                setBulkSelectionArr={setBulkSelectionArr}
                commonProducts={commonProducts}
                selectedToggle={selectedToggle}
              />
            </Grid>
          </React.Fragment>
        </Grid>
      </Grid>
    </RoomWrapper>
  );
}
