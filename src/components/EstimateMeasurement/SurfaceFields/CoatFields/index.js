import React, { useState } from 'react';
import {
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

const FieldAdjustmentWrapper = styled(Box)({});

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
  paddingBottom: 2,
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
  const {
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    surface_id,
    actions,
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);
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
  const isAnyActionHasCoatsTrue = () => {
    let count = 0;
    Object.keys(actions).map((actionId) => {
      if (!actions[actionId]['selected']) return;
      if (
        !surfaceProductionRatesState[surface_id]['surface_production_rates'][
          actionId
        ]['has_coats']
      )
        return;
      count++;
    });
    if (count == 0) return false;
    return true;
  };
  const handleResetBtnClick = () => {
    Object.keys(actions).map((actionId) => {
      if (!actions[actionId]['selected']) return;
      if (
        !surfaceProductionRatesState[surface_id]['surface_production_rates'][
          actionId
        ]['has_coats']
      )
        return;
      actions[actionId]['no_of_coats'] !=
        surfaceProductionRatesState[surface_id]['surface_production_rates'][
          actionId
        ]['no_of_coats'] &&
        updateCoatsAgainstAction(appDispatch, {
          parentRoomId,
          roomId,
          parentSurfaceId,
          surfaceId,
          actionId,
          no_of_coats:
            surfaceProductionRatesState[surface_id]['surface_production_rates'][
              actionId
            ]['no_of_coats'],
        });
    });
  };
  return (
    <>
      {isAnyActionHasCoatsTrue() && (
        <FieldAdjustmentWrapper>
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
              {Object.keys(actions).map((actionId) => {
                if (!actions[actionId]['selected']) return;
                if (
                  !surfaceProductionRatesState[surface_id][
                    'surface_production_rates'
                  ][actionId]['has_coats']
                )
                  return;
                return (
                  <FieldWrapper key={actionId}>
                    <Grid container>
                      <Grid item xs={6}>
                        <FieldTyp>{actions[actionId]['name']}</FieldTyp>
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
                            value={actions[actionId]['no_of_coats']}
                            onChange={(e) => {
                              updateCoatsAgainstAction(appDispatch, {
                                parentRoomId,
                                roomId,
                                parentSurfaceId,
                                surfaceId,
                                actionId,
                                no_of_coats: e.target.value,
                              });
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
        </FieldAdjustmentWrapper>
      )}
    </>
  );
}
