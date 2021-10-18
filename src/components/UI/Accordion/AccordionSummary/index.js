import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AccordionSummary as MuiAccordionSummary } from '@material-ui/core';

const StyledMuiAccordionSummary = withStyles({
  root: {
    padding: 0,
    '&.Mui-expanded': {
      minHeight: `initial !important`,
    },
  },
  content: {
    margin: 0,
    width: '100%',
  },
})(MuiAccordionSummary);

export const AccordionSummary = (props) => {
  const { children, ...other } = props;
  return (
    <StyledMuiAccordionSummary {...other}>{children}</StyledMuiAccordionSummary>
  );
};
