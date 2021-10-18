import React, { useEffect, useLayoutEffect, useState } from 'react';
import { styled, Box, Grid, Typography } from '@material-ui/core';
import AccordionArrowIcon from '../../../../../resources/AccordionArrowIcon';
import { Checkbox as MUICheckbox } from '../../../../UI';
import TotalProductCost from '../../../TotalProductCost';
import { useAppState } from '../../../../../Context/AppContext';
import AccordionBulkSelect from '../../../Surface/AccordionBulkSelect';
import HeaderBulkSelection from '../../../HeaderBulkSelection';
import { default as AccordionColorBulkSelection } from '../../../ColorSelection/AccordionBulkSelection';
import { default as HeaderColorBulkSelection } from '../../../ColorSelection/AccordionBulkSelection/HeaderBulkSelection';
import {
  IsSurfaceHasAnyCoatsAssociatedProd,
  filterSelectionArrOnBasisOfCoatsAssociatedProd,
} from '../../../utility';
const PHNameWrapper = styled(Box)({
  background: '#F7FAFC',
  padding: '8px',
  lineHeight: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderWidth: '0px 1px 1px 1px',
  borderColor: '#E3E8EE',
  borderStyle: 'solid',
  width: '100%',
  minWidth: 750,
});

const PHNameTyp = styled(Typography)({
  fontSize: 14,
  wordBreak: 'break-word',
});
const NameWrapper = styled(Box)({
  display: 'flex',

  alignItems: 'center',

  height: '100%',
});

const ButtonWrapper = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

export default function PanelHeader({
  uniqueSurfaces,
  selectedActionId,
  parentSurfaceId,
  surfaceId,
  surface,
  expandIcon,
  setExpandIcon,
  setExpanded,
  bulkSelectionArr,
  setBulkSelectionArr,
  AccordionCommonProducts,
  setAccordionCommonProducts,
  surfaceBulkSelectionArr,
  setSurfaceBulkSelectionArr,
  selectedToggle,
}) {
  const appState = useAppState();
  const [filteredBulkSelectionArr, setFilteredBulkSelectionArr] = useState(
    filterBulkSelectionArr()
  );

  useEffect(() => {
    filteredBulkSelectionArr.length !== filterBulkSelectionArr().length &&
      setFilteredBulkSelectionArr(filterBulkSelectionArr());
  }, [bulkSelectionArr]);

  function filterBulkSelectionArr() {
    return bulkSelectionArr.filter((b) =>
      surfaceBulkSelectionArr.find(
        (s) =>
          s.parentRoomId == b.parentRoomId &&
          s.roomId == b.roomId &&
          s.parentSurfaceId == b.parentSurfaceId &&
          s.surfaceId == b.surfaceId &&
          s.actionId == b.actionId &&
          b.dimensionKey == s.dimensionKey
      )
    );
  }
  function getAllSurfaceLineItems() {
    let allSurfaceAction = [];
    if (surfaceId) {
      Object.keys(
        uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
          selectedActionId
        ]['room']
      ).map((roomId) => {
        const pId =
          uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
            selectedActionId
          ]['room'][roomId]['parentRoomId'];
        Object.keys(
          appState[pId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
            'surfaces'
          ][surfaceId]['actions'][selectedActionId]['dimensions']
        ).map((dId) => {
          allSurfaceAction.push({
            parentRoomId: pId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actionId: selectedActionId,
            dimensionKey: dId,
          });
        });
      });
    } else {
      Object.keys(
        uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]['room']
      ).map((roomId) => {
        const pId =
          uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]['room'][
            roomId
          ]['parentRoomId'];
        Object.keys(
          appState[pId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
            'actions'
          ][selectedActionId]['dimensions']
        ).map((dId) => {
          allSurfaceAction.push({
            parentRoomId: pId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actionId: selectedActionId,
            dimensionKey: dId,
          });
        });
      });
    }

    return allSurfaceAction;
  }

  useLayoutEffect(() => {
    setSurfaceBulkSelectionArr(getAllSurfaceLineItems());
  }, [selectedActionId]);

  const handleCheckboxChange = (e) => {
    let allSurfaceAction = [];
    if (surfaceId) {
      Object.keys(
        uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
          selectedActionId
        ]['room']
      ).map((roomId) => {
        const pId =
          uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
            selectedActionId
          ]['room'][roomId]['parentRoomId'];
        Object.keys(
          appState[pId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
            'surfaces'
          ][surfaceId]['actions'][selectedActionId]['dimensions']
        ).map((dId) => {
          allSurfaceAction.push({
            parentRoomId: pId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actionId: selectedActionId,
            dimensionKey: dId,
          });
        });
      });
    } else {
      Object.keys(
        uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]['room']
      ).map((roomId) => {
        const pId =
          uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]['room'][
            roomId
          ]['parentRoomId'];
        Object.keys(
          appState[pId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
            'actions'
          ][selectedActionId]['dimensions']
        ).map((dId) => {
          allSurfaceAction.push({
            parentRoomId: pId,
            roomId,
            parentSurfaceId,
            surfaceId,
            actionId: selectedActionId,
            dimensionKey: dId,
          });
        });
      });
    }
    allSurfaceAction =
      selectedToggle === 'colors'
        ? allSurfaceAction.filter((d) =>
            filterSelectionArrOnBasisOfCoatsAssociatedProd(
              appState,
              d.parentRoomId,
              d.roomId,
              d.parentSurfaceId,
              d.surfaceId,
              d.actionId,
              d.dimensionKey
            )
          )
        : allSurfaceAction;
    if (e.target.checked) {
      allSurfaceAction = allSurfaceAction.filter(
        (item1) =>
          !bulkSelectionArr.find(
            (item2) =>
              item1.parentRoomId == item2.parentRoomId &&
              item1.roomId == item2.roomId &&
              item1.parentSurfaceId == item2.parentSurfaceId &&
              item1.surfaceId == item2.surfaceId &&
              item1.actionId == item2.actionId &&
              item1.dimensionKey == item2.dimensionKey
          )
      );
      setBulkSelectionArr([...bulkSelectionArr, ...allSurfaceAction]);
    } else {
      setBulkSelectionArr(
        bulkSelectionArr.filter(
          (item1) =>
            !allSurfaceAction.find(
              (item2) =>
                item1.parentRoomId == item2.parentRoomId &&
                item1.roomId == item2.roomId &&
                item1.parentSurfaceId == item2.parentSurfaceId &&
                item1.surfaceId == item2.surfaceId &&
                item1.actionId == item2.actionId &&
                item1.dimensionKey == item2.dimensionKey
            )
        )
      );
    }
  };

  const getCheckboxStaus = () => {
    if (
      surfaceId
        ? Object.entries(
            uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions']
          ).length === 0
        : Object.entries(uniqueSurfaces[parentSurfaceId]['actions']).length ===
          0
    ) {
      return 'unchecked';
    }

    let selectedChild = bulkSelectionArr.filter(
      (b) => b.parentSurfaceId == parentSurfaceId && b.surfaceId == surfaceId
    ).length;

    let actualChild = 0;

    if (surfaceId) {
      selectedToggle === 'colors'
        ? Object.keys(
            uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
              selectedActionId
            ]['room']
          ).map((roomId) => {
            const pRId =
              uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
                selectedActionId
              ]['room'][roomId]['parentRoomId'];
            Object.keys(
              appState[pRId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
                'surfaces'
              ][surfaceId]['actions'][selectedActionId]['dimensions']
            ).map((dimensionId) => {
              if (
                Object.keys(
                  appState[pRId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][selectedActionId][
                    'dimensions'
                  ][dimensionId]['products']
                ).find(
                  (productId) =>
                    appState[pRId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['surfaces'][surfaceId]['actions'][selectedActionId][
                      'dimensions'
                    ][dimensionId]['products'][productId]['has_coats']
                )
              ) {
                actualChild += 1;
              }
            });
          })
        : Object.keys(
            uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId]['actions'][
              selectedActionId
            ]['room']
          ).map((rId) => {
            actualChild =
              actualChild +
              Object.entries(
                uniqueSurfaces[parentSurfaceId]['surfaces'][surfaceId][
                  'actions'
                ][selectedActionId]['room'][rId]['surfaces'][parentSurfaceId][
                  'surfaces'
                ][surfaceId]['actions'][selectedActionId]['dimensions']
              ).length;
          });
    } else {
      selectedToggle === 'colors'
        ? Object.keys(
            uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]['room']
          ).map((roomId) => {
            const pRId =
              uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                'room'
              ][roomId]['parentRoomId'];
            Object.keys(
              appState[pRId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
                'actions'
              ][selectedActionId]['dimensions']
            ).map((dimensionId) => {
              if (
                Object.keys(
                  appState[pRId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][selectedActionId]['dimensions'][dimensionId][
                    'products'
                  ]
                ).find(
                  (productId) =>
                    appState[pRId]['bedrooms'][roomId]['surfaces'][
                      parentSurfaceId
                    ]['actions'][selectedActionId]['dimensions'][dimensionId][
                      'products'
                    ][productId]['has_coats']
                )
              ) {
                actualChild += 1;
              }
            });
          })
        : Object.keys(
            uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId]['room']
          ).map((rId) => {
            actualChild =
              actualChild +
              Object.entries(
                uniqueSurfaces[parentSurfaceId]['actions'][selectedActionId][
                  'room'
                ][rId]['surfaces'][parentSurfaceId]['actions'][
                  selectedActionId
                ]['dimensions']
              ).length;
          });
    }

    if (selectedChild == actualChild) {
      return 'checked';
    } else if (selectedChild > 0) {
      return 'indeterminate';
    }
    return 'unchecked';
  };

  return (
    <PHNameWrapper
      style={{
        ...(Object.entries(uniqueSurfaces[parentSurfaceId]['surfaces'])
          .length === 0 && { borderTop: '1px solid #E3E8EE' }),
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <NameWrapper>
            <MUICheckbox
              style={{
                ...(Object.entries(surface['actions']).length < 1 && {
                  visibility: 'hidden',
                }),
                ...(selectedToggle === 'colors' &&
                  !IsSurfaceHasAnyCoatsAssociatedProd(
                    appState,
                    parentSurfaceId,
                    surfaceId,
                    selectedActionId
                  ) && {
                    visibility: 'hidden',
                  }),
              }}
              checked={getCheckboxStaus() === 'checked'}
              indeterminate={getCheckboxStaus() === 'indeterminate'}
              onChange={(e) => {
                handleCheckboxChange(e);
              }}
            />
            <Box width="100%">
              <PHNameTyp
                onClick={() => {
                  setExpanded(expandIcon === 'More' ? true : false);
                  expandIcon === 'More'
                    ? setExpandIcon('Less')
                    : setExpandIcon('More');
                }}
              >
                {surface.actual_name ? surface.actual_name : surface.name}
              </PHNameTyp>
              <TotalProductCost
                uniqueSurfaces={uniqueSurfaces}
                parentSurfaceId={parentSurfaceId}
                surfaceId={surfaceId}
                selectedActionId={selectedActionId}
              />
            </Box>
          </NameWrapper>
        </Grid>
        <Grid item xs={9}>
          <Box width={'100%'} pl={2}>
            {surfaceBulkSelectionArr.length > 0 && selectedToggle === 'colors'
              ? IsSurfaceHasAnyCoatsAssociatedProd(
                  appState,
                  parentSurfaceId,
                  surfaceId,
                  selectedActionId
                ) && (
                  <>
                    <AccordionColorBulkSelection
                      bulkSelectionArr={
                        filteredBulkSelectionArr.length > 0
                          ? filteredBulkSelectionArr.filter((d) =>
                              filterSelectionArrOnBasisOfCoatsAssociatedProd(
                                appState,
                                d.parentRoomId,
                                d.roomId,
                                d.parentSurfaceId,
                                d.surfaceId,
                                d.actionId,
                                d.dimensionKey
                              )
                            )
                          : surfaceBulkSelectionArr.filter((d) =>
                              filterSelectionArrOnBasisOfCoatsAssociatedProd(
                                appState,
                                d.parentRoomId,
                                d.roomId,
                                d.parentSurfaceId,
                                d.surfaceId,
                                d.actionId,
                                d.dimensionKey
                              )
                            )
                      }
                      globalBulkSelectionArr={bulkSelectionArr}
                      setGlobalBulkSelectionArr={setBulkSelectionArr}
                      bulkType={'accordion'}
                    />
                    <HeaderColorBulkSelection
                      bulkType={'accordion'}
                      bulkSelectionArr={
                        filteredBulkSelectionArr.length > 0
                          ? filteredBulkSelectionArr.filter((d) =>
                              filterSelectionArrOnBasisOfCoatsAssociatedProd(
                                appState,
                                d.parentRoomId,
                                d.roomId,
                                d.parentSurfaceId,
                                d.surfaceId,
                                d.actionId,
                                d.dimensionKey
                              )
                            )
                          : surfaceBulkSelectionArr.filter((d) =>
                              filterSelectionArrOnBasisOfCoatsAssociatedProd(
                                appState,
                                d.parentRoomId,
                                d.roomId,
                                d.parentSurfaceId,
                                d.surfaceId,
                                d.actionId,
                                d.dimensionKey
                              )
                            )
                      }
                    />
                  </>
                )
              : surfaceBulkSelectionArr.length > 0 && (
                  <>
                    <AccordionBulkSelect
                      bulkSelectionArr={
                        filteredBulkSelectionArr.length > 0
                          ? filteredBulkSelectionArr
                          : surfaceBulkSelectionArr
                      }
                      commonProducts={AccordionCommonProducts}
                      setCommonProducts={setAccordionCommonProducts}
                      bulkType={'all-room-accordion'}
                    />
                    <HeaderBulkSelection
                      bulkType={'accordion'}
                      AccordionCommonProducts={AccordionCommonProducts}
                      bulkSelectionArr={
                        filteredBulkSelectionArr.length > 0
                          ? filteredBulkSelectionArr
                          : surfaceBulkSelectionArr
                      }
                    />
                  </>
                )}
          </Box>
        </Grid>

        <Grid item xs={1}>
          <ButtonWrapper>
            <Box
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
        </Grid>
      </Grid>
    </PHNameWrapper>
  );
}
