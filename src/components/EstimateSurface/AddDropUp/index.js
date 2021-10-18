import React, { useState } from 'react';

import {
  Popover,
  styled,
  Box,
  withStyles,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import AddTwoToneIcon from '@material-ui/icons/AddTwoTone';
import AddSurfaceModal from './AddSurfaceModal';

const FixedWrapper = styled(Box)({
  position: 'fixed',
  bottom: 50,
  left: 45,
});

const IconWrapper = styled(Box)({
  background: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 15,
  borderRadius: '50%',
  '&:hover': {
    cursor: 'pointer',
  },
});

const ContentWrapper = styled(Box)({
  width: 300,
});

const StyledPopover = withStyles({
  paper: {
    overflow: 'unset',
    filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, .2))',
  },
})(Popover);

const StyledAddTwoToneIcon = withStyles({
  root: {
    fill: '#1488FC',
  },
})(AddTwoToneIcon);

function AddDropUp() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddSurfaceDailogue, setOpenAddSurfaceDailogue] = useState(false);

  const listItems = [
    { label: 'Add a surface', onClick: () => setOpenAddSurfaceDailogue(true) },
  ];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <React.Fragment>
      <FixedWrapper>
        <IconWrapper aria-describedby={id} onClick={handleClick}>
          <StyledAddTwoToneIcon />
        </IconWrapper>

        <StyledPopover
          classes={{ paper: 'AddDropUp' }}
          PaperProps={{ elevation: 2 }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <ContentWrapper>
            <List component="nav">
              {listItems.map((l, i) => (
                <ListItem
                  button
                  key={i}
                  onClick={() => {
                    l.onClick();
                    handleClose();
                  }}
                >
                  <ListItemText primary={l.label} />
                </ListItem>
              ))}
            </List>
          </ContentWrapper>
        </StyledPopover>
      </FixedWrapper>
      <AddSurfaceModal
        open={openAddSurfaceDailogue}
        setOpen={setOpenAddSurfaceDailogue}
      />
    </React.Fragment>
  );
}

export default AddDropUp;
