import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Select as MuiSelectMenu } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    background: (props) => (props.background ? `${props.background}` : '#ffff'),
    padding: '8px',
    minWidth: 125,
  },
}));

export const SelectMenu = (props) => {
  const { children, background, ...other } = props;
  const classes = useStyles(props);
  return (
    <MuiSelectMenu {...other} classes={{ root: classes.root }}>
      {children}
    </MuiSelectMenu>
  );
};
