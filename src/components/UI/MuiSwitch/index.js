import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Switch as SwicthButton } from '@material-ui/core';

const StyledSwicthButton = withStyles({
  root: {
    color: '#E3E8EE',
  },
})(SwicthButton);

export const MuiSwitch = (props) => {
  const { children, ...other } = props;
  return (
    <StyledSwicthButton color="primary" {...other}>
      {children}
    </StyledSwicthButton>
  );
};
