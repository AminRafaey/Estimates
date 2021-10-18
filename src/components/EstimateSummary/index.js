import React, { useState, useRef, useEffect, createRef } from 'react';
import { PDFExport } from '@progress/kendo-react-pdf';
import ToggleButton from '../ToggleButton';
import CustomerCopy from './CustomerCopy';
import PurchaseOrder from './PurchaseOrder';
import WorkOrder from './WorkOrder';
import RightNav from './RightNav/index';

import { Box, styled, Grid } from '@material-ui/core';

const ToggleWrapper = styled(Box)({ marginBottom: '52px', paddingTop: '96px' });

const ParentWrapper = styled(Box)({
  overflowY: 'scroll',
  height: 'calc(100vh - 74px)',
});
function EstimateSummary() {
  const [summaryPageOption, setSummaryPageOption] = useState('customer_copy');
  const pdfExportComponent = useRef();
  const customerCopyWidthRef = useRef();
  const [customerCopyWidth, setCusomerCopyWidth] = useState(null);
  const [view, setView] = useState('PDF');

  const ppiBoxRef = createRef(null);
  const scrollRef = createRef();
  useEffect(() => {
    if (view === 'PDF') {
      if (ppiBoxRef.current) {
        setCusomerCopyWidth(ppiBoxRef.current.offsetWidth);
        customerCopyWidthRef.current = ppiBoxRef.current.offsetWidth;
      } else {
        setCusomerCopyWidth(customerCopyWidthRef.current);
      }
    } else {
      setCusomerCopyWidth('100%');
    }
  }, [view]);

  const handleSurfacePage = (label) => {
    setSummaryPageOption(label);
  };

  const scrollToEnd = () =>
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });

  return (
    <Grid container>
      <Grid item xs={9}>
        <ParentWrapper className={'scrollElement'}>
          <ToggleWrapper>
            <ToggleButton
              toggleArray={[
                { label: 'Customer Copy', value: 'customer_copy' },
                { label: 'Work Order', value: 'work_order' },
                { label: 'Purchase Order', value: 'purchase_order' },
              ]}
              handler={handleSurfacePage}
              selected={summaryPageOption}
            />
          </ToggleWrapper>
          {summaryPageOption == 'customer_copy' && (
            <PDFExport
              scale={0.75}
              paperSize="A4"
              ref={(component) => (pdfExportComponent.current = component)}
            >
              {customerCopyWidth ? (
                <CustomerCopy
                  pdfExportComponent={pdfExportComponent}
                  customerCopyWidth={customerCopyWidth}
                  scrollRef={scrollRef}
                  scrollToEnd={scrollToEnd}
                />
              ) : (
                <div
                  ref={ppiBoxRef}
                  style={{
                    height: '11in',
                    width: '8.27in',
                    left: '100%',
                    position: 'fixed',
                    top: '100%',
                  }}
                ></div>
              )}
            </PDFExport>
          )}

          {summaryPageOption == 'purchase_order' && (
            <PDFExport
              scale={0.75}
              paperSize="A4"
              ref={(component) => (pdfExportComponent.current = component)}
            >
              {customerCopyWidth ? (
                <PurchaseOrder
                  pdfExportComponent={pdfExportComponent}
                  customerCopyWidth={customerCopyWidth}
                />
              ) : (
                <div
                  ref={ppiBoxRef}
                  style={{
                    height: '11in',
                    width: '8.27in',
                    left: '100%',
                    position: 'fixed',
                    top: '100%',
                  }}
                ></div>
              )}
            </PDFExport>
          )}

          {summaryPageOption == 'work_order' && (
            <PDFExport
              scale={0.75}
              paperSize="A4"
              ref={(component) => (pdfExportComponent.current = component)}
            >
              {customerCopyWidth ? (
                <WorkOrder
                  pdfExportComponent={pdfExportComponent}
                  customerCopyWidth={customerCopyWidth}
                />
              ) : (
                <div
                  ref={ppiBoxRef}
                  style={{
                    height: '11in',
                    width: '8.27in',
                    left: '100%',
                    position: 'fixed',
                    top: '100%',
                  }}
                ></div>
              )}
            </PDFExport>
          )}
        </ParentWrapper>
      </Grid>
      <Grid item xs={3}>
        <RightNav scrollToEnd={scrollToEnd} view={view} setView={setView} />
      </Grid>
    </Grid>
  );
}

export default EstimateSummary;
