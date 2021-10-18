import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Dialog as MuiDialog, styled } from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MultipleFileDropZone from '../MultipleFileDropZone';

const TitleTyp = styled(Typography)({
  fontSize: 16,
  fontFamily: 'medium',
});
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
    padding: 8,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <TitleTyp>{children}</TitleTyp>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(() => ({
  root: {
    paddingBlock: 100,
    '&.MuiDialogContent-dividers': {
      paddingInline: 0,
    },
  },
}))(MuiDialogContent);

const Dialog = withStyles(() => ({
  root: {},
  paper: {
    maxWidth: '100%',
    minWidth: '60%',
  },
}))(MuiDialog);
export default function ImagesUploadDialogue(props) {
  const {
    imageFiles,
    setImageFiles,
    open,
    handleClose,
    setImageUploadCount,
  } = props;

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Add Images
      </DialogTitle>
      <DialogContent dividers>
        <MultipleFileDropZone
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          handleClose={handleClose}
          setImageUploadCount={setImageUploadCount}
        />
      </DialogContent>
    </Dialog>
  );
}
