import React from 'react';
import 'antd/dist/antd.css';
import { styled, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { HighlightColor } from '../../../constants/theme';
import { default as ToggleButtons } from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const StyledToggleButton = withStyles((theme) => ({
  root: {
    border: 'none',
    padding: '8px 26px',
    background: 'white',
    color: '#9a9a9d',
    fontFamily: 'Medium',
    border: '1px #E9EEF5 solid',
    marginLeft: '1px!important',
    '&:hover': {
      background: 'white',
    },
  },
  label: {
    fontSize: '12px',
    fontFamily: 'Medium',
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

const ToggleButton = ({ toggleArray, handler, selected, styling }) => {
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
              {...(styling && { style: { ...styling } })}
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
