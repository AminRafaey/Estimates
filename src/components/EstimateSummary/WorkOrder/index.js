import React, { useRef } from 'react';
import {
  styled,
  Box,
  Grid,
  Typography,
  Button,
  withStyles,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ActionTable from './ActionTable';
import { useAppState } from '../../../Context/AppContext';
import { Alert as MuiAlert } from '@material-ui/lab';
import { useWidth } from '../../Assets';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../Context/ProductContext';
import {
  getTotalCostOfSurface,
  isAnySurfaceHasDim,
  isRoomHasAnyDim,
} from '../utility';
import Table from '../Table';
import { ReportTable } from '../../UI';
const simpleTableBg = 'rgba(247, 250, 252, 1)';
const tableAlternateBg = 'rgba(247, 250, 252, 0.5)';
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

const ColoredTyp = styled(Typography)({
  ...headingStyling,
  color: '#1488FC',
  paddingTop: 4,
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

const RoomPriceTyp = styled(Typography)({
  ...headingStyling,
  color: '#1488FC',
  paddingLeft: 24,
});
const RoomLeftHeaderWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end',
  marginBottom: 25,
  paddingLeft: 16,
});
const SummaryInnerWrapper = styled(Box)({
  borderTop: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
  backgroundColor: simpleTableBg,
  paddingTop: 20,
  paddingBottom: 20,
  marginBottom: 20,
});

const SIIWrapper = styled(Box)({
  paddingTop: 25,
});

const RoomNameTyp = styled(Typography)({
  ...headingStyling,
  fontSize: 16,
  color: 'black',
});

const CustomerCopyWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const LineBreakWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '50px 0px 10px',
});
const LineBreak = styled(Box)({
  width: '10%',
  height: 1,
  background: '#E3E8EE',
});

const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});

function WorkOrder(props) {
  const { pdfExportComponent, customerCopyWidth } = props;
  const width = useWidth();
  const appState = useAppState();
  const productState = useProductState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  if (!isAnySurfaceHasDim(appState)) {
    return (
      <Alert severity="warning">Please select actions against surfaces</Alert>
    );
  }

  const calculateRoomCost = (parentRoomId, roomId) => {
    let total = 0;

    Object.keys(appState[parentRoomId]['bedrooms'][roomId]['surfaces']).map(
      (parentSurfaceId) => {
        if (
          Object.entries(
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces']
          ).length < 1
        ) {
          if (
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['included']
          ) {
            total += getTotalCostOfSurface(
              surfaceProductionRatesState,
              productState,
              appState,
              parentRoomId,
              roomId,
              parentSurfaceId,
              undefined,
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surface_id'],
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['actions']
            );
          }
          return;
        }
        Object.keys(
          appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
            parentSurfaceId
          ]['surfaces']
        ).map((surfaceId) => {
          if (
            appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
              parentSurfaceId
            ]['surfaces'][surfaceId]['included']
          ) {
            total += getTotalCostOfSurface(
              surfaceProductionRatesState,
              productState,
              appState,
              parentRoomId,
              roomId,
              parentSurfaceId,
              surfaceId,
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['surface_id'],
              appState[parentRoomId]['bedrooms'][roomId]['surfaces'][
                parentSurfaceId
              ]['surfaces'][surfaceId]['actions']
            );
          }
        });
      }
    );
    return isNaN(total) ? 0 : total;
  };

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

        <ReportTable type="Hours by Surface" label="Room">
          <Table />
        </ReportTable>
        <LineBreakWrapper>
          <LineBreak />
        </LineBreakWrapper>
        <ReportTable type="Products by room" label="Room">
          <Table />
        </ReportTable>
      </SummaryWrapper>
    </CustomerCopyWrapper>
  );
}

WorkOrder.defaultProps = {};

WorkOrder.propTypes = {};
export default WorkOrder;
