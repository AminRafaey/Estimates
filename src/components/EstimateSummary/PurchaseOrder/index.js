import React from 'react';
import {
  styled,
  Box,
  Grid,
  Typography,
  Button,
  withStyles,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useAppState } from '../../../Context/AppContext';
import { Alert as MuiAlert } from '@material-ui/lab';
import { isAnySurfaceHasDim } from '../utility';
import Table from '../Table';
import { ReportTable } from '../../UI';
export const surfaceStyling = {
  background: '#ffff',
  fontFamily: 'Medium',
};

export const contactInfoStyling = {
  borderRadius: '5px',
  background: 'rgb(247, 250, 252)',
  padding: '19px 22px',
  marginTop: 25,
};

export const headingStyling = {
  fontSize: '14px',
  fontFamily: 'Medium',
};
const SummaryWrapper = styled(Box)({
  background: '#ffffff',
});
const InfoWrapper = styled(Box)({
  padding: '40px 28px 0px',
});

const BoldHeadingWrapper = styled(Box)({
  ...headingStyling,
  color: 'black',
});

const ContentTyp = styled(Typography)({
  fontSize: '13px',
});

const DetailRightWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
});

const StyledButton = withStyles({
  root: {
    border: '#E3E8EE 1px solid',
    height: 31,
    marginLeft: 15,
    minWidth: 0,
    padding: 0,
  },
})(Button);

const PDFButton = withStyles({
  root: {
    height: 31,
    marginLeft: 15,
    minWidth: 0,
    padding: '0px 26px',
  },
})(Button);
const StyledMoreVertIcon = withStyles({
  root: {
    color: '#E3E8EE',
  },
})(MoreVertIcon);

const CustomerCopyWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});

function PurchaseOrder(props) {
  const { pdfExportComponent, customerCopyWidth } = props;
  const appState = useAppState();

  if (!isAnySurfaceHasDim(appState)) {
    return (
      <Alert severity="warning">Please select actions against surfaces</Alert>
    );
  }
  return (
    <CustomerCopyWrapper>
      <SummaryWrapper
        style={{
          maxWidth: customerCopyWidth,
        }}
      >
        <InfoWrapper>
          <Grid container spacing={0}>
            <Grid item xs={12} md={7}>
              <BoldHeadingWrapper>Detailed Report</BoldHeadingWrapper>
              <ContentTyp>
                Customer Details go here. All the dummy text and inital details
                to explain the procedure and how would the job work
              </ContentTyp>
            </Grid>
            <Grid item xs={false} md={1} />
            <Grid item xs={12} md={4}>
              <DetailRightWrapper>
                <PDFButton
                  variant="outlined"
                  onClick={() => pdfExportComponent.current.save()}
                  color="primary"
                >
                  PDF
                </PDFButton>

                <StyledButton variant="outlined">
                  <StyledMoreVertIcon />
                </StyledButton>
              </DetailRightWrapper>
            </Grid>
          </Grid>
        </InfoWrapper>
        <ReportTable type={'Products by action'} label={'Action'}>
          <Table />
        </ReportTable>
      </SummaryWrapper>
    </CustomerCopyWrapper>
  );
}

PurchaseOrder.defaultProps = {};

PurchaseOrder.propTypes = {};
export default PurchaseOrder;
