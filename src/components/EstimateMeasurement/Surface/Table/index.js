import React from 'react';

import {
  styled,
  Box,
  withStyles,
  Chip,
  Grid,
  Typography,
  FormControl,
  OutlinedInput,
} from '@material-ui/core';
import { CopyIcon, DeleteIcon } from '../../../../resources';
import EditableCell from './EditableCell';
import FieldAdjustment from '../FieldAdjustment';
import {
  useAppState,
  useAppDispatch,
  removeDimension,
  updateDimension,
  updateAdjustmentField,
  copyDimensions,
} from '../../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import { getConvertedSurfaceFormula, getTotalLaborCost } from '../../utility';
import EditableAction from './EsitableAction';
const IconOuterWrapper = styled(Box)({
  display: 'flex',
  minWidth: 70,
});

const IconWrapper = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: 10,
  paddingLeft: 4,
});

const FieldWrapper = styled(Box)({
  marginRight: 16,
  width: 73,
});

const OtherFieldWrapper = styled(Box)({
  minHeight: '100%',
  minWidth: 140,
});
const FieldsWrapper = styled(Box)({
  display: 'flex',
});

const ActionsWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 6,
  minWidth: 300,
  maxWidth: 300,
});

const HeaderCellTyp = styled(Typography)({
  fontSize: '15px',
  fontFamily: 'Medium',
  padding: '12px 12px 12px 7px',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
});
const CellTyp = styled(Typography)({
  fontSize: '14px',
  padding: '12px 12px 12px 7px',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
});
const CellWrapper = styled(Box)({
  fontSize: '14px',
  padding: '12px 12px 12px 7px',
});
const LCWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});
const TableWrapper = styled(Box)({
  borderColor: '#E3E8EE',
  borderLeft: '1px solid #E3E8EE',
  borderRight: '1px solid #E3E8EE',
  background: '#ffff',
});

const LaborCostWrapper = styled(Box)({
  minWidth: 140,
  height: '100%',
});

const StyledChip = withStyles({
  root: {
    height: 22,
  },
  label: {
    fontSize: 12,
  },
})(Chip);

const NameWrapper = styled(Box)({
  minWidth: 200,
});
const HeaderWrapper = styled(Box)({
  display: 'flex',
  borderBottom: '1px solid #E3E8EE',
});
const ContentWrapper = styled(Box)({
  display: 'flex',
  borderBottom: '1px solid #E3E8EE',
  '&:last-child': {
    borderBottom: '0px',
  },
});
const AreaWrapper = styled(Box)({
  display: 'flex',
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  minWidth: 55,
});
const LaborHourWrapper = styled(Box)({
  display: 'flex',
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  minWidth: 110,
});
export default function Table(props) {
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    surface_id,
    hourlyRate,
    maxFieldCount,
  } = props;
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  let actions;
  surfaceId
    ? (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'surfaces'
        ][surfaceId]['actions'])
    : (actions =
        appState[parentRoomId]['bedrooms'][roomId]['surfaces'][parentSurfaceId][
          'actions'
        ]);

  return (
    <TableWrapper>
      <HeaderWrapper>
        <NameWrapper />

        <ActionsWrapper>
          <HeaderCellTyp>Actions</HeaderCellTyp>
        </ActionsWrapper>

        <FieldWrapper pl={0.5}>
          <HeaderCellTyp>Coats</HeaderCellTyp>
        </FieldWrapper>

        <AreaWrapper>
          <HeaderCellTyp>Area</HeaderCellTyp>
        </AreaWrapper>

        <LaborHourWrapper>
          <HeaderCellTyp>Labor Hours</HeaderCellTyp>
        </LaborHourWrapper>

        <OtherFieldWrapper>
          <HeaderCellTyp>Total Labor Cost</HeaderCellTyp>
        </OtherFieldWrapper>

        <LCWrapper>
          <HeaderCellTyp>Actions</HeaderCellTyp>
        </LCWrapper>
      </HeaderWrapper>

      {Object.keys(actions).map((key, pIndex) =>
        Object.keys(actions[key]['dimensions']).map((dimensionKey, index) => (
          <React.Fragment key={index}>
            <ContentWrapper>
              <NameWrapper />
              <ActionsWrapper>
                <EditableAction
                  parentRoomId={parentRoomId}
                  roomId={roomId}
                  parentSurfaceId={parentSurfaceId}
                  surfaceId={surfaceId}
                  surface_id={surface_id}
                  actions={actions}
                  actionId={key}
                  dimensionKey={dimensionKey}
                />
              </ActionsWrapper>

              <FieldWrapper pl={0.5}>
                {surfaceProductionRatesState[surface_id][
                  'surface_production_rates'
                ][key]['has_coats'] && (
                  <CellWrapper>
                    <EditableCell
                      value={
                        actions[key]['dimensions'][dimensionKey]['no_of_coats']
                      }
                      onChange={(e) =>
                        updateDimension(appDispatch, {
                          parentRoomId,
                          roomId,
                          parentSurfaceId,
                          surfaceId,
                          newAction: {
                            id: key,
                          },
                          dimensionKey: dimensionKey,
                          fieldName: 'no_of_coats',
                          fieldValue: e.target.value,
                        })
                      }
                    />
                  </CellWrapper>
                )}
              </FieldWrapper>

              <AreaWrapper>
                <FieldAdjustment
                  surface_id={surface_id}
                  actions={actions}
                  parentRoomId={parentRoomId}
                  roomId={roomId}
                  parentSurfaceId={parentSurfaceId}
                  surfaceId={surfaceId}
                  actionId={key}
                  dimensionKey={dimensionKey}
                  label={'Area Adjustment'}
                  fieldValue={
                    actions[key]['dimensions'][dimensionKey][
                      'areaAdjustment'
                    ] || 0
                  }
                  onChange={(value) =>
                    updateAdjustmentField(appDispatch, {
                      parentRoomId,
                      roomId,
                      parentSurfaceId,
                      surfaceId,
                      newAction: {
                        id: key,
                      },
                      dimensionKey: dimensionKey,
                      fieldName: 'areaAdjustment',
                      fieldValue: value,
                    })
                  }
                  valueWithoutAdjustment={
                    isNaN(
                      eval(
                        getConvertedSurfaceFormula(
                          key,
                          dimensionKey,
                          surface_id,
                          surfaceProductionRatesState
                        )
                      )
                    )
                      ? 0.0
                      : eval(
                          getConvertedSurfaceFormula(
                            key,
                            dimensionKey,
                            surface_id,
                            surfaceProductionRatesState
                          )
                        )
                  }
                  valueWithAdjustment={
                    isNaN(
                      eval(
                        getConvertedSurfaceFormula(
                          key,
                          dimensionKey,
                          surface_id,
                          surfaceProductionRatesState
                        )
                      )
                    )
                      ? 0.0
                      : parseFloat(
                          eval(
                            getConvertedSurfaceFormula(
                              key,
                              dimensionKey,
                              surface_id,
                              surfaceProductionRatesState
                            )
                          )
                        ) +
                        parseFloat(
                          actions[key]['dimensions'][dimensionKey][
                            'areaAdjustment'
                          ]
                            ? actions[key]['dimensions'][dimensionKey][
                                'areaAdjustment'
                              ]
                            : 0
                        )
                  }
                ></FieldAdjustment>
              </AreaWrapper>
              <LaborHourWrapper>
                <FieldAdjustment
                  label={'Hours Adjustment'}
                  fieldValue={
                    actions[key]['dimensions'][dimensionKey][
                      'hoursAdjustment'
                    ] || 0
                  }
                  onChange={(value) =>
                    updateAdjustmentField(appDispatch, {
                      parentRoomId,
                      roomId,
                      parentSurfaceId,
                      surfaceId,
                      newAction: {
                        id: key,
                      },
                      dimensionKey: dimensionKey,
                      fieldName: 'hoursAdjustment',
                      fieldValue: value,
                    })
                  }
                  valueWithoutAdjustment={
                    isNaN(
                      eval(
                        getConvertedSurfaceFormula(
                          key,
                          dimensionKey,
                          surface_id,
                          surfaceProductionRatesState
                        )
                      ) /
                        surfaceProductionRatesState[surface_id][
                          'surface_production_rates'
                        ][key]['pulo']
                    )
                      ? 0.0
                      : parseFloat(
                          parseFloat(
                            parseFloat(
                              eval(
                                getConvertedSurfaceFormula(
                                  key,
                                  dimensionKey,
                                  surface_id,
                                  surfaceProductionRatesState
                                )
                              )
                            ) +
                              parseFloat(
                                actions[key]['dimensions'][dimensionKey][
                                  'areaAdjustment'
                                ]
                                  ? actions[key]['dimensions'][dimensionKey][
                                      'areaAdjustment'
                                    ]
                                  : 0
                              )
                          ) /
                            surfaceProductionRatesState[surface_id][
                              'surface_production_rates'
                            ][key]['pulo']
                        ).toFixed(2)
                  }
                  valueWithAdjustment={
                    isNaN(
                      eval(
                        getConvertedSurfaceFormula(
                          key,
                          dimensionKey,
                          surface_id,
                          surfaceProductionRatesState
                        )
                      ) /
                        surfaceProductionRatesState[surface_id][
                          'surface_production_rates'
                        ][key]['pulo']
                    )
                      ? 0.0
                      : (
                          parseFloat(
                            parseFloat(
                              parseFloat(
                                eval(
                                  getConvertedSurfaceFormula(
                                    key,
                                    dimensionKey,
                                    surface_id,
                                    surfaceProductionRatesState
                                  )
                                )
                              ) +
                                parseFloat(
                                  actions[key]['dimensions'][dimensionKey][
                                    'areaAdjustment'
                                  ]
                                    ? actions[key]['dimensions'][dimensionKey][
                                        'areaAdjustment'
                                      ]
                                    : 0
                                )
                            ) /
                              surfaceProductionRatesState[surface_id][
                                'surface_production_rates'
                              ][key]['pulo']
                          ) +
                          parseFloat(
                            actions[key]['dimensions'][dimensionKey][
                              'hoursAdjustment'
                            ]
                              ? actions[key]['dimensions'][dimensionKey][
                                  'hoursAdjustment'
                                ]
                              : 0
                          )
                        ).toFixed(2)
                  }
                ></FieldAdjustment>
              </LaborHourWrapper>

              <OtherFieldWrapper>
                <LaborCostWrapper>
                  <CellTyp>
                    {'$' +
                      getTotalLaborCost(
                        surfaceProductionRatesState,
                        appState,
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        surfaceId,
                        actions,
                        surface_id,
                        key,
                        dimensionKey,
                        hourlyRate
                      ).toFixed(2)}
                  </CellTyp>
                </LaborCostWrapper>
              </OtherFieldWrapper>

              <LCWrapper justifyContent="center">
                <IconOuterWrapper>
                  <IconWrapper
                    onClick={() =>
                      copyDimensions(appDispatch, {
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        surfaceId,
                        actionId: key,
                        dimensionKey: dimensionKey,
                      })
                    }
                  >
                    <CopyIcon />
                  </IconWrapper>
                  <IconWrapper
                    onClick={() =>
                      removeDimension(appDispatch, {
                        parentRoomId,
                        roomId,
                        parentSurfaceId,
                        surfaceId,
                        newAction: {
                          id: key,
                        },
                        dimensionKey: dimensionKey,
                      })
                    }
                  >
                    <DeleteIcon />
                  </IconWrapper>
                </IconOuterWrapper>
              </LCWrapper>
            </ContentWrapper>
          </React.Fragment>
        ))
      )}
    </TableWrapper>
  );
}
