import React, { useState, useRef } from 'react';
import MultiSelect from './MultiSelect';
import { useAppState } from '../../../Context/AppContext';
import { useSurfaceProductionRatesState } from '../../../Context/SurfaceProductionRates';
import { useProductState } from '../../../Context/ProductContext';
import statsApi from './statsApi';
import columnsApi from './columnsApi';
import { styled, Box, Typography, Collapse } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import EditableName from './EditableName';
import Toolbar from './ToolBar';
import { useDrag, useDrop } from 'react-dnd';
import DragAndDropIcon from '../../../resources/DragAndDropIcon';
import {
  useReportState,
  useReportDispatch,
  updatePosition,
  addReportAtPosition,
} from '../../../Context/Report';

const ReportTyp = styled(Typography)({
  fontSize: '16px',
  fontFamily: 'Medium',
  color: 'black',
  display: 'flex',
  alignItems: 'center',
});

const HeaderInnerWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const ToolbarWrapper = styled(Box)({
  paddingRight: 10,
});

const HeaderWrapper = styled(Box)({
  paddingTop: 40,
  paddingBottom: 24,
  display: 'flex',
});

const SummaryInnerWrapper = styled(Box)({
  marginBottom: '24px',
  borderTop: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
  padding: '0px 12px 45px',
  backgroundColor: '#fff',
});

export const headingStyling = {
  fontSize: '14px',
  fontFamily: 'Medium',
};

const SIIWrapper = styled(Box)({
  paddingTop: 45,
});

const MultiSelectWrapper = styled(Box)({
  paddingTop: 45,
  paddingBottom: 25,
  paddingLeft: 16,
  height: 35,
});

const Alert = styled(MuiAlert)({
  margin: '60px auto auto',
  width: '50%',
});

const ParentWrapper = styled(Box)({
  borderBlockWidth: '1px',
  borderBlockStyle: 'solid',
  borderBlockColor: '#fff',
  '&:hover': {
    borderBlockColor: '#1488FC',
    background: 'rgba(21,135,250,0.1)',
  },
});

const MenuWrapper = styled(Box)({
  cursor: 'move',
  alignItems: 'center',
  display: 'flex',
});

export const ReportTable = (props) => {
  const {
    type,
    selected,
    options,
    label,
    children,
    index,
    ...remainingProps
  } = props;
  const reports = useReportState();
  const reportDispatch = useReportDispatch();
  const [showToolbar, setShowToolbar] = useState(null);
  const appState = useAppState();
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const productState = useProductState();
  const dragRef = useRef();
  const dropRef = useRef();

  const [{}, drag, preview] = useDrag({
    item: {
      type: 'Report',
      index: index,
    },
  });

  const [{ hoveringItem, canDrop, isOver }, drop] = useDrop({
    accept: ['Report', 'Report_Type'],
    drop: (item) => {
      item &&
        (item.type === 'Report'
          ? item.index !== index &&
            updatePosition(reportDispatch, {
              oldIndex: item.index,
              newIndex: index,
            })
          : addReportAtPosition(reportDispatch, {
              index,
              report: {
                ...item.report,
                position:
                  reports.length > 0
                    ? Math.max(...reports.map((s) => s.position)) + 1
                    : 1,
              },
            }));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop:
        monitor.getItem() && monitor.getItem().type === 'Report'
          ? monitor.getItem().index !== index
          : true,
      hoveringItem: monitor.getItem(),
    }),
  });

  drag(dragRef);
  drop(dropRef);
  return (
    <div className="room">
      <div
        ref={dropRef}
        style={{
          ...(isOver &&
            canDrop &&
            hoveringItem &&
            (hoveringItem.type === 'Report'
              ? hoveringItem.index > index
                ? { borderTop: '#1488FC 1px solid' }
                : { borderBottom: '#1488FC 1px solid' }
              : { border: '#1488FC 1px solid' })),
        }}
      >
        <ParentWrapper
          onMouseEnter={() => setShowToolbar(true)}
          onMouseLeave={() => setShowToolbar(false)}
        >
          <HeaderWrapper ref={preview}>
            <div
              ref={dragRef}
              className="dragIcon"
              style={{ display: 'flex', cursor: 'move' }}
            >
              <MenuWrapper>
                <DragAndDropIcon />
              </MenuWrapper>
            </div>
            <HeaderInnerWrapper>
              <ReportTyp>{type}</ReportTyp>
              <ToolbarWrapper>
                <Toolbar index={index} show={showToolbar} />
              </ToolbarWrapper>
            </HeaderInnerWrapper>
          </HeaderWrapper>
          <Collapse orientation="horizontal" in={!hoveringItem}>
            <SummaryInnerWrapper>
              {!selected && (
                <MultiSelectWrapper>
                  <MultiSelect
                    options={options}
                    selected={selected}
                    type={type}
                    label={label}
                    index={index}
                  />
                </MultiSelectWrapper>
              )}
              {selected && (
                <SIIWrapper>
                  <EditableName
                    options={options}
                    optionsFetchRequire={false}
                    type={type}
                    label={label}
                    name={selected.name}
                    index={index}
                    selected={selected}
                  />
                  {React.cloneElement(children, {
                    ...remainingProps,
                    rows: statsApi(type, {
                      parentRoomId: selected.parentRoomId,
                      roomId: selected.roomId,
                      actionId: selected.actionId,
                      appState,
                      surfaceProductionRatesState,
                      productState,
                    }),
                    columns: columnsApi(type),
                  })}
                </SIIWrapper>
              )}
              {!selected && (
                <Alert severity="warning">{`Please select a ${
                  label.charAt(0).toLowerCase() + label.slice(1)
                } to render report`}</Alert>
              )}
            </SummaryInnerWrapper>
          </Collapse>
        </ParentWrapper>
      </div>
    </div>
  );
};
