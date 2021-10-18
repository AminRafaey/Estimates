import React, { useState } from 'react';

import {
  FormControl,
  OutlinedInput,
  Popover,
  Button,
  Slider,
  styled,
  Box,
  Typography,
  withStyles,
  Grid,
} from '@material-ui/core';
import { HighlightColor } from '../../../constants/theme';
import { useSurfaceProductionRatesState } from '../../../../Context/SurfaceProductionRates';
import {
  useAppDispatch,
  updateDimension,
} from '../../../../Context/AppContext';

const FieldAdjustmentWrapper = styled(Box)({});

const ContentWrapper = styled(Box)({
  width: 325,
  padding: 16,
  paddingRight: 32,
});
const ActionWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
});

const DefaultValueTyp = styled(Typography)({
  fontSize: 14,
  paddingBottom: 6,
  display: 'inline',
});
const CellTyp = styled(Typography)({
  fontSize: '14px',
  padding: '12px 12px 12px 7px',
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  color: HighlightColor,
  '&:hover': {
    cursor: 'pointer',
  },
});
const LabelWrapper = styled(Box)({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});
const ValueWrapper = styled(Box)({
  paddingLeft: 16,
});

const StyledPopover = withStyles({
  paper: {
    overflow: 'unset',
    filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, .2))',
  },
})(Popover);
export default function FieldAdjustment(props) {
  const {
    valueWithAdjustment,
    fieldValue,
    onChange,
    valueWithoutAdjustment,
    label,
    surface_id,
    actions,
    parentRoomId,
    roomId,
    parentSurfaceId,
    surfaceId,
    actionId,
    dimensionKey,
  } = props;
  const appDispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const surfaceProductionRatesState = useSurfaceProductionRatesState();

  const handleInputChange = (event) => {
    onChange(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <FieldAdjustmentWrapper>
      <CellTyp aria-describedby={id} onClick={handleClick}>
        {valueWithAdjustment}
      </CellTyp>
      <StyledPopover
        classes={{ paper: 'AdjustmentPopover' }}
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
          <Grid container>
            {label === 'Area Adjustment' &&
              Object.keys(
                surfaceProductionRatesState[surface_id]['surface_fields']
              ).map((fieldKey, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={6}>
                    <LabelWrapper>
                      <DefaultValueTyp>
                        {
                          surfaceProductionRatesState[surface_id][
                            'surface_fields'
                          ][fieldKey]['name']
                        }
                      </DefaultValueTyp>
                    </LabelWrapper>
                  </Grid>
                  <Grid item xs={6}>
                    <ValueWrapper>
                      <FormControl size="small" variant="outlined">
                        <OutlinedInput
                          style={{
                            background: '#ffff',
                            width: 100,
                            marginBottom: 8,
                          }}
                          variant="outlined"
                          type="number"
                          value={
                            actions[actionId]['dimensions'][dimensionKey][
                              surfaceProductionRatesState[surface_id][
                                'surface_fields'
                              ][fieldKey]['name']
                            ]
                          }
                          onChange={(e) =>
                            updateDimension(appDispatch, {
                              parentRoomId,
                              roomId,
                              parentSurfaceId,
                              surfaceId,
                              newAction: {
                                id: actionId,
                              },
                              dimensionKey: dimensionKey,
                              fieldName:
                                surfaceProductionRatesState[surface_id][
                                  'surface_fields'
                                ][fieldKey]['name'],
                              fieldValue: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </ValueWrapper>
                  </Grid>
                </React.Fragment>
              ))}

            <Grid item xs={6}>
              <LabelWrapper>
                <DefaultValueTyp>{label}</DefaultValueTyp>
              </LabelWrapper>
            </Grid>
            <Grid item xs={6}>
              <ValueWrapper>
                <FormControl size="small" variant="outlined">
                  <OutlinedInput
                    style={{ background: '#ffff', width: 100, marginBottom: 8 }}
                    variant="outlined"
                    type="number"
                    value={valueWithAdjustment}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </ValueWrapper>
            </Grid>
            <Grid item xs={6}>
              <LabelWrapper>
                <DefaultValueTyp>Default Value</DefaultValueTyp>
              </LabelWrapper>
            </Grid>
            <Grid item xs={6}>
              <ValueWrapper>
                <DefaultValueTyp variant="subtitle1">
                  {' ' + valueWithoutAdjustment}
                </DefaultValueTyp>
              </ValueWrapper>
            </Grid>
          </Grid>
          <Box pl={2}>
            <Slider
              value={typeof fieldValue === 'number' ? fieldValue : 0}
              max={valueWithoutAdjustment * 2}
              min={valueWithoutAdjustment * -2}
              onChange={(e, newValue) => onChange(newValue)}
              aria-labelledby="input-slider"
            />
          </Box>
          <ActionWrapper>
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => onChange(0)}
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
  );
}
