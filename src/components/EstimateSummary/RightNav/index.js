import React, { useState } from 'react';
import { reportTypes } from '../../constants/report';
import { Box, styled, List } from '@material-ui/core';
import Item from './Item';
import ToggleButton from './ToggleButton';
import { Typography } from 'antd';

const RightNavBar = styled(Box)({
  backgroundColor: '#ffffff',
  height: 'calc(100vh - 74px)',
  overflowY: 'auto',
  paddingTop: '24px',
});

const SettingTyp = styled(Typography)({
  fontSize: 12,
  color: '#9a9a9d',
  paddingLeft: 16,
  paddingBottom: 8,
});

const ReportTyp = styled(Typography)({
  fontSize: 12,
  color: '#9a9a9d',
});

const ViewTyp = styled(Typography)({
  fontSize: 16,
  fontFamily: 'Medium',
  paddingLeft: 16,
  paddingRight: 16,
});

const ToggleWrapper = styled(Box)({
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
});
const ReportsWrapper = styled(Box)({
  paddingLeft: 16,
});
function RightNav({ scrollToEnd, view, setView }) {
  return (
    <RightNavBar>
      <SettingTyp>SETTINGS</SettingTyp>
      <ToggleWrapper>
        <ViewTyp>Report View</ViewTyp>
        <ToggleButton
          toggleArray={[
            { label: 'PDF View', value: 'PDF' },
            { label: 'Normal View', value: 'Normal' },
          ]}
          handler={(value) => setView(value)}
          selected={view}
        />
      </ToggleWrapper>
      <ReportsWrapper>
        <ReportTyp>REPORTS</ReportTyp>
        <List component="nav" style={{ paddingTop: 0 }}>
          {reportTypes.map((rep, i) => (
            <Item button key={i} report={rep} scrollToEnd={scrollToEnd} />
          ))}
        </List>
      </ReportsWrapper>
    </RightNavBar>
  );
}

export default RightNav;
