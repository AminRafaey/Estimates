import React, { useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';

import {
  Dialog,
  Typography,
  Box,
  styled,
  CircularProgress,
  Button,
} from '@material-ui/core';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogActions from '@material-ui/core/DialogActions';

import Slide from '@material-ui/core/Slide';
import Stepper from '../Stepper';
import AddSurfaceForm from './AddSurfaceForm';
import PRForm from './PRForm';
import DefaultProdForm from './DefaultProdForm';
import Toast from '../../../Toast';
import {
  useSurfaceSelectionState,
  useSurfaceSelectionDispatch,
  addSurface,
} from '../../../../Context/SurfaceSelectionContext';
import { useSessionDispatch } from '../../../../Context/Session';
import { saveSurfaceAtTheGo } from '../../../../api/estimateSurface';
import { saveSurfaceProductionRate } from '../../../../api/estimateAction';
import { saveProductProductionRate } from '../../../../api/estimateProduct';
import { dataTypes } from '../../../constants/addASurface';
const StepperWrapper = styled(Box)({
  paddingInline: 20,
});

const LoadingWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  width: 100,
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: '16px 0px 16px',
    paddingInline: theme.spacing(3),
  },
}))(MuiDialogActions);

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Medium',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography className={classes.title}>{children}</Typography>
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

export default function AddSurfaceModal({ open, setOpen }) {
  const surfaceSelectionState = useSurfaceSelectionState();
  const surfaceSelectionDispatch = useSurfaceSelectionDispatch();

  const sessionDispatch = useSessionDispatch();
  const [surface, setSurface] = useState({
    name: '',
    unit_id: '',
    formula: '',
    surfaceFields: [{ name: '', surface_field_type_id: dataTypes[0]['id'] }],
    position: Math.max(...surfaceSelectionState.map((s) => s.position)) + 1,
  });
  const [actions, setActions] = useState([]);
  const [actionsContainPRRates, setActionsContainPRRates] = useState([]);
  const [products, setProducts] = useState([]);

  const unitRef = useRef(null);

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState({
    0: false,
    1: false,
    2: false,
  });

  const steps = ['Add Surface', 'Add Production Rates', 'Add Products'];

  const handleClose = () => {
    setOpen(false);
    resetStates();
  };

  const resetStates = () => {
    setSurface({
      name: '',
      unit_id: '',
      formula: '',
      surfaceFields: [{ name: '', surface_field_type_id: dataTypes[0]['id'] }],
      position: Math.max(...surfaceSelectionState.map((s) => s.position)) + 1,
    });
    setActions([]);
    setActionsContainPRRates([]);
    setActiveStep(0);
    setIsSubmitClicked({
      0: false,
      1: false,
      2: false,
    });
  };

  const handleNext = () => {
    if (activeStep === 0) {
      setIsSubmitClicked({ ...isSubmitClicked, [activeStep]: true });
      if (surface.name && surface.unit_id && surface.formula) {
        try {
          let convertedFormula = surface.formula;
          surface.surfaceFields.map((s) => {
            s.name &&
              (convertedFormula = convertedFormula.replaceAll(s.name, 10));
          });
          eval(convertedFormula);

          setLoading(true);
          saveSurfaceAtTheGo(sessionDispatch, surface).then((res) => {
            if (res) {
              Toast('Estimate Surface', res.message, 'success');
              setSurface(res.data);
              setLoading(false);
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
              setLoading(false);
            }
          });
        } catch (e) {
          Toast(
            'Surface Formula',
            'Surface formula contains invalid expression/s!',
            'error'
          );
        }
      }
    } else if (activeStep === 1) {
      setIsSubmitClicked({ ...isSubmitClicked, [activeStep]: true });
      if (actionsContainPRRates.length == 0) return;
      setLoading(true);
      saveSurfaceProductionRate(
        sessionDispatch,
        actions.map((a) => ({
          actionId: a.id,
          surfaceId: surface.id,
          workRate: a.workRate,
          spreadRate: a.spreadRate,
        }))
      ).then((res) => {
        if (res) {
          Toast('Surface Production Rates', res.message, 'success');
          setLoading(false);
          setIsSubmitClicked({ ...isSubmitClicked, [activeStep]: true });
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
          setLoading(false);
        }
      });
    } else if (activeStep === 2) {
      setLoading(true);
      saveProductProductionRate(
        sessionDispatch,
        actionsContainPRRates
          .filter((a) => a.product)
          .map((a) => ({
            actionId: a.id,
            surfaceId: surface.id,
            productId: a.product.id,
            spreadRate: a.spreadRate,
            ...(a.product.component && { componentId: a.product.component.id }),
            ...(a.product.sheen && { sheenId: a.product.sheen.id }),
          }))
      ).then((res) => {
        if (res) {
          addSurface(surfaceSelectionDispatch, {
            surface: {
              id: surface.id,
              surface_id: surface.id,
              estimate_surface_id: surface.estimate_surface.id,
              name: surface.name,
              actual_name: surface.estimate_surface.name,
              position: surface.estimate_surface.position,
              selected: surface.estimate_surface.selected,
              numOfChildren: 0,
              surfaces: [],
            },
          });
          Toast('Product Production Rates', res.message, 'success');
          setLoading(false);
          setOpen(false);
          resetStates();
        } else {
          setLoading(false);
        }
      });

      setIsSubmitClicked({ ...isSubmitClicked, [activeStep]: true });
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Dialog
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="customized-dialog-title"
      fullWidth={true}
      maxWidth={'lg'}
      open={open}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Add a surface
      </DialogTitle>
      <StepperWrapper>
        <Stepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          steps={steps}
        />
      </StepperWrapper>

      {activeStep === 0 && (
        <AddSurfaceForm
          isSubmitClicked={isSubmitClicked[activeStep]}
          surface={surface}
          setSurface={setSurface}
          unitRef={unitRef}
        />
      )}

      {activeStep === 1 && (
        <PRForm
          isSubmitClicked={isSubmitClicked[activeStep]}
          actions={actions}
          setActions={setActions}
          surfaceId={surface.id}
          actionsContainPRRates={actionsContainPRRates}
          setActionsContainPRRates={setActionsContainPRRates}
        />
      )}

      {activeStep === 2 && (
        <DefaultProdForm
          isSubmitClicked={isSubmitClicked[activeStep]}
          products={products}
          setProducts={setProducts}
          actionsContainPRRates={actionsContainPRRates}
          setActionsContainPRRates={setActionsContainPRRates}
        />
      )}

      <DialogActions>
        {activeStep === 0 ? (
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        ) : (
          <Button onClick={handleBack}>Back</Button>
        )}
        {loading ? (
          <LoadingWrapper>
            <CircularProgress color="primary" size={28} />
          </LoadingWrapper>
        ) : (
          <Button
            onClick={() => {
              handleNext();
            }}
            color="primary"
            variant="contained"
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
