import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Checkbox as MuiAccordionCheckbox } from '@material-ui/core';

const StyledMuiAccordionCheckbox = withStyles({
  root: {
    color: '#DCDCDC',
    '& .MuiIconButton-label': {
      position: 'relative',
      zIndex: 0,
    },
    '&:not($checked) .MuiIconButton-label:after': {
      content: '""',
      left: 4,
      top: 4,
      height: 15,
      width: 15,
      position: 'absolute',
      backgroundColor: '#FFFFFF',
      zIndex: -1,
    },
  },
})(MuiAccordionCheckbox);

export const Checkbox = (props) => {
  const { ...other } = props;
  return <StyledMuiAccordionCheckbox color="primary" {...other} />;
};
