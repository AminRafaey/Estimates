import React from 'react';
import { withStyles, Tooltip as MuiTooltip, Fade } from '@material-ui/core';

const StyledTooltip = withStyles({
  tooltip: {
    fontSize: 13,
    width: 'fit-content',
  },
})(MuiTooltip);

export const Tooltip = (props) => {
  const { ...other } = props;
  return (
    <StyledTooltip arrow interactive TransitionComponent={Fade} {...other} />
  );
};
