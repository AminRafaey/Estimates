import React, { useState } from 'react';
import {
  useAppState,
  useAppDispatch,
  updateCoatsAgainstAction,
} from '../../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import {
  FormControl,
  OutlinedInput,
  Popover,
  styled,
  Box,
  Typography,
  withStyles,
  Grid,
  Button,
} from '@material-ui/core';
import { HighlightColor } from '../../../constants/theme';

const ContentWrapper = styled(Box)({
  width: 300,
  padding: 16,
  paddingRight: 32,
});

const CellTyp = styled(Typography)({
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  paddingTop: 12,
  color: HighlightColor,
  '&:hover': {
    cursor: 'pointer',
  },
});

const FieldWrapper = styled(Box)({ paddingBottom: 16 });
const FieldTyp = styled(Typography)({
  fontSize: 14,
  height: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: 16,
  textAlign: 'end',
});
const ActionWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: 12,
});

const StyledPopover = withStyles({
  paper: {
    overflow: 'unset',
    filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, .2))',
  },
})(Popover);
export default function CoatFields(props) {
  const { parentSurfaceId, surfaceId, surface_id, actions } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const isAnySelectedActionHasCoatsTrue = () => {
    let count = 0;
    actions.map((action) => {
      if (!action['selected']) return;
      if (
        !surfaceProductionRatesState[surface_id]['surface_production_rates'][
          action.id
        ]['has_coats']
      )
        return;
      count++;
    });
    if (count == 0) return false;
    return true;
  };

  const handleChange = (e, actionId) => {
    Object.keys(appState).map((parentRoomId) => {
      Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
        if (
          !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
          !appState[parentRoomId]['bedrooms'][roomId]['included']
        )
          return;
        Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
          (PSId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'surfaces'
                ]
              ).length < 1
            ) {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'included'
                ] &&
                PSId === parentSurfaceId
              ) {
                updateCoatsAgainstAction(appDispatch, {
                  parentRoomId,
                  roomId,
                  parentSurfaceId,
                  surfaceId,
                  actionId,
                  no_of_coats: e.target.value,
                });
              }
              return;
            }
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                'surfaces'
              ]
            ).map((SId) => {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'surfaces'
                ][SId]['included'] &&
                SId == surfaceId
              ) {
                updateCoatsAgainstAction(appDispatch, {
                  parentRoomId,
                  roomId,
                  parentSurfaceId,
                  surfaceId,
                  actionId,
                  no_of_coats: e.target.value,
                });
              }
            });
          }
        );
      });
    });
  };

  const getValue = (actionId) => {
    let value = -1;
    Object.keys(appState).map((parentRoomId) => {
      Object.keys(appState[parentRoomId]['bedrooms']).map((roomId) => {
        if (
          !appState[parentRoomId]['bedrooms'][roomId]['surfaces'] ||
          !appState[parentRoomId]['bedrooms'][roomId]['included']
        )
          return;
        Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
          (PSId) => {
            if (
              Object.entries(
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'surfaces'
                ]
              ).length < 1
            ) {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'included'
                ] &&
                PSId === parentSurfaceId
              ) {
                if (value === -1) {
                  value =
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      PSId
                    ]['actions'][actionId]['no_of_coats'];
                } else {
                  value !=
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      PSId
                    ]['actions'][actionId]['no_of_coats'] && (value = 0);
                }
              }
              return;
            }
            Object.keys(
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                'surfaces'
              ]
            ).map((SId) => {
              if (
                appState[parentRoomId]['bedrooms'][roomId]['surfaces'][PSId][
                  'surfaces'
                ][SId]['included'] &&
                SId == surfaceId
              ) {
                if (value === -1) {
                  value =
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      PSId
                    ]['surfaces'][SId]['actions'][actionId]['no_of_coats'];
                } else {
                  value !=
                    appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                      PSId
                    ]['surfaces'][SId]['actions'][actionId]['no_of_coats'] &&
                    (value = 0);
                }
              }
            });
          }
        );
      });
    });
    if (value === -1 || value === 0) {
      return '';
    } else {
      return value;
    }
  };

  const handleResetBtnClick = () => {
    actions.map((action) => {
      if (!action['selected']) return;
      if (
        !surfaceProductionRatesState[surface_id]['surface_production_rates'][
          action.id
        ]['has_coats']
      )
        return;
      const defaultCoats =
        surfaceProductionRatesState[surface_id]['surface_production_rates'][
          action.id
        ]['no_of_coats'];
      getValue(action.id) != defaultCoats &&
        handleChange({ target: { value: defaultCoats } }, action.id);
    });
  };
  return (
    <>
      {isAnySelectedActionHasCoatsTrue() && (
        <Box>
          <CellTyp aria-describedby={id} onClick={handleClick}>
            {'Coats'}
          </CellTyp>
          <StyledPopover
            classes={{ paper: 'CoatFieldPopover' }}
            PaperProps={{ elevation: 2 }}
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          >
            <ContentWrapper>
              {actions.map((action) => {
                if (!action['selected']) return;
                if (
                  !surfaceProductionRatesState[surface_id][
                    'surface_production_rates'
                  ][action.id]['has_coats']
                )
                  return;
                return (
                  <FieldWrapper key={action.id}>
                    <Grid container>
                      <Grid item xs={6}>
                        <FieldTyp>{action['name']}</FieldTyp>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl
                          style={{
                            paddingLeft: 16,
                          }}
                          size="small"
                          variant="outlined"
                        >
                          <OutlinedInput
                            style={{
                              width: 80,
                            }}
                            variant="outlined"
                            value={getValue(action.id)}
                            onChange={(e) => {
                              handleChange(e, action.id);
                            }}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </FieldWrapper>
                );
              })}
              <ActionWrapper>
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={handleResetBtnClick}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleClose}
                >
                  Save
                </Button>
              </ActionWrapper>
            </ContentWrapper>
          </StyledPopover>
        </Box>
      )}
    </>
  );
}
