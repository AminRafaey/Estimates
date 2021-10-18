import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { AccordionDetails as MuiAccordionDetails } from '@material-ui/core';
import './creative.css';

const StyledMuiAccordionDetails = withStyles({
  root: {
    padding: 0,
  },
})(MuiAccordionDetails);

export const AccordionDetails = (props) => {
  const { children, ...other } = props;
  return (
    <StyledMuiAccordionDetails {...other}>{children}</StyledMuiAccordionDetails>
  );
};
