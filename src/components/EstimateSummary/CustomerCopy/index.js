import React, { useRef } from 'react';
import {
  styled,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  withStyles,
} from '@material-ui/core';
import companyLogo from '../../../public/images/logo.jpg';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useAppState } from '../../../Context/AppContext';
import { Alert as MuiAlert } from '@material-ui/lab';
import { useWidth } from '../../Assets';
import { isAnySurfaceHasDim } from '../utility';
import Table from '../Table';
import { ReportTable } from '../../UI';
import {
  useReportState,
  useReportDispatch,
  addReportAtPosition,
} from '../../../Context/Report';
import { useDrag, useDrop } from 'react-dnd';

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
  margin: 18,
  padding: '0px 10px 0px',
});
const RightWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  flexDirection: 'column',
  width: '100%',
});

const TextFieldWrapper = styled(Box)({
  background: 'rgb(247, 250, 252)',
  width: 'fit-content',
  height: 'fit-content',
});

const NumTyp = styled(Typography)({
  fontSize: 13,
  paddingTop: 6,
  lineHeight: 1,
  wordBreak: 'break-all',
});

const RightContentWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '20px',
});

const CompanyContactWrapper = styled(Box)({
  ...contactInfoStyling,
  border: '1px solid #E3E8EE',
  width: '100%',
});

const ClientContactWrapper = styled(Box)({
  ...contactInfoStyling,
  border: '3px solid #1488FC',
  width: '100%',
});
const BoldHeadingWrapper = styled(Box)({
  ...headingStyling,
  color: 'black',
});

const ContentTyp = styled(Typography)({
  fontSize: '13px',
});

const LogoWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
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

const DetailWrapper = styled(Box)({
  paddingTop: 45,
});

const LabelWrapper = styled(Box)({
  minWidth: '150px',
});
const CustomerCopyWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});

function CustomerCopy(props) {
  const {
    pdfExportComponent,
    customerCopyWidth,
    scrollRef,
    scrollToEnd,
  } = props;
  const width = useWidth();
  const appState = useAppState();
  const report = useReportState();
  const reportDispatch = useReportDispatch();
  const dropRef = useRef();

  const [{ hoveringItem, canDrop, isOver }, drop] = useDrop({
    accept: ['Report_Type'],
    drop: (item) => {
      item &&
        item.type === 'Report_Type' &&
        report.length === 0 &&
        addReport(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.getItem() && monitor.getItem().type === 'Report_Type',
      hoveringItem: monitor.getItem(),
    }),
  });

  const addReport = (item) => {
    addReportAtPosition(reportDispatch, {
      index: 0,
      report: {
        ...item.report,
        position: 1,
      },
    });
    setTimeout(() => scrollToEnd(), 250);
  };
  drop(dropRef);

  if (!isAnySurfaceHasDim(appState)) {
    return (
      <Alert severity="warning">Please select actions against surfaces</Alert>
    );
  }
  return (
    <CustomerCopyWrapper ref={dropRef}>
      <SummaryWrapper
        style={{
          maxWidth: customerCopyWidth,
          ...(width !== 'xs'
            ? { padding: '49px 0px 70px' }
            : { padding: '49px 0px 10px' }),
        }}
      >
        <InfoWrapper>
          <Grid container spacing={0}>
            <Grid item xs={12} md={5}>
              <LogoWrapper>
                <img
                  src={companyLogo}
                  style={{
                    width: 225,
                  }}
                />
              </LogoWrapper>
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item xs={12} md={5}>
              <RightWrapper>
                <RightContentWrapper>
                  <LabelWrapper>
                    <NumTyp>Estimate Number</NumTyp>
                  </LabelWrapper>
                  <TextFieldWrapper>
                    <TextField size="small" variant="outlined" />
                  </TextFieldWrapper>
                </RightContentWrapper>
                <RightContentWrapper>
                  <LabelWrapper>
                    <NumTyp>Title</NumTyp>
                  </LabelWrapper>
                  <TextFieldWrapper>
                    <TextField size="small" variant="outlined" />
                  </TextFieldWrapper>
                </RightContentWrapper>
                <RightContentWrapper>
                  <LabelWrapper>
                    <NumTyp>Estimate Date</NumTyp>
                  </LabelWrapper>
                  <TextFieldWrapper>
                    <TextField size="small" variant="outlined" />
                  </TextFieldWrapper>
                </RightContentWrapper>
              </RightWrapper>
            </Grid>
          </Grid>
          <Grid container spacing={0}>
            <Grid item xs={12} md={5}>
              <CompanyContactWrapper>
                <BoldHeadingWrapper>MDH Painting</BoldHeadingWrapper>
                <ContentTyp>
                  Company Address, United States
                  <br />
                  company@email.com
                  <br />
                  +800 123 4567
                </ContentTyp>
              </CompanyContactWrapper>
            </Grid>
            <Grid item md={2}></Grid>
            <Grid item xs={12} md={5}>
              <RightContentWrapper>
                <ClientContactWrapper>
                  <BoldHeadingWrapper>Contact Name</BoldHeadingWrapper>
                  <ContentTyp>
                    Contact Address, United
                    <br />
                    contact@email.com
                    <br />
                    +800 123 4567
                  </ContentTyp>
                </ClientContactWrapper>
              </RightContentWrapper>
            </Grid>
          </Grid>
          <DetailWrapper>
            <Grid container spacing={0}>
              <Grid item xs={12} md={7}>
                <BoldHeadingWrapper>Detailed Report</BoldHeadingWrapper>
                <ContentTyp>
                  Customer Details go here. All the dummy text and inital
                  details to explain the procedure and how would the job work
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
          </DetailWrapper>
        </InfoWrapper>

        {report.map((rep, index) => (
          <ReportTable
            index={index}
            type={rep.reportType}
            label={rep.label}
            selected={rep.selected}
            options={rep.options}
          >
            <Table />
          </ReportTable>
        ))}
        <div ref={scrollRef} />
      </SummaryWrapper>
    </CustomerCopyWrapper>
  );
}

CustomerCopy.defaultProps = {};

CustomerCopy.propTypes = {};
export default CustomerCopy;
