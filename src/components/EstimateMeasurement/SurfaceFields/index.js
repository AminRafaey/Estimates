import React, { useState, useEffect } from 'react';
import {
  styled,
  withStyles,
  Box,
  Typography,
  FormControl,
  OutlinedInput,
  Slide,
  Button,
} from '@material-ui/core';
import {
  useAppState,
  useAppDispatch,
  updateFieldValue,
  addDimensions,
  updateCoatsAgainstAction,
} from '../../../Context/AppContext';
import CoatFields from './CoatFields';
import CloseIcon from '@material-ui/icons/Close';
import { useLinkingState } from '../../../Context/LinkingContext';
import {
  getLinking,
  getLaborCost,
  getFieldStatus,
  insertNumOfSelectedAction,
} from '../utility';
import { cloneState } from '../../EstimateProduct/stateClone';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../Context/ProductContext';
import { collectiveLaborCostAgainstSurface } from '../../EstimateSummary/utility';

const FieldWrapper = styled(Box)({ paddingRight: 16, paddingBottom: 8 });

const FieldTyp = styled(Typography)({
  fontSize: 14,
  paddingLeft: 4,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: 73,
});

const OtherFieldWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100%',

  alignItems: 'flex-start',
});

const LinkedSurfacesparentWrapper = styled(Box)({
  position: 'fixed',
  bottom: 20,
  left: '30vw',
  opacity: 0.8,
  width: '40vw',
  height: 'fit-content',
  display: 'flex',
  justifyContent: 'center',
});
const LinkedSurfacesWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  background: '#151b26',
  width: '100%',
  borderRadius: 25,
  padding: 12,
});

const CloseIconWrapper = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
});
const CloseIconInnerWrapper = styled(Box)({
  display: 'flex',
  '&:hover': {
    background: '#424242',
  },
});
const FieldsWrapper = styled(Box)({
  display: 'flex',
});
const LinkSurfaceNameTyp = styled(Typography)({
  display: 'inline',
  color: '#ffff',
  fontSize: 14,
  whiteSpace: 'pre',
});
const ButtonWrapper = styled(Box)({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  minWidth: 215,
  paddingRight: 12,
});
const StyledButton = withStyles({
  root: {
    marginRight: 16,
  },
})(Button);
const StyledAddAllButton = withStyles({
  root: {
    textTransform: 'none',
    marginRight: 16,
  },
})(Button);

export default function SurfaceFields(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    surface_id,
    hourlyRate,
    fieldsLinkingList,
    setFieldsLinkingList,
    bulkSelectionArr,
    addAllFieldsCurrentSID,
    setAddAllFieldsCurrentSID,
    maxFieldCount,
  } = props;

  const [formula, setFormula] = useState('');

  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const linkingState = useLinkingState();
  const actions = surfaceId
    ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'surfaces'
      ][surfaceId]['actions']
    : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
        'actions'
      ];

  useEffect(() => {
    let surface_formula = surfaceProductionRatesState[surface_id][
      'surface_formula'
    ].trim();
    Object.keys(surfaceProductionRatesState[surface_id]['surface_fields']).map(
      (key, index) => {
        surface_formula = surface_formula.replaceAll(
          surfaceProductionRatesState[surface_id]['surface_fields'][key][
            'name'
          ],
          `(surfaceId?appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId]['surfaces'][surfaceId][surfaceProductionRatesState[surface_id]['surface_fields'][${key}][
            'name'
          ]]:
appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][surfaceProductionRatesState[surface_id]['surface_fields'][${key}][
            'name'
          ]])`
        );
      }
    );
    setFormula(surface_formula);
  }, [surface_id]);

  const getDimensionObj = (parentSurfaceId, surfaceId, surface_id) => {
    let dimension = {};
    Object.keys(surfaceProductionRatesState[surface_id]['surface_fields']).map(
      (s) => {
        dimension[
          surfaceProductionRatesState[surface_id]['surface_fields'][s]['name']
        ] = surfaceId
          ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId][
              surfaceProductionRatesState[surface_id]['surface_fields'][s][
                'name'
              ]
            ]
          : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ][
              surfaceProductionRatesState[surface_id]['surface_fields'][s][
                'name'
              ]
            ];
      }
    );
    return dimension;
  };

  const handleFieldValueChange = (value, fieldsLinkingList) => {
    fieldsLinkingList.length > 0 &&
      Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
        (pSId) => {
          if (
            Object.entries(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
                'surfaces'
              ]
            ).length < 1
          ) {
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
              'included'
            ] &&
              fieldsLinkingList.find((f) => f.surfaceId == pSId) &&
              fieldsLinkingList
                .find((f) => f.surfaceId == pSId)
                .fields.map((field) => {
                  updateFieldValue(appDispatch, {
                    parentRoomId,
                    roomId,
                    parentSurfaceId: pSId,
                    surfaceId: null,
                    fieldName: field,
                    fieldValue: value,
                  });
                });
            return;
          }
          Object.keys(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
              'surfaces'
            ]
          ).map((sId) => {
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
              'surfaces'
            ][sId]['included'] &&
              fieldsLinkingList.find((f) => f.surfaceId == sId) &&
              fieldsLinkingList
                .find((f) => f.surfaceId == sId)
                .fields.map((field) => {
                  updateFieldValue(appDispatch, {
                    parentRoomId,
                    roomId,
                    parentSurfaceId: pSId,
                    surfaceId: sId,
                    fieldName: field,
                    fieldValue: value,
                  });
                });
          });
        }
      );
  };

  const handleAddBtnClick = (
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId
  ) => {
    surfaceId
      ? Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions']
        ).map((actionId) => {
          if (
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['actions'][actionId]['selected']
          ) {
            addDimensions(appDispatch, {
              parentRoomId,
              roomId,
              parentSurfaceId,
              surfaceId,
              newAction: {
                id: actionId,
              },
              dimension: {
                ...getDimensionObj(
                  parentSurfaceId,
                  surfaceId,
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['surface_id']
                ),
                no_of_coats:
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surfaces'][surfaceId]['actions'][actionId]['no_of_coats'],
                products: {},
              },
              surfaceProductionRatesState,
              products: productState,
            });
          }
        })
      : Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions']
        ).map((actionId) => {
          if (
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['actions'][actionId]['selected']
          ) {
            addDimensions(appDispatch, {
              parentRoomId,
              roomId,
              parentSurfaceId,
              surfaceId,
              newAction: {
                id: actionId,
              },
              dimension: {
                ...getDimensionObj(
                  parentSurfaceId,
                  surfaceId,
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['surface_id']
                ),
                no_of_coats:
                  appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                    parentSurfaceId
                  ]['actions'][actionId]['no_of_coats'],
                products: {},
              },
              surfaceProductionRatesState,
              products: productState,
            });
          }
        });

    const s_id = surfaceId
      ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['surface_id']
      : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surface_id'
        ];

    Object.keys(surfaceProductionRatesState[s_id]['surface_fields']).map(
      (s) => {
        updateFieldValue(appDispatch, {
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          fieldName:
            surfaceProductionRatesState[s_id]['surface_fields'][s]['name'],
          fieldValue: '',
        });
      }
    );
  };

  const handleAddAllBtnClick = () => {
    let linkingArr = [];

    Object.keys(surfaceProductionRatesState[surface_id]['surface_fields']).map(
      (s) => {
        linkingArr = [
          ...linkingArr,
          ...insertNumOfSelectedAction(
            cloneState(appState),
            getLinking(
              surfaceProductionRatesState[surface_id]['surface_fields'][s][
                'name'
              ],
              surfaceId,
              parentSurfaceId,
              linkingState
            ).filter(
              (fl) =>
                !getFieldStatus(fl.surfaceId, appState, parentRoomId, roomId)
            ),
            parentRoomId,
            roomId
          ),
        ];
      }
    );

    linkingArr = linkingArr.filter(
      (l, i) => i === linkingArr.findIndex((li) => li.surfaceId == l.surfaceId)
    );

    linkingArr.length > 0
      ? Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
          (pSId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
                  'surfaces'
                ]
              ).length < 1
            ) {
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
                'included'
              ] &&
                linkingArr.find((f) => f.surfaceId == pSId) &&
                handleAddBtnClick(parentRoomId, roomId, pSId, null);
              return;
            }
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
                'surfaces'
              ]
            ).map((sId) => {
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][pSId][
                'surfaces'
              ][sId]['included'] &&
                linkingArr.find((f) => f.surfaceId == sId) &&
                handleAddBtnClick(parentRoomId, roomId, pSId, sId);
            });
          }
        )
      : handleAddBtnClick(parentRoomId, roomId, parentSurfaceId, surfaceId);
  };

  const getFieldDisableStatus = () => {
    let count = 0;
    surfaceId
      ? Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions']
        ).map((actionId) => {
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces'][surfaceId]['actions'][actionId]['selected'] && count++;
        })
      : Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions']
        ).map((actionId) => {
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['actions'][actionId]['selected'] && count++;
        });
    return count < 1;
  };

  return (
    <React.Fragment>
      <FieldsWrapper>
        {Object.entries(
          surfaceProductionRatesState[surface_id]['surface_fields']
        ).length > 0 &&
          Object.keys(
            surfaceProductionRatesState[surface_id]['surface_fields']
          ).map((s) => (
            <FieldWrapper key={s}>
              <FieldTyp pl={0}>
                {surfaceProductionRatesState[surface_id]['surface_fields'][s][
                  'name'
                ]
                  .charAt(0)
                  .toUpperCase() +
                  surfaceProductionRatesState[surface_id]['surface_fields'][s][
                    'name'
                  ].slice(1)}
                :
              </FieldTyp>
              <FormControl fullWidth size="small" variant="outlined">
                <OutlinedInput
                  style={{
                    ...(getFieldDisableStatus()
                      ? { background: '#F5F6F8' }
                      : { background: '#ffff' }),
                    width: 73,
                  }}
                  variant="outlined"
                  disabled={getFieldDisableStatus()}
                  onFocus={() => {
                    if (bulkSelectionArr.length > 0) return;
                    setAddAllFieldsCurrentSID(
                      surfaceId ? surfaceId : parentSurfaceId
                    );
                    setFieldsLinkingList(
                      insertNumOfSelectedAction(
                        cloneState(appState),
                        getLinking(
                          surfaceProductionRatesState[surface_id][
                            'surface_fields'
                          ][s]['name'],
                          surfaceId,
                          parentSurfaceId,
                          linkingState
                        ).filter(
                          (fl) =>
                            !getFieldStatus(
                              fl.surfaceId,
                              appState,
                              parentRoomId,
                              roomId
                            )
                        ),
                        parentRoomId,
                        roomId
                      )
                    );
                  }}
                  value={
                    surfaceId
                      ? appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ]['surfaces'][surfaceId][
                          surfaceProductionRatesState[surface_id][
                            'surface_fields'
                          ][s]['name']
                        ] || ''
                      : appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                          parentSurfaceId
                        ][
                          surfaceProductionRatesState[surface_id][
                            'surface_fields'
                          ][s]['name']
                        ] || ''
                  }
                  onChange={(e) => {
                    fieldsLinkingList.length < 1 &&
                      updateFieldValue(appDispatch, {
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        surfaceId,
                        fieldName:
                          surfaceProductionRatesState[surface_id][
                            'surface_fields'
                          ][s]['name'],
                        fieldValue: e.target.value,
                      });
                    handleFieldValueChange(
                      e.target.value,
                      insertNumOfSelectedAction(
                        appState,
                        getLinking(
                          surfaceProductionRatesState[surface_id][
                            'surface_fields'
                          ][s]['name'],
                          surfaceId,
                          parentSurfaceId,
                          linkingState
                        ).filter(
                          (fl) =>
                            !getFieldStatus(
                              fl.surfaceId,
                              appState,
                              parentRoomId,
                              roomId
                            )
                        ),
                        parentRoomId,
                        roomId
                      )
                    );
                  }}
                  type={
                    surfaceProductionRatesState[surface_id]['surface_fields'][
                      s
                    ]['type'] === 'integer' ||
                    surfaceProductionRatesState[surface_id]['surface_fields'][
                      s
                    ]['type'] === 'float'
                      ? 'number'
                      : 'text'
                  }
                />
              </FormControl>
            </FieldWrapper>
          ))}
      </FieldsWrapper>

      {[
        ...Array(
          maxFieldCount -
            Object.entries(
              surfaceProductionRatesState[surface_id]['surface_fields']
            ).length
        ),
      ].map((u, i) => (
        <Box key={i} width={73} mr={2} />
      ))}
      <ButtonWrapper>
        <StyledButton
          variant="text"
          color="primary"
          size="small"
          onClick={() => {
            handleAddBtnClick(parentRoomId, roomId, parentSurfaceId, surfaceId);
          }}
        >
          Add
        </StyledButton>

        {(surfaceId
          ? surfaceId == addAllFieldsCurrentSID
          : parentSurfaceId == addAllFieldsCurrentSID) && (
          <StyledAddAllButton
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleAddAllBtnClick()}
          >
            Add All
          </StyledAddAllButton>
        )}

        <OtherFieldWrapper>
          <CoatFields
            parentRoomId={parentRoomId}
            roomId={roomId}
            parentSurfaceId={parentSurfaceId}
            surfaceId={surfaceId}
            surface_id={surface_id}
            actions={actions}
          />
        </OtherFieldWrapper>
      </ButtonWrapper>

      <Slide
        direction="up"
        in={fieldsLinkingList.length > 0 ? true : false}
        mountOnEnter
        unmountOnExit
        style={{ zIndex: 1 }}
      >
        <LinkedSurfacesparentWrapper>
          <LinkedSurfacesWrapper>
            {fieldsLinkingList.find((f) => f.numOfSelectedActions === 0) ? (
              <Box display="flex" alignItems="center" width="90%">
                {fieldsLinkingList.map((f, i) => {
                  if (f.numOfSelectedActions === 0) {
                    return (
                      <LinkSurfaceNameTyp key={i}>
                        {`${f.surfaceName}${
                          fieldsLinkingList
                            .filter((f) => f.numOfSelectedActions === 0)
                            .reverse()[0].surfaceId === f.surfaceId
                            ? ' '
                            : ', '
                        }`}
                      </LinkSurfaceNameTyp>
                    );
                  }
                })}
                <LinkSurfaceNameTyp>{' have no actions'}</LinkSurfaceNameTyp>
              </Box>
            ) : (
              <Box display="flex" alignItems="center" width="90%">
                <LinkSurfaceNameTyp>
                  {'Currently adding measurements for '}
                </LinkSurfaceNameTyp>
                {fieldsLinkingList.map((f, i) => {
                  return (
                    <LinkSurfaceNameTyp key={i}>
                      {`${i > 0 ? ', ' : ''}${f.surfaceName}`}{' '}
                    </LinkSurfaceNameTyp>
                  );
                })}
              </Box>
            )}
            <CloseIconWrapper onClick={() => setFieldsLinkingList([])}>
              <CloseIconInnerWrapper>
                <CloseIcon
                  style={{
                    color: '#ffff',
                  }}
                />
              </CloseIconInnerWrapper>
            </CloseIconWrapper>
          </LinkedSurfacesWrapper>
        </LinkedSurfacesparentWrapper>
      </Slide>
    </React.Fragment>
  );
}
