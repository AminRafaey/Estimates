import React, { useRef, useState, useEffect } from 'react';

import {
  Popover,
  styled,
  Box,
  Typography,
  withStyles,
  Button,
} from '@material-ui/core';
import EstimateSelectionSelect from '../EstimateSelectionSelect';
import ConfirmationDailog from './ConfirmationDailog';
const EstimateSelectionWrapper = styled(Box)({});

const SelectedEstimateTyp = styled(Typography)({
  '&:hover': {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
});

const PopperContentWrapper = styled(Box)({
  padding: 24,
});

const ActionWrapper = styled(Box)({
  paddingTop: 50,
  display: 'flex',
  justifyContent: 'space-between',
});

const StyledPopover = withStyles({
  paper: {
    overflow: 'unset',
    filter: 'drop-shadow(0px 0px 2px rgba(0, 0, 0, .2))',
  },
})(Popover);
export default function EstimateSelection(props) {
  const { estimates, getEstimatesLoader, selected, setSelected } = props;

  const selectedInitialRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  useEffect(() => {
    selected &&
      !selectedInitialRef.current &&
      (selectedInitialRef.current = selected);
  }, [selected]);

  useEffect(() => {
    open && handleClose();
    currentSelection && setOpenModal(true);
  }, [currentSelection]);

  useEffect(() => {
    !openModal && setCurrentSelection(null);
  }, [openModal]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <EstimateSelectionWrapper>
      <SelectedEstimateTyp
        variant={'h2'}
        aria-describedby={id}
        onClick={handleClick}
      >
        {'Estimate #' + (window.localStorage.getItem('ESTIMATE_ID') || '')}
      </SelectedEstimateTyp>
      <StyledPopover
        PaperProps={{ elevation: 2 }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <PopperContentWrapper>
          <EstimateSelectionSelect
            setSelected={setSelected}
            selected={selected}
            setCurrentSelection={setCurrentSelection}
            options={estimates}
            getEstimatesLoader={getEstimatesLoader}
          />
          <ActionWrapper>
            <Button
              style={{ marginLeft: -11 }}
              variant="text"
              color="primary"
              size="small"
              onClick={() => setSelected(selectedInitialRef.current)}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleClose}
            >
              Save
            </Button>
          </ActionWrapper>
        </PopperContentWrapper>
      </StyledPopover>
      <ConfirmationDailog
        open={openModal}
        setOpen={setOpenModal}
        currentSelection={currentSelection}
        setSelected={setSelected}
      />
    </EstimateSelectionWrapper>
  );
}
