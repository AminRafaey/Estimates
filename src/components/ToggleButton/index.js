import React from 'react';
import 'antd/dist/antd.css';
import { styled, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { HighlightColor } from '../constants/theme';
import { default as ToggleButtons } from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const StyledToggleButton = withStyles((theme) => ({
  root: {
    border: 'none',
    padding: '08px 30px 08px 30px',
    marginLeft: '2px!important',
    background: 'white',
    color: 'black',
    '&:hover': {
      background: 'white',
    },
  },
  label: {
    fontSize: '14px',
    textTransform: 'capitalize',
  },
  selected: {
    background: 'white!important',
    '& .MuiToggleButton-label': {
      color: HighlightColor,
      fontFamily: 'Medium',
    },
  },
}))(ToggleButtons);

const ToggleButtonGroupWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ToggleButton = ({ toggleArray, handler, selected }) => {
  return (
    <ToggleButtonGroupWrapper>
      <ToggleButtonGroup value={selected}>
        {toggleArray.map((t) => {
          return (
            <StyledToggleButton
              disableRipple={true}
              onClick={() => handler(t.value)}
              value={t.value}
              key={t.value}
            >
              {t.label}
            </StyledToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </ToggleButtonGroupWrapper>
  );
};
export default ToggleButton;
