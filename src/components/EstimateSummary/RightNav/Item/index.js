import React, { useRef } from 'react';
import { ListItem, ListItemText } from '@material-ui/core';
import {
  addReport,
  useReportDispatch,
  useReportState,
} from '../../../../Context/Report';
import { useDrag } from 'react-dnd';
import { styled, Box } from '@material-ui/core';
import DragAndDropIcon from '../../../../resources/DragAndDropIcon';
const MenuWrapper = styled(Box)({
  cursor: 'move',
  alignItems: 'center',
  display: 'flex',
  width: 30,
});

function Item({ scrollToEnd, report }) {
  const reportDispatch = useReportDispatch();
  const reports = useReportState();
  const dragRef = useRef();

  const [{}, drag, preview] = useDrag({
    item: {
      type: 'Report_Type',
      report: report,
    },
  });

  drag(dragRef);
  return (
    <div style={{ display: 'flex' }} ref={preview} className="room">
      <div
        ref={dragRef}
        className="dragIcon"
        style={{ display: 'flex', cursor: 'move' }}
      >
        <MenuWrapper>
          <DragAndDropIcon />
        </MenuWrapper>
      </div>
      <ListItem
        style={{ paddingLeft: 0 }}
        button
        onClick={() => {
          addReport(reportDispatch, {
            report: {
              ...report,
              position:
                reports.length > 0
                  ? Math.max(...reports.map((s) => s.position)) + 1
                  : 1,
            },
          });
          setTimeout(() => scrollToEnd(), 250);
        }}
      >
        <ListItemText primary={report.reportType} />
      </ListItem>
    </div>
  );
}

export default Item;
