import React, { useState } from 'react';

import {
  Popover,
  styled,
  Box,
  withStyles,
  Button,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { HighlightColor } from '../../constants/theme';
import SettingsIcon from '@material-ui/icons/Settings';
import { useLocation } from 'react-router-dom';
import { sendMagicLink } from '../../../api/Auth';

const FieldAdjustmentWrapper = styled(Box)({});

const ContentWrapper = styled(Box)({
  width: 250,
  padding: 16,
  paddingRight: 32,
});

const StyledPopover = withStyles({
  paper: {
    overflow: 'unset',
    filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, .2))',
    marginTop: 35,
  },
})(Popover);

const StyeldSettingsIcon = withStyles({
  root: {
    color: '#9A9A9D',
    '&:hover': {
      cursor: 'pointer',
    },
    '&:active': {
      color: HighlightColor,
    },
  },
})(SettingsIcon);
const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);

const useStyles = makeStyles({
  paperStyle: {
    overflow: 'unset',
    filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, .2))',
    marginTop: (props) => props.topMargin,
  },
});

export default function Settings(props) {
  const { paperStyle } = useStyles(props);
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [magicLinkLoader, setMagicLinkLoader] = useState(false);
  const [btnClicked, setBtnClicked] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMagicLinkBtn = () => {
    setMagicLinkLoader(true);
    sendMagicLink(location.pathname)
      .then((res) => {
        setMagicLinkLoader(false);
        setBtnClicked(true);
      })
      .catch((err) => {
        setMagicLinkLoader(false);
      });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <FieldAdjustmentWrapper>
      <StyeldSettingsIcon aria-describedby={id} onClick={handleClick} />
      <StyledPopover
        classes={{ paper: paperStyle }}
        PaperProps={{ elevation: 2 }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <ContentWrapper>
          {magicLinkLoader ? (
            <CircularProgress color="primary" size={30} />
          ) : (
            <StyledButton
              size="large"
              onClick={handleMagicLinkBtn}
              color="primary"
              disabled={btnClicked}
            >
              Send Magic Link
            </StyledButton>
          )}
        </ContentWrapper>
      </StyledPopover>
    </FieldAdjustmentWrapper>
  );
}
