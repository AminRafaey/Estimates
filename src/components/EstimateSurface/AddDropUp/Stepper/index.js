import React from 'react';
import { default as MuiStepper } from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Add details for new surface';
    case 1:
      return 'Assign default actions and respective production rates';
    case 2:
      return 'Assign default product';
    default:
      return 'Unknown step';
  }
}

export default function Stepper({ steps, activeStep, setActiveStep }) {
  return (
    <MuiStepper activeStep={activeStep}>
      {steps.map((label, index) => {
        const stepProps = {};
        const labelProps = {};

        labelProps.optional = (
          <Typography variant="caption">{getStepContent(index)}</Typography>
        );

        return (
          <Step key={label} {...stepProps}>
            <StepLabel {...labelProps}>{label}</StepLabel>
          </Step>
        );
      })}
    </MuiStepper>
  );
}
