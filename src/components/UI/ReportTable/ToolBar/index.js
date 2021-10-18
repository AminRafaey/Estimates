import React from 'react';
import { useReportState } from '../../../../Context/Report';
import { DeleteIcon } from '../../../../resources';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {
  useReportDispatch,
  moveUp,
  moveDown,
  deleteReport,
} from '../../../../Context/Report';

import { styled, Box, Paper } from '@material-ui/core';

const ContentWrapper = styled(Box)({
  display: 'flex',
});

const IconWrapper = styled(Box)({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#eeeeee',
  },
  padding: '6px',
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function Toolbar({ show, index }) {
  const report = useReportState();
  const reportDispatch = useReportDispatch();
  return (
    <Paper style={{ ...(!show && { visibility: 'hidden' }) }}>
      <ContentWrapper>
        <IconWrapper
          style={{
            ...(index === 0 && { pointerEvents: 'none', opacity: 0.5 }),
          }}
          onClick={() => moveUp(reportDispatch, { index: index })}
        >
          <ArrowUpwardIcon height={24} width={24}></ArrowUpwardIcon>
        </IconWrapper>
        <IconWrapper
          style={{
            ...(index == report.length - 1 && {
              pointerEvents: 'none',
              opacity: 0.5,
            }),
          }}
          onClick={() => moveDown(reportDispatch, { index: index })}
        >
          <ArrowDownwardIcon height={24} width={24}>
            Down
          </ArrowDownwardIcon>
        </IconWrapper>
        <IconWrapper
          onClick={() => deleteReport(reportDispatch, { index: index })}
        >
          <DeleteIcon height={24} width={24}></DeleteIcon>
        </IconWrapper>
      </ContentWrapper>
    </Paper>
  );
}

export default Toolbar;
