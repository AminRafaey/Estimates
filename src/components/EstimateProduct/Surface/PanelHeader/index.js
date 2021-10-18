import React, { useLayoutEffect, useState, useEffect } from 'react';
import { styled, Box, Grid, Typography } from '@material-ui/core';
import AccordionArrowIcon from '../../../../resources/AccordionArrowIcon';
import { useAppState } from '../../../../Context/AppContext';
import { Checkbox as MUICheckbox } from '../../../UI';
import TotalProductCost from '../../TotalProductCost';
import AccordionBulkSelect from '../AccordionBulkSelect';
import HeaderBulkSelection from '../../HeaderBulkSelection';
import {
  isAnyActionHasDimensions,
  IsActionHasAnyCoatsAssociatedProd,
  filterSelectionArrOnBasisOfCoatsAssociatedProd,
} from '../../utility';
import { default as AccordionColorBulkSelection } from '../../ColorSelection/AccordionBulkSelection';
import { default as HeaderColorBulkSelection } from '../../ColorSelection/AccordionBulkSelection/HeaderBulkSelection';
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
  selectedToggle,
  setSurfaceBulkSelectionArr,
  selectedActionId,
  surfaceBulkSelectionArr,
  commonProducts,
  AccordionCommonProducts,
  setAccordionCommonProducts,
}) {
  const appState = useAppState();
  const [filteredBulkSelectionArr, setFilteredBulkSelectionArr] = useState(
    filterBulkSelectionArr()
  );

  useEffect(() => {
    filteredBulkSelectionArr.length !== filterBulkSelectionArr().length &&
      setFilteredBulkSelectionArr(filterBulkSelectionArr());
  }, [bulkSelectionArr]);

  useLayoutEffect(() => {
    setSurfaceBulkSelectionArr(getAllSurfaceLineItems());
  }, [selectedActionId]);

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
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'][selectedActionId]['dimensions']
      ).map((dId) => {
        allSurfaceAction.push({
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          actionId: selectedActionId,
          dimensionKey: dId,
        });
      });
    } else {
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ][selectedActionId]['dimensions']
      ).map((dId) => {
        allSurfaceAction.push({
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          actionId: selectedActionId,
          dimensionKey: dId,
        });
      });
    }

    return allSurfaceAction;
  }

  const handleCheckboxChange = (e) => {
    let allSurfaceAction = [];
    if (surfaceId) {
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'][selectedActionId]['dimensions']
      ).map((dId) => {
        selectedToggle === 'colors'
          ? Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][selectedActionId][
                'dimensions'
              ][dId]['products']
            ).find(
              (productId) =>
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][selectedActionId][
                  'dimensions'
                ][dId]['products'][productId]['has_coats']
            ) &&
            allSurfaceAction.push({
              parentRoomId,
              roomId,
              parentSurfaceId,
              surfaceId,
              actionId: selectedActionId,
              dimensionKey: dId,
            })
          : allSurfaceAction.push({
              parentRoomId,
              roomId,
              parentSurfaceId,
              surfaceId,
              actionId: selectedActionId,
              dimensionKey: dId,
            });
      });
    } else {
      Object.keys(
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ][selectedActionId]['dimensions']
      ).map((dId) => {
        selectedToggle === 'colors'
          ? Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][selectedActionId]['dimensions'][dId]['products']
            ).find(
              (productId) =>
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][selectedActionId]['dimensions'][dId]['products'][
                  productId
                ]['has_coats']
            ) &&
            allSurfaceAction.push({
              parentRoomId,
              roomId,
              parentSurfaceId,
              surfaceId,
              actionId: selectedActionId,
              dimensionKey: dId,
            })
          : allSurfaceAction.push({
              parentRoomId,
              roomId,
              parentSurfaceId,
              surfaceId,
              actionId: selectedActionId,
              dimensionKey: dId,
            });
      });
    }
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
    let selectedChild = bulkSelectionArr.filter(
      (b) =>
        b.parentRoomId == parentRoomId &&
        b.roomId == roomId &&
        b.parentSurfaceId == parentSurfaceId &&
        b.surfaceId == surfaceId
    ).length;
    let actualChild = 0;

    if (surfaceId) {
      selectedToggle === 'colors'
        ? Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][selectedActionId]['dimensions']
          ).map((dimensionId) => {
            if (
              Object.keys(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['surfaces'][surfaceId]['actions'][selectedActionId][
                  'dimensions'
                ][dimensionId]['products']
              ).find(
                (productId) =>
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][selectedActionId][
                    'dimensions'
                  ][dimensionId]['products'][productId]['has_coats']
              )
            ) {
              actualChild += 1;
            }
          })
        : (actualChild =
            actualChild +
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions'][selectedActionId][
                'dimensions'
              ]
            ).length);
    } else {
      selectedToggle === 'colors'
        ? Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][selectedActionId]['dimensions']
          ).map((dimensionId) => {
            if (
              Object.keys(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                  parentSurfaceId
                ]['actions'][selectedActionId]['dimensions'][dimensionId][
                  'products'
                ]
              ).find(
                (productId) =>
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][selectedActionId]['dimensions'][dimensionId][
                    'products'
                  ][productId]['has_coats']
              )
            ) {
              actualChild += 1;
            }
          })
        : (actualChild =
            actualChild +
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions'][selectedActionId]['dimensions']
            ).length);
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
        ...(Object.entries(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).length === 0 && { borderTop: '1px solid #E3E8EE' }),
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <NameWrapper>
            <MUICheckbox
              style={{
                ...(!isAnyActionHasDimensions(surface['actions']) && {
                  visibility: 'hidden',
                }),
                ...(selectedToggle === 'colors' &&
                  !IsActionHasAnyCoatsAssociatedProd(
                    appState,
                    parentRoomId,
                    roomId,
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
                {`${surface.name} ${
                  surface.name !== surface.actual_name && surface.actual_name
                    ? '(' + surface.actual_name + ')'
                    : ''
                }`}
              </PHNameTyp>
              <TotalProductCost
                parentRoomId={parentRoomId}
                roomId={roomId}
                parentSurfaceId={parentSurfaceId}
                surfaceId={surfaceId}
                selectedActionId={selectedActionId}
              />
            </Box>
          </NameWrapper>
        </Grid>
        <Grid item xs={9}>
          {surfaceBulkSelectionArr.length > 0 &&
            (selectedToggle === 'colors'
              ? IsActionHasAnyCoatsAssociatedProd(
                  appState,
                  parentRoomId,
                  roomId,
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
                      bulkType={'room-specific-accordion'}
                    />
                    <HeaderColorBulkSelection
                      bulkType={'room-specific-accordion'}
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
                      globalBulkSelectionArr={bulkSelectionArr}
                      setGlobalBulkSelectionArr={setBulkSelectionArr}
                      globalCommonProducts={commonProducts}
                      bulkSelectionArr={
                        filteredBulkSelectionArr.length > 0
                          ? filteredBulkSelectionArr
                          : surfaceBulkSelectionArr
                      }
                      commonProducts={AccordionCommonProducts}
                      setCommonProducts={setAccordionCommonProducts}
                      bulkType={'room-specific-accordion'}
                    />
                    <HeaderBulkSelection
                      AccordionCommonProducts={AccordionCommonProducts}
                      bulkType={'room-specific-accordion'}
                      bulkSelectionArr={
                        filteredBulkSelectionArr.length > 0
                          ? filteredBulkSelectionArr
                          : surfaceBulkSelectionArr
                      }
                    />
                  </>
                ))}
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
